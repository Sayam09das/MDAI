// Migration script to add model field to existing complaints
// Run: node backend/utils/migrateComplaints.js

import mongoose from "mongoose";
import dotenv from "dotenv";
import Complaint from "../models/complaintModel.js";
import User from "../models/userModel.js";
import Teacher from "../models/teacherModel.js";
import Admin from "../models/adminModel.js";

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/mdai";

const migrate = async () => {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log("✅ Connected to MongoDB");

        // Find all complaints without model field
        const complaints = await Complaint.find({
            $or: [
                { "sender.model": { $exists: false } },
                { "recipient.model": { $exists: false } }
            ]
        });

        console.log(`Found ${complaints.length} complaints needing migration`);

        let updated = 0;
        let errors = 0;

        for (const complaint of complaints) {
            try {
                let senderModel = "User";
                let recipientModel = "User";

                // Determine sender model based on role
                if (complaint.sender.role === "teacher") {
                    senderModel = "Teacher";
                } else if (complaint.sender.role === "admin") {
                    senderModel = "Admin";
                }

                // Determine recipient model based on role
                if (complaint.recipient.role === "teacher") {
                    recipientModel = "Teacher";
                } else if (complaint.recipient.role === "admin") {
                    recipientModel = "Admin";
                }

                // Update the complaint
                await Complaint.findByIdAndUpdate(complaint._id, {
                    $set: {
                        "sender.model": senderModel,
                        "recipient.model": recipientModel
                    }
                });

                updated++;
                console.log(`✅ Migrated complaint: ${complaint._id}`);
            } catch (err) {
                errors++;
                console.error(`❌ Error migrating complaint ${complaint._id}:`, err.message);
            }
        }

        console.log("\n📊 Migration Summary:");
        console.log(`Total found: ${complaints.length}`);
        console.log(`Updated: ${updated}`);
        console.log(`Errors: ${errors}`);

        if (errors === 0) {
            console.log("\n🎉 All complaints migrated successfully!");
        } else {
            console.log("\n⚠️ Some complaints failed to migrate. Check errors above.");
        }

        process.exit(errors > 0 ? 1 : 0);
    } catch (error) {
        console.error("❌ Migration failed:", error);
        process.exit(1);
    }
};

migrate();

