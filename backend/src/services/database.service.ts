import { Pool, PoolClient, QueryResult } from 'pg';
import { Logger } from '../utils/logger';

export class DatabaseService {
  private pool: Pool;
  private logger = Logger.getInstance();

  constructor(connectionString: string) {
    this.pool = new Pool({
      connectionString,
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    });

    this.pool.on('connect', () => {
      this.logger.info('New database client connected');
    });

    this.pool.on('error', (error) => {
      this.logger.error('Database pool error:', error);
    });
  }

  /**
   * Execute a query with parameters
   */
  async query<T = any>(text: string, params?: any[]): Promise<QueryResult<T>> {
    const start = Date.now();
    
    try {
      const result = await this.pool.query<T>(text, params);
      const duration = Date.now() - start;
      
      this.logger.debug('Executed query', {
        text,
        duration,
        rows: result.rowCount,
      });
      
      return result;
    } catch (error) {
      this.logger.error('Database query error:', {
        text,
        params,
        error: error instanceof Error ? error.message : error,
      });
      throw error;
    }
  }

  /**
   * Get a client from the pool for transactions
   */
  async getClient(): Promise<PoolClient> {
    try {
      return await this.pool.connect();
    } catch (error) {
      this.logger.error('Failed to get database client:', error);
      throw error;
    }
  }

  /**
   * Execute multiple queries in a transaction
   */
  async transaction<T>(
    callback: (client: PoolClient) => Promise<T>
  ): Promise<T> {
    const client = await this.getClient();
    
    try {
      await client.query('BEGIN');
      const result = await callback(client);
      await client.query('COMMIT');
      return result;
    } catch (error) {
      await client.query('ROLLBACK');
      this.logger.error('Transaction rolled back:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Check database health
   */
  async healthCheck(): Promise<boolean> {
    try {
      const result = await this.query('SELECT 1 as health');
      return result.rows[0]?.health === 1;
    } catch (error) {
      this.logger.error('Database health check failed:', error);
      return false;
    }
  }

  /**
   * Get database statistics
   */
  async getStats(): Promise<{
    totalConnections: number;
    activeConnections: number;
    idleConnections: number;
    waitingConnections: number;
  }> {
    return {
      totalConnections: this.pool.totalCount,
      activeConnections: this.pool.totalCount - this.pool.idleCount,
      idleConnections: this.pool.idleCount,
      waitingConnections: this.pool.waitingCount,
    };
  }

  /**
   * Close all connections
   */
  async close(): Promise<void> {
    try {
      await this.pool.end();
      this.logger.info('Database pool closed');
    } catch (error) {
      this.logger.error('Failed to close database pool:', error);
    }
  }

  /**
   * Insert with returning
   */
  async insert<T = any>(
    table: string,
    data: Record<string, any>,
    returning: string = '*'
  ): Promise<T> {
    const keys = Object.keys(data);
    const values = Object.values(data);
    const placeholders = keys.map((_, index) => `$${index + 1}`).join(', ');
    const columns = keys.join(', ');

    const query = `
      INSERT INTO ${table} (${columns})
      VALUES (${placeholders})
      RETURNING ${returning}
    `;

    const result = await this.query<T>(query, values);
    return result.rows[0];
  }

  /**
   * Update with returning
   */
  async update<T = any>(
    table: string,
    data: Record<string, any>,
    where: Record<string, any>,
    returning: string = '*'
  ): Promise<T[]> {
    const setKeys = Object.keys(data);
    const setValues = Object.values(data);
    const whereKeys = Object.keys(where);
    const whereValues = Object.values(where);

    const setClause = setKeys
      .map((key, index) => `${key} = $${index + 1}`)
      .join(', ');

    const whereClause = whereKeys
      .map((key, index) => `${key} = $${setKeys.length + index + 1}`)
      .join(' AND ');

    const query = `
      UPDATE ${table}
      SET ${setClause}
      WHERE ${whereClause}
      RETURNING ${returning}
    `;

    const result = await this.query<T>(query, [...setValues, ...whereValues]);
    return result.rows;
  }

  /**
   * Upsert (insert or update on conflict)
   */
  async upsert<T = any>(
    table: string,
    data: Record<string, any>,
    conflictColumns: string[],
    updateColumns?: string[],
    returning: string = '*'
  ): Promise<T> {
    const keys = Object.keys(data);
    const values = Object.values(data);
    const placeholders = keys.map((_, index) => `$${index + 1}`).join(', ');
    const columns = keys.join(', ');

    const conflictClause = conflictColumns.join(', ');
    const updateClause = updateColumns
      ? updateColumns.map(col => `${col} = EXCLUDED.${col}`).join(', ')
      : keys.filter(key => !conflictColumns.includes(key))
          .map(col => `${col} = EXCLUDED.${col}`).join(', ');

    const query = `
      INSERT INTO ${table} (${columns})
      VALUES (${placeholders})
      ON CONFLICT (${conflictClause})
      DO UPDATE SET ${updateClause}
      RETURNING ${returning}
    `;

    const result = await this.query<T>(query, values);
    return result.rows[0];
  }

  /**
   * Find with pagination
   */
  async findWithPagination<T = any>(
    table: string,
    options: {
      where?: Record<string, any>;
      orderBy?: string;
      limit?: number;
      offset?: number;
      select?: string;
    } = {}
  ): Promise<{ rows: T[]; totalCount: number }> {
    const {
      where = {},
      orderBy = 'created_at DESC',
      limit = 20,
      offset = 0,
      select = '*'
    } = options;

    const whereKeys = Object.keys(where);
    const whereValues = Object.values(where);
    const whereClause = whereKeys.length > 0
      ? 'WHERE ' + whereKeys.map((key, index) => `${key} = $${index + 1}`).join(' AND ')
      : '';

    // Get total count
    const countQuery = `SELECT COUNT(*) as total FROM ${table} ${whereClause}`;
    const countResult = await this.query(countQuery, whereValues);
    const totalCount = parseInt(countResult.rows[0].total);

    // Get paginated results
    const dataQuery = `
      SELECT ${select}
      FROM ${table}
      ${whereClause}
      ORDER BY ${orderBy}
      LIMIT $${whereValues.length + 1}
      OFFSET $${whereValues.length + 2}
    `;

    const dataResult = await this.query<T>(dataQuery, [...whereValues, limit, offset]);

    return {
      rows: dataResult.rows,
      totalCount
    };
  }
}