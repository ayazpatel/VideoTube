import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const userHistorySchema = new Schema(
  {
      videoId: {
          type: Schema.Types.ObjectId,
          ref: "Video"
      },
      thumbnail: {
          type: String, // cloudinary url
          // required: true,
      },
      title: {
          type: String,
          // required: true
      },
      description: {
          type: String,
          // required: true
      },
      duration: {
          type: Number,
          // required: true
      },
      views: {
          type: Number,
      },
      owner: {
          type: Schema.Types.ObjectId,
          ref: "User"
      },
      rating: Number

  }, 
  {
      timestamps: true
  }
);

const userSchema = new Schema(
  {
      username: {
          type: String,
          required: true,
          unique: true,
          lowercase: true,
          trim: true, 
          index: true
      },
      email: {
          type: String,
          required: true,
          unique: true,
          lowecase: true,
          trim: true, 
      },
      fullName: {
          type: String,
          required: true,
          trim: true, 
          index: true
      },
      avatar: {
          type: String, // MinIO S3 url
          required: true,
      },
      coverImage: {
          type: String, // MinIO S3 url
      },
      history: [
          {
              type: Schema.Types.ObjectId,
              ref: "Video"
          }
        // ? up<-OR->down 
          // userHistorySchema
      ],
      password: {
          type: String,
          required: [true, 'Password is required']
      },
      refreshToken: {
          type: String
      }

  },
  {
      timestamps: true
  }
)

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 10);
  next(); 
});

userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      username: this.username,
      fullName: this.fullName,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};

export const User = mongoose.model("User", userSchema);