const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '..', '..', '.env') });
const User = require('../models/User');

const resetAll = async () => {
  try {
    const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/aquaquest';
    await mongoose.connect(uri);
    console.log('[Reset] Connected to MongoDB');

    // Clean up any legacy accounts with old domain or usernames
    await User.deleteMany({
      email: { $in: ['admin@aquaquest.org'] },
    });

    // 1. Reset Admin
    const adminEmail = 'admin@aquaquest.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'AquaAdmin123!';
    let admin = await User.findOne({ email: adminEmail });
    if (!admin) {
      admin = new User({
        username: 'admin',
        email: adminEmail,
        password: adminPassword,
        role: 'admin',
        totalPoints: 1200,
        level: 5,
        levelTitle: 'Water Conservation Hero',
        currentStreak: 7,
        maxStreak: 15,
        waterSavedLiters: 550,
      });
    } else {
      admin.username = 'admin';
      admin.password = adminPassword;
      admin.role = 'admin';
    }
    await admin.save();
    console.log(`[Reset] Admin user set: ${adminEmail} (username: admin)`);

    // 2. Reset / Create Standard Demo User
    const userEmail = 'user@aquaquest.com';
    const userPassword = process.env.DEMO_USER_PASSWORD || 'AquaUser123!';
    let user = await User.findOne({ email: userEmail });
    if (!user) {
      user = new User({
        username: 'user',
        email: userEmail,
        password: userPassword,
        role: 'user',
        totalPoints: 250,
        level: 2,
        levelTitle: 'Water Shield',
        currentStreak: 4,
        maxStreak: 5,
        waterSavedLiters: 150,
        badges: [{ badgeCode: 'FIRST_SPLASH' }, { badgeCode: 'AQUIFER_DEFENDER' }],
      });
    } else {
      user.username = 'user';
      user.password = userPassword;
      user.role = 'user';
    }
    await user.save();
    console.log(`[Reset] Standard user set: ${userEmail} (username: user)`);

    // 3. Update existing demo users to use userPassword
    const demoUsers = await User.find({ role: 'user', email: { $ne: userEmail } });
    for (const dUser of demoUsers) {
      dUser.password = userPassword;
      await dUser.save();
    }
    console.log(`[Reset] Updated ${demoUsers.length} other demo users with password: ${userPassword}`);

    // 4. Verify password hashing
    const testAdmin = await User.findOne({ email: adminEmail }).select('+password');
    const adminMatch = await testAdmin.matchPassword(adminPassword);
    console.log('Admin password verification:', adminMatch ? '✅ PASSED' : '❌ FAILED');

    const testUser = await User.findOne({ email: userEmail }).select('+password');
    const userMatch = await testUser.matchPassword(userPassword);
    console.log('User password verification:', userMatch ? '✅ PASSED' : '❌ FAILED');

    await mongoose.disconnect();
    console.log('[Reset] All credentials updated successfully!');
  } catch (err) {
    console.error('Error resetting credentials:', err);
    process.exit(1);
  }
};

resetAll();
