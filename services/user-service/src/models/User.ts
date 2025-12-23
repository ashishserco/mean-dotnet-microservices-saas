import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  email: string;
  passwordHash: string;
  fullName: string;
  role: 'EMPLOYEE' | 'HR_ADMIN' | 'PLATFORM_ADMIN';
  tenantId: string;
  createdAt: Date;
}

const UserSchema: Schema = new Schema({
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  fullName: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['EMPLOYEE', 'HR_ADMIN', 'PLATFORM_ADMIN'], 
    default: 'EMPLOYEE' 
  },
  tenantId: { type: String, required: true }, // Multi-tenancy
  createdAt: { type: Date, default: Date.now }
});

// Index for faster lookups and tenant isolation
UserSchema.index({ email: 1 });
UserSchema.index({ tenantId: 1 });

export default mongoose.model<IUser>('User', UserSchema);
