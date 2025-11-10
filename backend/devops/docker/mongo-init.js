// MongoDB Initialization Script
// This script runs when MongoDB container is first created

db = db.getSiblingDB('joy');

// Create collections
db.createCollection('gifts');
db.createCollection('messages');
db.createCollection('friendships');

// Create indexes for better performance
db.gifts.createIndex({ "senderEmail": 1 });
db.gifts.createIndex({ "recipientEmail": 1 });
db.gifts.createIndex({ "createdAt": -1 });

db.messages.createIndex({ "senderEmail": 1 });
db.messages.createIndex({ "recipientEmail": 1 });
db.messages.createIndex({ "createdAt": -1 });

db.friendships.createIndex({ "userEmail": 1 });
db.friendships.createIndex({ "friendEmail": 1 });
db.friendships.createIndex({ "userEmail": 1, "friendEmail": 1 }, { unique: true });

print('✅ Joy database initialized successfully!');
print('📦 Collections created: gifts, messages, friendships');
print('🔍 Indexes created for optimal query performance');

