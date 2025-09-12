// backend/src/lib/database.ts

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Pool, PoolClient } from 'pg';
import { z } from 'zod';

/**
 * Smart Tourist Safety System - Database Configuration
 * Comprehensive database client with Supabase integration, connection management,
 * query helpers, and real-time optimization
 */

// ==================== TYPES & INTERFACES ====================

export interface DatabaseConfig {
  supabaseUrl?: string;
  supabaseAnonKey?: string;
  supabaseServiceRoleKey?: string;
  databaseUrl?: string;
  host?: string;
  port?: number;
  database?: string;
  username?: string;
  password?: string;
  ssl?: boolean;
  maxConnections?: number;
  idleTimeoutMs?: number;
  connectionTimeoutMs?: number;
}

export interface QueryOptions {
  timeout?: number;
  retries?: number;
  transaction?: boolean;
  readOnly?: boolean;
  cache?: boolean;
  cacheTTL?: number;
}

export interface PaginationOptions {
  page?: number;
  limit?: number;
  offset?: number;
}

export interface SortOptions {
  column: string;
  direction?: 'asc' | 'desc';
}

export interface FilterOptions {
  [key: string]: any;
}

export interface QueryResult<T = any> {
  data: T[];
  count?: number;
  error?: string;
  executionTime?: number;
}

export interface TransactionContext {
  client: PoolClient;
  committed: boolean;
  rolledBack: boolean;
}

// Validation schemas for database operations
const paginationSchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(1000).default(50),
  offset: z.number().min(0).optional(),
});

const sortSchema = z.object({
  column: z.string().min(1),
  direction: z.enum(['asc', 'desc']).default('asc'),
});

// ==================== DATABASE CLIENT CLASS ====================

export class DatabaseClient {
  private supabaseClient: SupabaseClient | null = null;
  private pgPool: Pool | null = null;
  private config: DatabaseConfig;
  private isConnected: boolean = false;
  private connectionAttempts: number = 0;
  private maxRetries: number = 3;
  private queryCache: Map<string, { data: any; timestamp: number; ttl: number }> = new Map();

  constructor(config: DatabaseConfig) {
    this.config = {
      maxConnections: 20,
      idleTimeoutMs: 30000,
      connectionTimeoutMs: 10000,
      ssl: process.env.NODE_ENV === 'production',
      ...config,
    };
  }

  // ==================== CONNECTION MANAGEMENT ====================

  /**
   * Initialize database connections (both Supabase and PostgreSQL)
   */
  async connect(): Promise<void> {
    try {
      this.connectionAttempts++;
      
      // Initialize Supabase client for real-time features
      if (this.config.supabaseUrl && this.config.supabaseAnonKey) {
        this.supabaseClient = createClient(
          this.config.supabaseUrl,
          this.config.supabaseServiceRoleKey || this.config.supabaseAnonKey,
          {
            auth: {
              autoRefreshToken: true,
              persistSession: false,
            },
            realtime: {
              params: {
                eventsPerSecond: 10,
              },
            },
          }
        );
        
        console.log('✅ Supabase client initialized');
      }

      // Initialize PostgreSQL connection pool
      await this.initializePostgreSQL();
      
      // Test connections
      await this.testConnections();
      
      this.isConnected = true;
      this.connectionAttempts = 0;
      
      console.log('✅ Database connections established successfully');
      
    } catch (error) {
      console.error(`❌ Database connection failed (attempt ${this.connectionAttempts}):`, error);
      
      if (this.connectionAttempts < this.maxRetries) {
        console.log(`🔄 Retrying connection in 5 seconds...`);
        await this.delay(5000);
        return this.connect();
      } else {
        throw new Error(`Failed to connect to database after ${this.maxRetries} attempts: ${error}`);
      }
    }
  }

