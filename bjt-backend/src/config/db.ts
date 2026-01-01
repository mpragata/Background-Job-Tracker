/**
 * db.ts
 *
 * Initializes and manages a shared MongoDB database connection.
 */
import { MongoClient, ServerApiVersion, Db } from "mongodb";

// Determine DB connection from env
const uri = process.env.MONGO_URI;
const dbName = process.env.DB_NAME;

let client: MongoClient | null = null;

let dbInstance: Db | null = null;

export async function connectDB(): Promise<Db> {
  if (!uri || !dbName) {
    console.error(
      "ERROR: MONGO_URI or DB_NAME environment variable is not defined. Please check your .env file."
    );
    process.exit(1);
  }

  // MongoClient instance
  const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  });

  if (dbInstance) {
    console.log("MongoDB instance already connected.");
    return dbInstance;
  }

  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log(`🚀 Connected to MongoDB (${process.env.NODE_ENV || "dev"})!`);

    dbInstance = client.db(dbName);
    return dbInstance;
  } catch (err) {
    console.error("Failed to connect to MongoDB:", err);
    process.exit(1);
  }
}

export async function closeDB(): Promise<void> {
  if (client) {
    await client.close();
    console.log("MongoDB connection closed.");
  }
}
