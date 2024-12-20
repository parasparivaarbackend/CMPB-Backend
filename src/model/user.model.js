import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs";

const RegisterPackage = new Schema(
  {
    PremiumMember: {
      type: Boolean,
      require: true,
      default: false,
    },
    amount: {
      type: Number,
    },
    PaymentID: {
      type: String,
    },
    OrderID: {
      type: String,
    },
  },
  { timestamps: true }
);

const UserSchema = new mongoose.Schema(
  {
    MemberID: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      index: true,
    },
    firstName: {
      type: String,
      required: [true, "First name is required."],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, "Last name is required."],
      trim: true,
    },
    gender: {
      type: String,
      enum: {
        values: ["male", "female"],
        message: "Gender must be either male or female.",
      },
    },
    DOB: {
      type: String,
      trim: true,
    },
    profileImage: {
      ImageID: {
        type: String,
      },
      ImageURL: {
        type: String,
      },
    },
    email: {
      type: String,
      trim: true,
      sparse: true,
      required: true,
      lowercase: true,
      index: { unique: true, sparse: true },
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    isPhoneVerified: {
      type: Boolean,
      default: false,
    },
    phone: {
      type: String,
      trim: true,
      sparse: true,
      required: true,
      index: { unique: true, sparse: true },
    },
    password: {
      type: String,
      required: [true, "password is required"],
      trim: true,
    },
    role: {
      type: String,
      required: true,
      trim: true,
      enum: ["admin", "user"],
      default: "user",
    },
    RegisterPackage: {
      type: RegisterPackage,
    },
    ProfileID: {
      type: Schema.Types.ObjectId,
      ref: "profiles",
    },
  },
  { timestamps: true }
);

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

UserSchema.methods.comparePassword = async function (password) {
  return (this.password = bcrypt.compare(password, this.password));
};

export const UserModel = mongoose.model("users", UserSchema);
