const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '..', '..', '.env') });
const User = require('../models/User');

const resetAdmin = async () => {
  try {
    const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/aquaquest';
    await mongoose.connect(uri);
    console.log('Connected to DB');

    const adminEmail = (process.env.ADMIN_EMAIL || 'admin@aquaquest.org').toLowerCase();
    const adminPassword = process.env.ADMIN_PASSWORD || 'AdminPass123!';

    let admin = await User.findOne({ email: adminEmail });
    if (!admin) {
      console.log('Admin user not found. Creating new admin...');
      admin = new User({
        username: process.env.ADMIN_USERNAME || 'AdminAqua',
        email: adminEmail,
        password: adminPassword,
        role: 'admin',
      });
    } else {
      console.log('Updating password for existing admin user:', adminEmail);
      admin.password = adminPassword;
    }

    await admin.save();
    console.log(`✅ Admin password successfully set to: "${adminPassword}" for email: "${adminEmail}"`);

    // Verify login match
    const isMatch = await admin.matchPassword(adminPassword);
    console.log('Password match verification:', isMatch ? '✅ PASSED' : '❌ FAILED');

    await mongoose.disconnect();
  } catch (err) {
    console.error('Error resetting admin password:', err);
    process.exit(1);
  }
};

resetAdmin();
