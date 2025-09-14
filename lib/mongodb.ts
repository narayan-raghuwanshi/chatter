import mongoose from "mongoose";

if (!process.env.MONGODB_URI) {
  throw new Error("Please define MONGODB_URI in your .env");
}

const MONGODB_URI = process.env.MONGODB_URI;

declare global {
  // Extend the global type to include mongoose cache
  var mongooseCache: MongooseCache | undefined;
}

type MongooseCache = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

let cached: MongooseCache;

if (!global.mongooseCache) {
  cached = global.mongooseCache = { conn: null, promise: null };
} else {
  cached = global.mongooseCache;
}

export async function connectToDB() {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI!)
      .then((mongoose) => mongoose);
  }
  cached.conn = await cached.promise;
  return cached.conn;
}
