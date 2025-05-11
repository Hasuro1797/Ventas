import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/mydatabase";

if (!MONGO_URI) {
  throw new Error("Please define the MONGO_URI environment variable inside .env");
}

const cached = globalThis as unknown as { mongoose: { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null } };

if (!cached.mongoose) {
  cached.mongoose = { conn: null, promise: null };
}

export const connectToMongoose = async () => {
  if (cached.mongoose.conn) {
    return cached.mongoose.conn;
  }

  if (!cached.mongoose.promise) {
    cached.mongoose.promise = mongoose.connect(MONGO_URI).then((mongoose) => mongoose);
  }

  cached.mongoose.conn = await cached.mongoose.promise;
  return cached.mongoose.conn;
};