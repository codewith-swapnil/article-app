import { MemoryStorage } from "./memoryFallback";

let storage: MemoryStorage;

// Use memory storage for reliable startup in Replit environment
storage = new MemoryStorage();
console.log('✓ Using Memory storage');

export { storage };
export type { IStorage } from "./memoryFallback";