  /**
   * Initialize PostgreSQL connection pool
   */
  private async initializePostgreSQL(): Promise<void> {
    const poolConfig = {
      connectionString: this.config.databaseUrl,
      host: this.config.host,
      port: this.config.port,
      database: this.config.database,
      user: this.config.username,
      password: this.config.password,
      max: this.config.maxConnections,
      idleTimeoutMillis: this.config.idleTimeoutMs,
      connectionTimeoutMillis: this.config.connectionTimeoutMs,
      ssl: this.config.ssl ? { rejectUnauthorized: false } : false,
      // Connection pool optimization
      keepAlive: true,
      keepAliveInitialDelayMillis: 10000,
      // Error handling
      allowExitOnIdle: false,
    };

    // Remove undefined values
    Object.keys(poolConfig).forEach(key => {
      if (poolConfig[key as keyof typeof poolConfig] === undefined) {
        delete poolConfig[key as keyof typeof poolConfig];
      }
    });

    this.pgPool = new Pool(poolConfig);

    // Handle pool errors
    this.pgPool.on('error', (err: Error) => {
      console.error('❌ PostgreSQL pool error:', err);
    });

    this.pgPool.on('connect', () => {
      console.log('🔗 New PostgreSQL client connected');
    });

    this.pgPool.on('remove', () => {
      console.log('➖ PostgreSQL client removed from pool');
    });
  }

  /**
   * Test database connections
   */
  private async testConnections(): Promise<void> {
    // Test PostgreSQL connection
    if (this.pgPool) {
      const client = await this.pgPool.connect();
      try {
        const result = await client.query('SELECT NOW() as current_time, version() as version');
        console.log('✅ PostgreSQL connection test passed:', result.rows[0]);
      } finally {
        client.release();
      }
    }

    // Test Supabase connection
    if (this.supabaseClient) {
      const { data, error } = await this.supabaseClient
        .from('users')
        .select('count', { count: 'exact', head: true });
      
      if (error && error.code !== 'PGRST116') { // PGRST116 is table not found, which is fine for testing
        throw new Error(`Supabase connection test failed: ${error.message}`);
      }
      
      console.log('✅ Supabase connection test passed');
    }
  }

  /**
   * Disconnect from databases
   */
  async disconnect(): Promise<void> {
    try {
      if (this.pgPool) {
        await this.pgPool.end();
        console.log('✅ PostgreSQL pool closed');
      }

      if (this.supabaseClient) {
        // Supabase client doesn't have explicit close method
        console.log('✅ Supabase client disconnected');
      }

      this.isConnected = false;
      this.clearCache();
      
    } catch (error) {
      console.error('❌ Error during disconnect:', error);
      throw error;
    }
  }

  /**
   * Check if database is connected
   */
  isDbConnected(): boolean {
    return this.isConnected && this.pgPool !== null;
  }

  // ==================== QUERY EXECUTION ====================

  /**
   * Execute raw SQL query with PostgreSQL
   */
  async query<T = any>(
    sql: string, 
    params: any[] = [], 
    options: QueryOptions = {}
  ): Promise<QueryResult<T>> {
    const startTime = Date.now();
    const { timeout = 30000, retries = 1, readOnly = false } = options;
    
    if (!this.pgPool) {
      throw new Error('PostgreSQL pool not initialized');
    }

    // Check cache for read-only queries
    if (readOnly && options.cache) {
      const cacheKey = this.generateCacheKey(sql, params);
      const cached = this.getFromCache(cacheKey);
      if (cached) {
        return {
          data: cached,
          executionTime: Date.now() - startTime,
        };
      }
    }

    let attempt = 0;
    while (attempt < retries) {
      const client = await this.pgPool.connect();
      
      try {
        // Set query timeout
        if (timeout) {
          await client.query(`SET statement_timeout = ${timeout}`);
        }

        // Set read-only mode if specified
        if (readOnly) {
          await client.query('SET transaction_read_only = true');
        }

        const result = await client.query(sql, params);
        const executionTime = Date.now() - startTime;

        // Cache result if specified
        if (readOnly && options.cache && options.cacheTTL) {
          const cacheKey = this.generateCacheKey(sql, params);
          this.setCache(cacheKey, result.rows, options.cacheTTL);
        }

        return {
          data: result.rows,
          count: result.rowCount || undefined,
          executionTime,
        };

      } catch (error) {
        attempt++;
        console.error(`❌ Query execution failed (attempt ${attempt}):`, error);
        
        if (attempt >= retries) {
          return {
            data: [],
            error: error instanceof Error ? error.message : 'Unknown error',
            executionTime: Date.now() - startTime,
          };
        }
        
        // Wait before retry
        await this.delay(1000 * attempt);
        
      } finally {
        client.release();
      }
    }

    return {
      data: [],
      error: 'Max retries exceeded',
      executionTime: Date.now() - startTime,
    };
  }

