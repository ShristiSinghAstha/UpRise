import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Admin from './models/Admin.model.js';
import User from './models/User.model.js';

dotenv.config();

const seedDatabase = async () => {
    try {
        // Connect to MongoDB
        const conn = await mongoose.connect(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/uprise");
        console.log(`MongoDB Connected: ${conn.connection.host}`);

        // Seed Admin User
        const adminData = {
            username: "admin",
            email: "admin@uprise.com",
            password: "admin123",
            role: "admin"
        };

        // Delete existing admin with this email or username to avoid unique key conflicts
        await Admin.deleteOne({
            $or: [{ email: adminData.email }, { username: adminData.username }]
        });

        await Admin.create(adminData);
        console.log('Admin account (re)created successfully.');
        console.log('Admin Credentials:');
        console.log(` Email: ${adminData.email}`);
        console.log(` Password: ${adminData.password}`);

        // Seed Sample User
        const userData = {
            username: "student",
            email: "student@uprise.com",
            password: "student123"
        };

        // Delete existing user with this email or username to avoid unique key conflicts
        await User.deleteOne({
            $or: [{ email: userData.email }, { username: userData.username }]
        });

        await User.create(userData);
        console.log('Sample student account (re)created successfully.');
        console.log('Student Credentials:');
        console.log(` Email: ${userData.email}`);
        console.log(` Password: ${userData.password}`);

        console.log('\nSeeding completed successfully!');
        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

seedDatabase();