// Seed script to populate teachers and admins for complaint system
// Run: node backend/utils/seedRecipients.js

import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import Teacher from "../models/teacherModel.js";
import Admin from "../models/adminModel.js";
import User from "../models/userModel.js";

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/mdai";

const seedData = async () => {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log("✅ Connected to MongoDB");

        // Check existing data
        const existingTeachers = await Teacher.countDocuments();
        const existingAdmins = await Admin.countDocuments();
        const existingStudents = await User.countDocuments();

        console.log(`Current Teachers: ${existingTeachers}`);
        console.log(`Current Admins: ${existingAdmins}`);
        console.log(`Current Students: ${existingStudents}`);

        // Only seed if no data exists
        if (existingTeachers === 0) {
            const hashedPassword = await bcrypt.hash("password123", 10);

            await Teacher.insertMany([
                {
                    fullName: "John Doe",
                    email: "john.teacher@example.com",
                    phone: "1234567890",
                    address: "123 Teacher Street",
                    gender: "male",
                    password: hashedPassword,
                    isVerified: true,
                    isSuspended: false,
                    about: "Mathematics Teacher",
                    skills: ["Math", "Algebra", "Calculus"],
                    experience: 5
                },
                {
                    fullName: "Jane Smith",
                    email: "jane.teacher@example.com",
                    phone: "1234567891",
                    address: "456 Teacher Avenue",
                    gender: "female",
                    password: hashedPassword,
                    isVerified: true,
                    isSuspended: false,
                    about: "Science Teacher",
                    skills: ["Physics", "Chemistry", "Biology"],
                    experience: 7
                },
                {
                    fullName: "Robert Johnson",
                    email: "robert.teacher@example.com",
                    phone: "1234567892",
                    address: "789 Teacher Road",
                    gender: "male",
                    password: hashedPassword,
                    isVerified: true,
                    isSuspended: false,
                    about: "English Teacher",
                    skills: ["Literature", "Writing", "Grammar"],
                    experience: 3
                }
            ]);
            console.log("✅ Created 3 Teachers with fullName field");
        }

        if (existingAdmins === 0) {
            const hashedPassword = await bcrypt.hash("admin123", 10);

            await Admin.insertMany([
                {
                    name: "Super Admin",
                    email: "admin@example.com",
                    password: hashedPassword,
                    role: "admin",
                    isActive: true
                },
                {
                    name: "Support Admin",
                    email: "support@example.com",
                    password: hashedPassword,
                    role: "admin",
                    isActive: true
                }
            ]);
            console.log("✅ Created 2 Admins with name field");
        }

        if (existingStudents === 0) {
            const hashedPassword = await bcrypt.hash("password123", 10);

            await User.insertMany([
                {
                    fullName: "Alice Student",
                    email: "alice@example.com",
                    phone: "9876543210",
                    address: "123 Student Lane",
                    gender: "female",
                    password: hashedPassword,
                    isSuspended: false,
                    isVerified: true
                },
                {
                    fullName: "Bob Learner",
                    email: "bob@example.com",
                    phone: "9876543211",
                    address: "456 Student Way",
                    gender: "male",
                    password: hashedPassword,
                    isSuspended: false,
                    isVerified: true
                }
            ]);
            console.log("✅ Created 2 Students with fullName field");
        }

        console.log("\n📋 Seed Summary:");
        console.log("Teachers now have: fullName field ✅");
        console.log("Admins now have: name field ✅");
        console.log("Students now have: fullName field ✅");

        console.log("\n🔐 Login Credentials:");
        console.log("Teacher: john.teacher@example.com / password123");
        console.log("Admin: admin@example.com / admin123");
        console.log("Student: alice@example.com / password123");

        process.exit(0);
    } catch (error) {
        console.error("❌ Seed error:", error);
        process.exit(1);
    }
};

seedData();

