// server/seed.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User'); // Import your User model

// Load environment variables from the root of the server folder
dotenv.config();

const seedUsers = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log('MongoDB connected successfully for seeding.');

        // Clear existing test users to prevent duplicates
        await User.deleteMany({
            email: {
                $in: ['test.procurement@example.com', 'vendor.a@example.com', 'vendor.b@example.com'],
            },
        });
        console.log('Existing test users deleted.');

        // Create new test users
        const users = await User.create([
            {
                name: 'Test Officer',
                email: 'test.procurement@example.com',
                password: 'testpassword123', // The pre-save hook will hash this
                role: 'ProcurementOfficer',
            },
            {
                name: 'Vendor A',
                email: 'vendor.a@example.com',
                password: 'testpassworda',
                role: 'Vendor',
            },
            {
                name: 'Vendor B',
                email: 'vendor.b@example.com',
                password: 'testpasswordb',
                role: 'Vendor',
            },
        ]);

        console.log('Test users created successfully:', users);
        mongoose.connection.close();
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

seedUsers();
