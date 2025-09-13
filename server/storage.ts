// This application doesn't require persistent storage
// Code generation is stateless and doesn't need data persistence

export interface IStorage {
  // Placeholder for future storage needs
}

export class MemStorage implements IStorage {
  constructor() {
    // No storage needed for this application
  }
}

export const storage = new MemStorage();
