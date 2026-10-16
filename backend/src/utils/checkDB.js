const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '..', '..', '.env') });

const checkDB = async () => {
  try {
    const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/aquaquest';
    console.log('Connecting to:', uri);
    await mongoose.connect(uri);
    console.log('✅ Connected to MongoDB successfully!');
    
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('\n--- Database Collections & Document Counts ---');
    for (let col of collections) {
      const count = await mongoose.connection.db.collection(col.name).countDocuments();
      console.log(`- Collection [${col.name}]: ${count} records`);
    }
    
    await mongoose.disconnect();
    console.log('\nVerification complete.');
  } catch (err) {
    console.error('❌ Connection Error:', err.message);
    process.exit(1);
  }
};

checkDB();
