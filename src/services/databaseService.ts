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

// Singleton database connection
let dbInstance: SQLite.SQLiteDatabase | null = null;

export const databaseService = {
  async getDb() {
    if (!dbInstance) {
      dbInstance = await SQLite.openDatabaseAsync(dbName);
    }
    return dbInstance;
  },

  // Inspection Methods
  async createInspection(inspection: InspectionRecord) {
    const db = await this.getDb();
    try {
      await db.runAsync(
        'INSERT INTO inspections (id, userId, vehicleName, status, data) VALUES (?, ?, ?, ?, ?)',
        [
          inspection.id || '',
          inspection.userId || '',
          inspection.vehicleName || '',
          inspection.status || 'draft',
          inspection.data || '{}'
        ]
      );
    } catch (error) {
      console.error('Database Error: Failed to create inspection', error);
      throw error;
    }
  },

  async getInspections(userId: string) {
    const db = await this.getDb();
    try {
      return await db.getAllAsync<InspectionRecord>(
        'SELECT * FROM inspections WHERE userId = ? ORDER BY createdAt DESC',
        [userId]
      );
    } catch (error) {
      console.error('Database Error: Failed to get inspections', error);
      return [];
    }
  },

  async updateInspectionStatus(id: string, status: string) {
    const db = await this.getDb();
    try {
      await db.runAsync('UPDATE inspections SET status = ? WHERE id = ?', [status, id]);
    } catch (error) {
      console.error('Database Error: Failed to update inspection status', error);
      throw error;
    }
  },

  // Photo Methods
  async addPhoto(photo: PhotoRecord) {
    const db = await this.getDb();
    try {
      await db.runAsync(
        'INSERT INTO photos (id, inspectionId, uri, type, status, metadata) VALUES (?, ?, ?, ?, ?, ?)',
        [
          photo.id || '',
          photo.inspectionId || '',
          photo.uri || '',
          photo.type || '',
          photo.status || 'pending',
          photo.metadata || '{}'
        ]
      );
    } catch (error) {
      console.error('Database Error: Failed to add photo', error);
      throw error;
    }
  },

  async getPhotos(inspectionId: string) {
    const db = await this.getDb();
    try {
      return await db.getAllAsync<PhotoRecord>(
        'SELECT * FROM photos WHERE inspectionId = ?',
        [inspectionId]
      );
    } catch (error) {
      console.error('Database Error: Failed to get photos', error);
      return [];
    }
  },

  // Vehicle Methods
  async getVehicles(userId: string) {
    const db = await this.getDb();
    try {
      return await db.getAllAsync(
        'SELECT * FROM vehicles WHERE userId = ? ORDER BY createdAt DESC',
        [userId]
      );
    } catch (error) {
      console.error('Database Error: Failed to get vehicles', error);
      return [];
    }
  },

  async addVehicle(vehicle: { id: string; userId: string; make: string; model: string; year: string; plate: string }) {
    const db = await this.getDb();
    try {
      await db.runAsync(
        'INSERT INTO vehicles (id, userId, make, model, year, plate) VALUES (?, ?, ?, ?, ?, ?)',
        [
          vehicle.id || '',
          vehicle.userId || '',
          vehicle.make || '',
          vehicle.model || '',
          vehicle.year || '',
          vehicle.plate || ''
        ]
      );
    } catch (error) {
      console.error('Database Error: Failed to add vehicle', error);
      throw error;
    }
  }
};

export const initDatabase = async () => {
  const db = await databaseService.getDb();

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
