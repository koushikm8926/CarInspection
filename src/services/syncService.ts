import { databaseService } from './databaseService';

export const syncService = {
  async addToQueue(action: string, payload: any) {
    const db = await databaseService.getDb();
    await db.runAsync(
      'INSERT INTO sync_queue (action, payload) VALUES (?, ?)',
      [action, JSON.stringify(payload)]
    );
  },

  async processQueue() {
    const db = await databaseService.getDb();
    const queue = await db.getAllAsync<{ id: number, action: string, payload: string }>(
      'SELECT * FROM sync_queue ORDER BY id ASC'
    );

    for (const item of queue) {
      try {
        console.log(`Processing sync item ${item.id}: ${item.action}`);
        
        // HERE: Call actual API based on action (e.g., uploadInspection)
        // For now, we mock success
        await new Promise(resolve => setTimeout(resolve, 500));

        // On success, remove from queue
        await db.runAsync('DELETE FROM sync_queue WHERE id = ?', [item.id]);
        
        // Update inspection status if applicable
        const payload = JSON.parse(item.payload);
        if (payload.inspectionId) {
          await databaseService.updateInspectionStatus(payload.inspectionId, 'uploaded');
        }
      } catch (error) {
        console.error(`Failed to process sync item ${item.id}`, error);
        await db.runAsync(
          'UPDATE sync_queue SET attempts = attempts + 1, lastAttempt = CURRENT_TIMESTAMP WHERE id = ?',
          [item.id]
        );
      }
    }
  }
};
