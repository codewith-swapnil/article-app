import { MongoStorage } from "./mongoStorage";
import { MemoryStorage } from "./memoryFallback";

let storage: MongoStorage | MemoryStorage;

try {
  // Try to use MongoDB storage
  storage = new MongoStorage();
  console.log('✓ Using MongoDB storage');
} catch (error) {
  // Fallback to memory storage
  console.warn('MongoDB unavailable, using memory storage:', error);
  storage = new MemoryStorage();
}

export { storage };
export type { IStorage } from "./memoryFallback";