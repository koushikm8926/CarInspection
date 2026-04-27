import * as SQLite from 'expo-sqlite';

export const dbName = 'car_inspection.db';

export interface InspectionRecord {
  id: string;
  userId: string;
  vehicleName: string;
  status: 'draft' | 'pending' | 'completed' | 'uploaded';
  data: string; // JSON string
  createdAt: string;
}

export interface PhotoRecord {
  id: string;
  inspectionId: string;
  uri: string;
  type: string;
  status: 'pending' | 'uploaded';
  metadata: string; // JSON string
}

export const initDatabase = async () => {
  const db = await SQLite.openDatabaseAsync(dbName);

  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    
    CREATE TABLE IF NOT EXISTS inspections (
      id TEXT PRIMARY KEY NOT NULL,
      userId TEXT NOT NULL,
      vehicleName TEXT,
      status TEXT NOT NULL,
      data TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS photos (
      id TEXT PRIMARY KEY NOT NULL,
      inspectionId TEXT NOT NULL,
      uri TEXT NOT NULL,
      type TEXT,
      status TEXT NOT NULL,
      metadata TEXT,
      FOREIGN KEY (inspectionId) REFERENCES inspections (id)
    );

    CREATE TABLE IF NOT EXISTS sync_queue (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      action TEXT NOT NULL,
      payload TEXT NOT NULL,
      attempts INTEGER DEFAULT 0,
      lastAttempt DATETIME
    );

    CREATE TABLE IF NOT EXISTS vehicles (
      id TEXT PRIMARY KEY NOT NULL,
      userId TEXT NOT NULL,
      make TEXT,
      model TEXT,
      year TEXT,
      plate TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  return db;
};

export const databaseService = {
  async getDb() {
    return await SQLite.openDatabaseAsync(dbName);
  },

  // Inspection Methods
  async createInspection(inspection: InspectionRecord) {
    const db = await this.getDb();
    await db.runAsync(
      'INSERT INTO inspections (id, userId, vehicleName, status, data) VALUES (?, ?, ?, ?, ?)',
      [inspection.id, inspection.userId, inspection.vehicleName, inspection.status, inspection.data]
    );
  },

  async getInspections(userId: string) {
    const db = await this.getDb();
    return await db.getAllAsync<InspectionRecord>(
      'SELECT * FROM inspections WHERE userId = ? ORDER BY createdAt DESC',
      [userId]
    );
  },

  async updateInspectionStatus(id: string, status: string) {
    const db = await this.getDb();
    await db.runAsync('UPDATE inspections SET status = ? WHERE id = ?', [status, id]);
  },

  // Photo Methods
  async addPhoto(photo: PhotoRecord) {
    const db = await this.getDb();
    await db.runAsync(
      'INSERT INTO photos (id, inspectionId, uri, type, status, metadata) VALUES (?, ?, ?, ?, ?, ?)',
      [photo.id, photo.inspectionId, photo.uri, photo.type, photo.status, photo.metadata]
    );
  },

  async getPhotos(inspectionId: string) {
    const db = await this.getDb();
    return await db.getAllAsync<PhotoRecord>(
      'SELECT * FROM photos WHERE inspectionId = ?',
      [inspectionId]
    );
  },

  // Vehicle Methods
  async getVehicles(userId: string) {
    const db = await this.getDb();
    return await db.getAllAsync(
      'SELECT * FROM vehicles WHERE userId = ? ORDER BY createdAt DESC',
      [userId]
    );
  },

  async addVehicle(vehicle: { id: string; userId: string; make: string; model: string; year: string; plate: string }) {
    const db = await this.getDb();
    await db.runAsync(
      'INSERT INTO vehicles (id, userId, make, model, year, plate) VALUES (?, ?, ?, ?, ?, ?)',
      [vehicle.id, vehicle.userId, vehicle.make, vehicle.model, vehicle.year, vehicle.plate]
    );
  }
};
