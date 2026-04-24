const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Admin = require('./models/Admin');
const Batch = require('./models/Batch');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const importData = async () => {
  try {
    await Admin.deleteMany();
    await Batch.deleteMany();

    const batches = [
      { name: '8 to 10', startTime: '08:00', endTime: '10:00' },
      { name: '10 to 12', startTime: '10:00', endTime: '12:00' },
      { name: '12 to 2', startTime: '12:00', endTime: '14:00' },
      { name: '2 to 4', startTime: '14:00', endTime: '16:00' },
      { name: '4 to 6', startTime: '16:00', endTime: '18:00' },
      { name: '6 to 8', startTime: '18:00', endTime: '20:00' },
    ];
    await Batch.insertMany(batches);

    const adminUser = {
      username: 'Uttam bhadiyadra',
      password: 'uttam@99', // This will be hashed by the model pre-save hook
      role: 'Uttam bhadiyadra'
    };

    await Admin.create(adminUser);

    console.log('Data Imported!');
    process.exit();
  } catch (error) {
    console.error(`${error}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Admin.deleteMany();
    console.log('Data Destroyed!');
    process.exit();
  } catch (error) {
    console.error(`${error}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
