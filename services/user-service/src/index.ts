import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User, { IUser } from './models/User';
import { authenticate, authorize, AuthRequest } from './middleware/auth';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/darwinx-users';
const JWT_SECRET = process.env.JWT_SECRET || 'default_secret';

app.use(cors());
app.use(express.json());

// Health Check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP', service: 'User Service' });
});

// Register (For demo purposes, usually restricted)
app.post('/api/users/register', async (req, res) => {
  try {
    const { email, password, fullName, role, tenantId } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = new User({
      email,
      passwordHash,
      fullName,
      role: role || 'EMPLOYEE',
      tenantId: tenantId || 'default-tenant'
    });

    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
});

// Login
app.post('/api/users/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign(
      { id: user._id, role: user.role, tenantId: user.tenantId },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ token, user: { id: user._id, fullName: user.fullName, role: user.role } });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// Get Profile (Protected)
app.get('/api/users/profile', authenticate, async (req: AuthRequest, res) => {
  try {
    const user = await User.findById(req.user.id).select('-passwordHash');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// Admin Only Route
app.get('/api/users/all', authenticate, authorize(['HR_ADMIN', 'PLATFORM_ADMIN']), async (req: AuthRequest, res) => {
  try {
    // Multi-tenancy check: Only return users from the same tenant
    const users = await User.find({ tenantId: req.user.tenantId }).select('-passwordHash');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB (User Service)');
    app.listen(PORT, () => console.log(`User Service running on port ${PORT}`));
  })
  .catch(err => console.error('MongoDB connection error:', err));