  /**
   * Execute query with Supabase client
   */
  async supabaseQuery<T = any>(
    table: string,
    options: {
      select?: string;
      filter?: FilterOptions;
      sort?: SortOptions[];
      pagination?: PaginationOptions;
      single?: boolean;
    } = {}
  ): Promise<QueryResult<T>> {
    const startTime = Date.now();
    
    if (!this.supabaseClient) {
      throw new Error('Supabase client not initialized');
    }

    try {
      let query = this.supabaseClient.from(table);

      // Apply select
      if (options.select) {
        query = query.select(options.select);
      } else {
        query = query.select('*');
      }

      // Apply filters
      if (options.filter) {
        Object.entries(options.filter).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            query = query.eq(key, value);
          }
        });
      }

      // Apply sorting
      if (options.sort && options.sort.length > 0) {
        options.sort.forEach(sort => {
          query = query.order(sort.column, { ascending: sort.direction === 'asc' });
        });
      }

      // Apply pagination
      if (options.pagination) {
        const { page = 1, limit = 50 } = options.pagination;
        const offset = (page - 1) * limit;
        query = query.range(offset, offset + limit - 1);
      }

      // Execute query
      const { data, error, count } = options.single 
        ? await query.single()
        : await query;

      if (error) {
        throw error;
      }

      return {
        data: options.single ? [data] : (data || []),
        count,
        executionTime: Date.now() - startTime,
      };

    } catch (error) {
      return {
        data: [],
        error: error instanceof Error ? error.message : 'Unknown error',
        executionTime: Date.now() - startTime,
      };
    }
  }

  // ==================== TRANSACTION MANAGEMENT ====================

  /**
   * Start a database transaction
   */
  async beginTransaction(): Promise<TransactionContext> {
    if (!this.pgPool) {
      throw new Error('PostgreSQL pool not initialized');
    }

    const client = await this.pgPool.connect();
    await client.query('BEGIN');
    
    return {
      client,
      committed: false,
      rolledBack: false,
    };
  }

  /**
   * Commit a transaction
   */
  async commitTransaction(context: TransactionContext): Promise<void> {
    if (context.committed || context.rolledBack) {
      throw new Error('Transaction already completed');
    }

    try {
      await context.client.query('COMMIT');
      context.committed = true;
    } finally {
      context.client.release();
    }
  }

  /**
   * Rollback a transaction
   */
  async rollbackTransaction(context: TransactionContext): Promise<void> {
    if (context.committed || context.rolledBack) {
      return; // Already completed
    }

    try {
      await context.client.query('ROLLBACK');
      context.rolledBack = true;
    } finally {
      context.client.release();
    }
  }

  /**
   * Execute multiple queries in a transaction
   */
  async executeTransaction<T>(
    queries: Array<{ sql: string; params?: any[] }>,
    options: QueryOptions = {}
  ): Promise<QueryResult<T>[]> {
    const transaction = await this.beginTransaction();
    const results: QueryResult<T>[] = [];

    try {
      for (const { sql, params = [] } of queries) {
        const result = await transaction.client.query(sql, params);
        results.push({
          data: result.rows,
          count: result.rowCount || undefined,
        });
      }

      await this.commitTransaction(transaction);
      return results;

    } catch (error) {
      await this.rollbackTransaction(transaction);
      throw error;
    }
  }

  // ==================== CRUD HELPERS ====================

  /**
   * Insert record into table
   */
  async insert<T = any>(
    table: string,
    data: Record<string, any>,
    options: { returning?: string; onConflict?: string } = {}
  ): Promise<QueryResult<T>> {
    const columns = Object.keys(data).join(', ');
    const placeholders = Object.keys(data).map((_, index) => `$${index + 1}`).join(', ');
    const values = Object.values(data);

    let sql = `INSERT INTO ${table} (${columns}) VALUES (${placeholders})`;
    
    if (options.onConflict) {
      sql += ` ${options.onConflict}`;
    }
    
    if (options.returning) {
      sql += ` RETURNING ${options.returning}`;
    }

    return this.query<T>(sql, values);
  }

  /**
   * Update records in table
   */
  async update<T = any>(
    table: string,
    data: Record<string, any>,
    where: Record<string, any>,
    options: { returning?: string } = {}
  ): Promise<QueryResult<T>> {
    const setClause = Object.keys(data).map((key, index) => `${key} = $${index + 1}`).join(', ');
    const whereClause = Object.keys(where).map((key, index) => `${key} = $${Object.keys(data).length + index + 1}`).join(' AND ');
    
    const values = [...Object.values(data), ...Object.values(where)];
    
    let sql = `UPDATE ${table} SET ${setClause}, updated_at = CURRENT_TIMESTAMP WHERE ${whereClause}`;
    
    if (options.returning) {
      sql += ` RETURNING ${options.returning}`;
    }

    return this.query<T>(sql, values);
  }

  /**
   * Delete records from table
   */
  async delete<T = any>(
    table: string,
    where: Record<string, any>,
    options: { returning?: string; soft?: boolean } = {}
  ): Promise<QueryResult<T>> {
    const whereClause = Object.keys(where).map((key, index) => `${key} = $${index + 1}`).join(' AND ');
    const values = Object.values(where);

    let sql: string;
    
    if (options.soft) {
      sql = `UPDATE ${table} SET deleted_at = CURRENT_TIMESTAMP WHERE ${whereClause}`;
    } else {
      sql = `DELETE FROM ${table} WHERE ${whereClause}`;
    }
    
    if (options.returning) {
      sql += ` RETURNING ${options.returning}`;
    }

    return this.query<T>(sql, values);
  }

  /**
   * Select records from table with advanced filtering
   */
  async select<T = any>(
    table: string,
    options: {
      columns?: string[];
      where?: Record<string, any>;
      sort?: SortOptions[];
      pagination?: PaginationOptions;
      joins?: string[];
      groupBy?: string[];
      having?: Record<string, any>;
    } = {}
  ): Promise<QueryResult<T>> {
    const {
      columns = ['*'],
      where = {},
      sort = [],
      pagination,
      joins = [],
      groupBy = [],
      having = {},
    } = options;

    // Build SELECT clause
    let sql = `SELECT ${columns.join(', ')} FROM ${table}`;

    // Add JOINs
    if (joins.length > 0) {
      sql += ` ${joins.join(' ')}`;
    }

    // Build WHERE clause
    const whereConditions = Object.keys(where);
    if (whereConditions.length > 0) {
      const whereClause = whereConditions.map((key, index) => `${key} = $${index + 1}`).join(' AND ');
      sql += ` WHERE ${whereClause}`;
    }

    // Add GROUP BY
    if (groupBy.length > 0) {
      sql += ` GROUP BY ${groupBy.join(', ')}`;
    }

    // Add HAVING
    const havingConditions = Object.keys(having);
    if (havingConditions.length > 0) {
      const havingClause = havingConditions.map((key, index) => `${key} = $${whereConditions.length + index + 1}`).join(' AND ');
      sql += ` HAVING ${havingClause}`;
    }

    // Add ORDER BY
    if (sort.length > 0) {
      const orderClause = sort.map(s => `${s.column} ${s.direction}`).join(', ');
      sql += ` ORDER BY ${orderClause}`;
    }

    // Add PAGINATION
    if (pagination) {
      const { page = 1, limit = 50 } = pagination;
      const offset = (page - 1) * limit;
      sql += ` LIMIT ${limit} OFFSET ${offset}`;
    }

    const values = [...Object.values(where), ...Object.values(having)];
    return this.query<T>(sql, values);
  }

  // ==================== SPECIALIZED QUERIES ====================

  /**
   * Get tourists with location data
   */
  async getTouristsWithLocation(
    filters: {
      status?: string;
      assignedOfficer?: string;
      bounds?: { north: number; south: number; east: number; west: number };
      safetyScoreMin?: number;
      safetyScoreMax?: number;
    } = {},
    pagination: PaginationOptions = {}
  ): Promise<QueryResult> {
    const { page = 1, limit = 50 } = paginationSchema.parse(pagination);
    const offset = (page - 1) * limit;

    let whereConditions: string[] = ['t.current_location IS NOT NULL'];
    let values: any[] = [];
    let paramIndex = 1;

    // Add filters
    if (filters.status) {
      whereConditions.push(`t.status = $${paramIndex++}`);
      values.push(filters.status);
    }

    if (filters.assignedOfficer) {
      whereConditions.push(`t.assigned_officer_id = $${paramIndex++}`);
      values.push(filters.assignedOfficer);
    }

    if (filters.bounds) {
      whereConditions.push(`
        ST_Y(t.current_location) BETWEEN $${paramIndex++} AND $${paramIndex++} AND
        ST_X(t.current_location) BETWEEN $${paramIndex++} AND $${paramIndex++}
      `);
      values.push(filters.bounds.south, filters.bounds.north, filters.bounds.west, filters.bounds.east);
    }

    if (filters.safetyScoreMin !== undefined) {
      whereConditions.push(`t.safety_score >= $${paramIndex++}`);
      values.push(filters.safetyScoreMin);
    }

    if (filters.safetyScoreMax !== undefined) {
      whereConditions.push(`t.safety_score <= $${paramIndex++}`);
      values.push(filters.safetyScoreMax);
    }

    const sql = `
      SELECT 
        t.id,
        t.first_name,
        t.last_name,
        t.email,
        t.phone,
        t.status,
        t.safety_score,
        t.risk_level,
        ST_Y(t.current_location) as latitude,
        ST_X(t.current_location) as longitude,
        t.last_location_update,
        u.first_name as officer_first_name,
        u.last_name as officer_last_name,
        COUNT(*) OVER() as total_count
      FROM tourists t
      LEFT JOIN users u ON t.assigned_officer_id = u.id
      WHERE ${whereConditions.join(' AND ')}
      ORDER BY t.last_location_update DESC
      LIMIT $${paramIndex++} OFFSET $${paramIndex++}
    `;

    values.push(limit, offset);
    return this.query(sql, values);
  }

  /**
   * Get alerts with location and tourist data
   */
  async getAlertsWithDetails(
    filters: {
      type?: string;
      priority?: string;
      status?: string;
      assignedTo?: string;
      dateFrom?: string;
      dateTo?: string;
    } = {},
    pagination: PaginationOptions = {},
    sort: SortOptions[] = []
  ): Promise<QueryResult> {
    const { page = 1, limit = 50 } = paginationSchema.parse(pagination);
    const offset = (page - 1) * limit;

    let whereConditions: string[] = ['1=1'];
    let values: any[] = [];
    let paramIndex = 1;

    // Add filters
    if (filters.type) {
      whereConditions.push(`a.type = $${paramIndex++}`);
      values.push(filters.type);
    }

    if (filters.priority) {
      whereConditions.push(`a.priority = $${paramIndex++}`);
      values.push(filters.priority);
    }

    if (filters.status) {
      whereConditions.push(`a.status = $${paramIndex++}`);
      values.push(filters.status);
    }

    if (filters.assignedTo) {
      whereConditions.push(`a.assigned_to = $${paramIndex++}`);
      values.push(filters.assignedTo);
    }

    if (filters.dateFrom) {
      whereConditions.push(`a.reported_at >= $${paramIndex++}`);
      values.push(filters.dateFrom);
    }

    if (filters.dateTo) {
      whereConditions.push(`a.reported_at <= $${paramIndex++}`);
      values.push(filters.dateTo);
    }

    // Build ORDER BY clause
    let orderClause = 'a.reported_at DESC';
    if (sort.length > 0) {
      const validatedSort = sort.filter(s => 
        ['reported_at', 'priority', 'status', 'type', 'severity'].includes(s.column)
      );
      if (validatedSort.length > 0) {
        orderClause = validatedSort.map(s => `a.${s.column} ${s.direction}`).join(', ');
      }
    }

    const sql = `
      SELECT 
        a.*,
        t.first_name as tourist_first_name,
        t.last_name as tourist_last_name,
        t.phone as tourist_phone,
        u.first_name as assigned_officer_first_name,
        u.last_name as assigned_officer_last_name,
        r.first_name as reporter_first_name,
        r.last_name as reporter_last_name,
        z.name as zone_name,
        z.type as zone_type,
        ST_Y(a.location) as latitude,
        ST_X(a.location) as longitude,
        COUNT(*) OVER() as total_count
      FROM alerts a
      LEFT JOIN tourists t ON a.tourist_id = t.id
      LEFT JOIN users u ON a.assigned_to = u.id
      LEFT JOIN users r ON a.reported_by = r.id
      LEFT JOIN zones z ON a.zone_id = z.id
      WHERE ${whereConditions.join(' AND ')}
      ORDER BY ${orderClause}
      LIMIT $${paramIndex++} OFFSET $${paramIndex++}
    `;

    values.push(limit, offset);
    return this.query(sql, values);
  }

  /**
   * Get zones with current occupancy
   */
  async getZonesWithOccupancy(): Promise<QueryResult> {
    const sql = `
      SELECT 
        z.*,
        ST_AsGeoJSON(z.geometry) as geometry_geojson,
        ST_Y(z.center_point) as center_latitude,
        ST_X(z.center_point) as center_longitude,
        COUNT(t.id) as current_tourists,
        COALESCE(z.capacity_limit, 0) as capacity_limit,
        CASE 
          WHEN z.capacity_limit > 0 
          THEN (COUNT(t.id)::float / z.capacity_limit * 100)::integer
          ELSE 0
        END as occupancy_percentage
      FROM zones z
      LEFT JOIN tourists t ON 
        t.status = 'active' AND 
        t.current_location IS NOT NULL AND
        ST_Contains(z.geometry, t.current_location)
      WHERE z.is_active = true
      GROUP BY z.id, z.capacity_limit
      ORDER BY z.name
    `;

    return this.query(sql);
  }

  // ==================== REAL-TIME SUBSCRIPTIONS ====================

  /**
   * Subscribe to real-time updates for a table
   */
  subscribeToTable(
    table: string,
    callback: (payload: any) => void,
    filter?: string
  ) {
    if (!this.supabaseClient) {
      throw new Error('Supabase client not initialized');
    }

    const channel = this.supabaseClient
      .channel(`${table}_changes`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: table,
          filter: filter,
        },
        callback
      )
      .subscribe();

    return channel;
  }

  /**
   * Subscribe to location updates
   */
  subscribeToLocationUpdates(callback: (payload: any) => void) {
    return this.subscribeToTable('location_history', callback);
  }

  /**
   * Subscribe to alert updates
   */
  subscribeToAlertUpdates(callback: (payload: any) => void) {
    return this.subscribeToTable('alerts', callback);
  }

  // ==================== CACHING ====================

  private generateCacheKey(sql: string, params: any[]): string {
    return `${sql}_${JSON.stringify(params)}`;
  }

  private getFromCache(key: string): any | null {
    const cached = this.queryCache.get(key);
    if (cached && Date.now() - cached.timestamp < cached.ttl) {
      return cached.data;
    }
    this.queryCache.delete(key);
    return null;
  }

  private setCache(key: string, data: any, ttl: number): void {
    this.queryCache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    });
  }

  private clearCache(): void {
    this.queryCache.clear();
  }

  // ==================== UTILITIES ====================

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Get database statistics and health
   */
  async getHealthStats(): Promise<any> {
    if (!this.pgPool) {
      return { status: 'disconnected' };
    }

    try {
      const stats = await this.query(`
        SELECT 
          (SELECT count(*) FROM tourists WHERE status = 'active') as active_tourists,
          (SELECT count(*) FROM alerts WHERE status = 'active') as active_alerts,
          (SELECT count(*) FROM zones WHERE is_active = true) as active_zones,
          (SELECT count(*) FROM users WHERE is_active = true) as active_users,
          (SELECT pg_database_size(current_database())) as database_size,
          (SELECT version()) as postgres_version,
          NOW() as current_time
      `);

      return {
        status: 'connected',
        pool: {
          total: this.pgPool.totalCount,
          idle: this.pgPool.idleCount,
          waiting: this.pgPool.waitingCount,
        },
        cache: {
          size: this.queryCache.size,
        },
        ...stats.data[0],
      };
    } catch (error) {
      return {
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
}

// ==================== SINGLETON INSTANCE ====================

let databaseInstance: DatabaseClient | null = null;

/**
 * Get database client instance (singleton)
 */
export function getDatabase(): DatabaseClient {
  if (!databaseInstance) {
    const config: DatabaseConfig = {
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseAnonKey: process.env.SUPABASE_ANON_KEY,
      supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
      databaseUrl: process.env.DATABASE_URL,
      host: process.env.DATABASE_HOST,
      port: parseInt(process.env.DATABASE_PORT || '5432'),
      database: process.env.DATABASE_NAME,
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      maxConnections: parseInt(process.env.DB_MAX_CONNECTIONS || '20'),
      idleTimeoutMs: parseInt(process.env.DB_IDLE_TIMEOUT_MS || '30000'),
      connectionTimeoutMs: parseInt(process.env.DB_CONNECTION_TIMEOUT_MS || '10000'),
    };

    databaseInstance = new DatabaseClient(config);
  }

  return databaseInstance;
}

/**
 * Initialize database connection
 */
export async function initializeDatabase(): Promise<DatabaseClient> {
  const db = getDatabase();
  await db.connect();
  return db;
}

/**
 * Close database connection
 */
export async function closeDatabase(): Promise<void> {
  if (databaseInstance) {
    await databaseInstance.disconnect();
    databaseInstance = null;
  }
}

// ==================== QUERY BUILDERS ====================

/**
 * Build WHERE clause from filters
 */
export function buildWhereClause(
  filters: Record<string, any>,
  startIndex: number = 1
): { clause: string; values: any[]; nextIndex: number } {
  const conditions: string[] = [];
  const values: any[] = [];
  let paramIndex = startIndex;

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (Array.isArray(value)) {
        conditions.push(`${key} = ANY($${paramIndex++})`);
        values.push(value);
      } else if (typeof value === 'string' && value.includes('%')) {
        conditions.push(`${key} ILIKE $${paramIndex++}`);
        values.push(value);
      } else {
        conditions.push(`${key} = $${paramIndex++}`);
        values.push(value);
      }
    }
  });

  return {
    clause: conditions.length > 0 ? conditions.join(' AND ') : '1=1',
    values,
    nextIndex: paramIndex,
  };
}

/**
 * Build pagination clause
 */
export function buildPaginationClause(pagination: PaginationOptions): {
  clause: string;
  values: number[];
} {
  const { page = 1, limit = 50 } = paginationSchema.parse(pagination);
  const offset = (page - 1) * limit;
  
  return {
    clause: `LIMIT $? OFFSET $?`,
    values: [limit, offset],
  };
}

// ==================== EXPORTS ====================

export default DatabaseClient;

// For backward compatibility
export const db = getDatabase();
