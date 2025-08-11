// server/services/quoteServices
const VendorQuote = require('../models/VendorQuote');
const RFQ = require('../models/RFQ'); // Import the RFQ model
const Rating = require('../models/Rating');
const scoringLogic = require('../utils/scoringLogic'); // Your scoring logic utility
const poService = require('./poService'); // Import the PO service

// This service handles quote submissions and comparison logic.
const quoteService = {
  // Submit a new quote for an RFQ
  async submitQuote(rfqId, vendorId, quoteData) {
    const newQuote = new VendorQuote({
      rfq: rfqId,
      vendor: vendorId,
      quoteItems: quoteData.items,
      deliveryDate: quoteData.deliveryDate,
      status: 'Submitted',
    });

    await newQuote.save();
    return newQuote;
  },

  // Get all quotes for a specific RFQ
  async getQuotesForRfq(rfqId) {
    return await VendorQuote.find({ rfq: rfqId }).populate('vendor');
  },

  // Compare quotes and return a ranked list based on scoring logic
  async compareAndRankQuotes(rfqId) {
    const quotes = await this.getQuotesForRfq(rfqId);

    // Fetch vendor ratings to use in the scoring
    const vendorRatings = await Rating.aggregate([
      { $group: { _id: "$vendor", averageRating: { $avg: "$score" } } }
    ]);

    // Map ratings to a a lookup object for easy access
    const ratingLookup = vendorRatings.reduce((acc, rating) => {
      acc[rating._id.toString()] = rating.averageRating;
      return acc;
    }, {});

    // Apply the scoring logic to each quote
    const rankedQuotes = quotes.map(quote => {
      const vendorRating = ratingLookup[quote.vendor._id.toString()] || 2; // Default to 2 if no rating
      const score = scoringLogic.calculateScore({
        cost: quote.totalPrice, // Assuming you have a totalPrice field in the quote
        deliveryDate: quote.deliveryDate,
        vendorRating: vendorRating,
      });

      return {
        ...quote.toObject(),
        score,
      };
    }).sort((a, b) => b.score - a.score); // Sort in descending order of score

    return rankedQuotes;
  },

  // Find a quote by its ID
  async getQuoteById(quoteId) {
    return await VendorQuote.findById(quoteId).populate('vendor').populate('rfq');
  },

  // Award a specific quote
  async awardQuote(quoteId, procurementOfficerId) {
    // 1. Find the winning quote and populate the necessary data
    const winningQuote = await VendorQuote.findById(quoteId)
      .populate('vendor')
      .populate('rfq');

    if (!winningQuote) {
      throw new Error('Winning quote not found.');
    }

    // 2. Update the status of the winning quote and the RFQ
    winningQuote.status = 'Awarded';
    await winningQuote.save();
    await RFQ.findByIdAndUpdate(winningQuote.rfq._id, { status: 'Completed' });

    // 3. Create the Purchase Order using the poService
    //    Pass the entire winningQuote object to avoid redundant DB calls.
    const newPO = await poService.createPO(winningQuote, procurementOfficerId);

    return newPO;
  },
};

module.exports = quoteService;
