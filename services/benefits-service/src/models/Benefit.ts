import mongoose, { Schema, Document } from 'mongoose';

export interface IBenefit extends Document {
  name: string;
  description: string;
  category: 'MEDICAL' | 'DENTAL' | 'VISION' | 'LIFE' | 'OTHER';
  coverageAmount: number;
  monthlyCost: number;
  tenantId: string;
}

const BenefitSchema: Schema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  category: { 
    type: String, 
    enum: ['MEDICAL', 'DENTAL', 'VISION', 'LIFE', 'OTHER'], 
    required: true 
  },
  coverageAmount: { type: Number, required: true },
  monthlyCost: { type: Number, required: true },
  tenantId: { type: String, required: true }
});

BenefitSchema.index({ tenantId: 1 });

export default mongoose.model<IBenefit>('Benefit', BenefitSchema);
