// Simple test script to verify messaging functionality
import mongoose from 'mongoose';
import User from './models/userModel.js';
import Teacher from './models/teacherModel.js';
import Conversation from './models/conversationModel.js';
import Message from './models/messageModel.js';

// Simple test script to verify messaging functionality
import mongoose from 'mongoose';
import User from './models/userModel.js';
import Teacher from './models/teacherModel.js';
import Conversation from './models/conversationModel.js';
import Message from './models/messageModel.js';

// Test the manual population functionality
async function testMessagingPopulation() {
  try {
    console.log('🧪 Testing messaging system with manual population...');
    
    // Test conversation manual population
    const conversations = await Conversation.find({}).limit(3);
    
    console.log('📋 Sample conversations with manual population:');
    for (let i = 0; i < conversations.length; i++) {
      const conv = conversations[i];
      console.log(`\n--- Conversation ${i + 1} ---`);
      console.log(`ID: ${conv._id}`);
      
      for (let j = 0; j < conv.participants.length; j++) {
        const participant = conv.participants[j];
        console.log(`Participant ${j + 1}:`);
        console.log(`  Model: ${participant.participantsModel}`);
        console.log(`  User ID: ${participant.userId}`);
        
        // Manual population test
        try {
          let userData = null;
          if (participant.participantsModel === "User") {
            userData = await User.findById(participant.userId).select("fullName profileImage email");
          } else if (participant.participantsModel === "Teacher") {
            userData = await Teacher.findById(participant.userId).select("fullName profileImage email");
          }
          
          console.log(`  Name: ${userData?.fullName || 'Not found'}`);
          console.log(`  Email: ${userData?.email || 'Not found'}`);
          console.log(`  Profile Image: ${userData?.profileImage?.url || 'None'}`);
        } catch (error) {
          console.log(`  Error: ${error.message}`);
        }
      }
    }
    
    // Test message manual population
    const messages = await Message.find({}).limit(3);
    
    console.log('\n📨 Sample messages with manual population:');
    for (let i = 0; i < messages.length; i++) {
      const msg = messages[i];
      console.log(`\n--- Message ${i + 1} ---`);
      console.log(`ID: ${msg._id}`);
      console.log(`Sender Model: ${msg.senderModel}`);
      console.log(`Sender ID: ${msg.sender}`);
      
      // Manual population test
      try {
        let senderData = null;
        if (msg.senderModel === "User") {
          senderData = await User.findById(msg.sender).select("fullName profileImage email");
        } else if (msg.senderModel === "Teacher") {
          senderData = await Teacher.findById(msg.sender).select("fullName profileImage email");
        }
        
        console.log(`Sender Name: ${senderData?.fullName || 'Not found'}`);
        console.log(`Sender Email: ${senderData?.email || 'Not found'}`);
      } catch (error) {
        console.log(`Error: ${error.message}`);
      }
      
      console.log(`Content: ${msg.content.substring(0, 50)}...`);
    }
    
    console.log('\n✅ Manual population test completed!');
    
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