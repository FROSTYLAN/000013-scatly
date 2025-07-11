import { Pool, PoolClient } from 'pg';

class DatabaseManager {
  private static instance: DatabaseManager;
  private pool: Pool;

  private constructor() {
    this.pool = new Pool({
      connectionString: process.env.POSTGRES_URL,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
      max: 10, // máximo 10 conexiones
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    });

    // Manejar errores de conexión
    this.pool.on('error', (err) => {
      console.error('Error inesperado en el pool de conexiones:', err);
    });
  }

  public static getInstance(): DatabaseManager {
    if (!DatabaseManager.instance) {
      DatabaseManager.instance = new DatabaseManager();
    }
    return DatabaseManager.instance;
  }

  public async query(text: string, params?: any[]) {
    try {
      const result = await this.pool.query(text, params);
      return result;
    } catch (error) {
      console.error('Error en query de base de datos:', error);
      throw error;
    }
  }

  public async getClient(): Promise<PoolClient> {
    return this.pool.connect();
  }

  public async close() {
    await this.pool.end();
  }

  public async healthCheck(): Promise<boolean> {
    try {
      await this.query('SELECT 1');
      return true;
    } catch (error) {
      console.error('Health check falló:', error);
      return false;
    }
  }
}

export const db = DatabaseManager.getInstance();
export default DatabaseManager;