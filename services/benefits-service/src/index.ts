import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import Benefit from './models/Benefit';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3002;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/darwinx-benefits';
const JWT_SECRET = process.env.JWT_SECRET || 'default_secret';

app.use(cors());
app.use(express.json());

// Middleware to extract user info
const authenticate = (req: any, res: any, next: any) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ message: 'Access Denied' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).json({ message: 'Invalid Token' });
  }
};

// Health Check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP', service: 'Benefits Service' });
});

// Get All Benefits (Tenant Scoped)
app.get('/api/benefits', authenticate, async (req: any, res) => {
  try {
    const benefits = await Benefit.find({ tenantId: req.user.tenantId });
    res.json(benefits);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// Add Benefit (HR Admin only)
app.post('/api/benefits', authenticate, async (req: any, res) => {
  try {
    if (req.user.role !== 'HR_ADMIN' && req.user.role !== 'PLATFORM_ADMIN') {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const { name, description, category, coverageAmount, monthlyCost } = req.body;
    
    const newBenefit = new Benefit({
      name,
      description,
      category,
      coverageAmount,
      monthlyCost,
      tenantId: req.user.tenantId
    });

    await newBenefit.save();
    res.status(201).json(newBenefit);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB (Benefits Service)');
    app.listen(PORT, () => console.log(`Benefits Service running on port ${PORT}`));
  })
  .catch(err => console.error('MongoDB connection error:', err));
