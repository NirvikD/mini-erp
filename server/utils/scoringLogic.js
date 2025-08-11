// A utility to calculate a score for a vendor quote.
// A higher score indicates a better quote.
const scoringLogic = {
  calculateScore: ({ cost, deliveryDate, vendorRating, averageCost, averageDeliveryTime }) => {
    // We want to give higher scores to lower costs and faster delivery times.
    // So, we'll use a normalized value for cost and delivery.
    // For simplicity, let's assume we're comparing against an average.

    let score = 0;

    // 1. Cost Score: Lower cost is better.
    // If the quote's cost is lower than the average, it gets more points.
    // We can normalize this to a 0-10 scale.
    // Example: (1 - (cost / averageCost)) * 10
    // If cost is 50% of average, score is (1 - 0.5) * 10 = 5.
    // If cost is 120% of average, score is (1 - 1.2) * 10 = -2.
    // Let's cap the score to a reasonable range.
    if (averageCost > 0) {
      const costFactor = 1 - (cost / averageCost);
      score += Math.max(-5, Math.min(costFactor * 10, 10));
    }

    // 2. Delivery Time Score: Faster delivery is better.
    // We'll calculate the difference in days from the average delivery time.
    const today = new Date();
    const deliveryTimeInDays = (new Date(deliveryDate) - today) / (1000 * 60 * 60 * 24);
    
    if (averageDeliveryTime > 0) {
      const deliveryFactor = 1 - (deliveryTimeInDays / averageDeliveryTime);
      score += Math.max(-5, Math.min(deliveryFactor * 10, 10));
    }

    // 3. Vendor Rating Score: Higher rating is better.
    // The rating is a simple 1-5 star score. We can scale it to a 0-10 score.
    // A score of 3 is neutral (0 points).
    const ratingFactor = (vendorRating - 3) * 2;
    score += ratingFactor;

    return score;
  },
};

module.exports = scoringLogic;