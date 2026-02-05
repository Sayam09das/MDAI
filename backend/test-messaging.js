// Simple test script to verify messaging functionality
import mongoose from 'mongoose';
import User from './models/userModel.js';
import Teacher from './models/teacherModel.js';
import Conversation from './models/conversationModel.js';
import Message from './models/messageModel.js';

// Test the population functionality
async function testMessagingPopulation() {
  try {
    console.log('🧪 Testing messaging system population...');
    
    // Test conversation population
    const conversations = await Conversation.find({})
      .limit(5)
      .populate({
        path: "participants.userId",
        select: "fullName profileImage email",
      });
    
    console.log('📋 Sample conversations with populated participants:');
    conversations.forEach((conv, index) => {
      console.log(`\n--- Conversation ${index + 1} ---`);
      console.log(`ID: ${conv._id}`);
      conv.participants.forEach((participant, pIndex) => {
        console.log(`Participant ${pIndex + 1}:`);
        console.log(`  Model: ${participant.participantsModel}`);
        console.log(`  User ID: ${participant.userId?._id || participant.userId}`);
        console.log(`  Name: ${participant.userId?.fullName || 'Not populated'}`);
        console.log(`  Profile Image: ${participant.userId?.profileImage?.url || 'None'}`);
      });
    });
    
    // Test message population
    const messages = await Message.find({})
      .limit(5)
      .populate({
        path: "sender",
        select: "fullName profileImage email",
      });
    
    console.log('\n📨 Sample messages with populated senders:');
    messages.forEach((msg, index) => {
      console.log(`\n--- Message ${index + 1} ---`);
      console.log(`ID: ${msg._id}`);
      console.log(`Sender Model: ${msg.senderModel}`);
      console.log(`Sender ID: ${msg.sender?._id || msg.sender}`);
      console.log(`Sender Name: ${msg.sender?.fullName || 'Not populated'}`);
      console.log(`Content: ${msg.content.substring(0, 50)}...`);
    });
    
    console.log('\n✅ Messaging system test completed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Connect to database and run test
async function runTest() {
  try {
    // Use your MongoDB connection string
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/mdai';
    
    await mongoose.connect(MONGODB_URI);
    console.log('🔗 Connected to MongoDB');
    
    await testMessagingPopulation();
    
  } catch (error) {
    console.error('❌ Database connection failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

// Run the test if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runTest();
}

export { testMessagingPopulation };