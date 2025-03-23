import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

interface User {
  _id: string;
  fullName: {
    firstName: string;
    lastName: string;
  };
  username: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

interface UserMethods {
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema<User, {}, UserMethods>(
  {
    fullName: {
      firstName: {
        type: String,
        required: true,
        minlength: [3, "First name must be at least 3 characters long"],
      },
      lastName: {
        type: String,
        required: true,
        minlength: [3, "Last name must be at least 3 characters long"],
      },
    },
    username: {
      type: String,
      required: true,
      minlength: [3, "Username must be at least 3 characters long"],
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minlength: [8, "Password must be at least 8 characters long"],
    }
  }, { timestamps: true }
);

// Hash the password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 12);
  }

  next();
});

// Compare the password with the hashed password
userSchema.methods.comparePassword = async function (candidatePassword: string) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.models.User || mongoose.model<User>("User", userSchema);

export { User };