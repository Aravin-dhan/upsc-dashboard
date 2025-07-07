import { promises as fs } from 'fs';
import path from 'path';
import { User, UserWithPassword, RegisterData, Tenant, generateId, generateTenantId, hashPassword, createDefaultTenant } from './auth';

// Database file paths - handle Vercel serverless environment
const isVercel = process.env.VERCEL === '1';
const DATA_DIR = isVercel ? '/tmp/data' : path.join(process.cwd(), 'data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const TENANTS_FILE = path.join(DATA_DIR, 'tenants.json');
const SESSIONS_FILE = path.join(DATA_DIR, 'sessions.json');
const USER_DATA_DIR = path.join(DATA_DIR, 'user-data'); // Tenant-scoped user data

// Source data directory for initial data in Vercel
const SOURCE_DATA_DIR = path.join(process.cwd(), 'data');

// Ensure data directory exists
async function ensureDataDir(): Promise<void> {
  try {
    await fs.access(DATA_DIR);
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
  }

  try {
    await fs.access(USER_DATA_DIR);
  } catch {
    await fs.mkdir(USER_DATA_DIR, { recursive: true });
  }
}

// Copy file from source to destination if it doesn't exist
async function copyFileIfNotExists(sourcePath: string, destPath: string): Promise<void> {
  try {
    await fs.access(destPath);
  } catch {
    try {
      const data = await fs.readFile(sourcePath, 'utf-8');
      await fs.writeFile(destPath, data);
    } catch (sourceError) {
      // If source doesn't exist, create default content
      throw sourceError;
    }
  }
}

// Initialize database files if they don't exist
async function initializeDatabase(): Promise<void> {
  await ensureDataDir();

  // In Vercel, copy existing data files from source directory
  if (isVercel) {
    try {
      await copyFileIfNotExists(path.join(SOURCE_DATA_DIR, 'tenants.json'), TENANTS_FILE);
    } catch {
      // Create default tenant if source doesn't exist
      const defaultTenant = createDefaultTenant('system', 'Default Organization', 'individual');
      defaultTenant.id = 'default';
      await fs.writeFile(TENANTS_FILE, JSON.stringify([defaultTenant], null, 2));
    }

    try {
      await copyFileIfNotExists(path.join(SOURCE_DATA_DIR, 'users.json'), USERS_FILE);
    } catch {
      // Create default admin if source doesn't exist
      const { hash, salt } = hashPassword('admin123');
      const defaultAdmin: UserWithPassword = {
        id: generateId(),
        email: 'admin@upsc.local',
        name: 'System Administrator',
        role: 'admin',
        tenantId: 'default',
        tenantRole: 'owner',
        tenants: ['default'],
        createdAt: new Date().toISOString(),
        isActive: true,
        passwordHash: hash,
        salt: salt,
        preferences: {
          defaultTenant: 'default',
          theme: 'light',
          language: 'en'
        }
      };
      await fs.writeFile(USERS_FILE, JSON.stringify([defaultAdmin], null, 2));
    }

    try {
      await copyFileIfNotExists(path.join(SOURCE_DATA_DIR, 'sessions.json'), SESSIONS_FILE);
    } catch {
      await fs.writeFile(SESSIONS_FILE, JSON.stringify([], null, 2));
    }
  } else {
    // Local development - create files if they don't exist
    try {
      await fs.access(TENANTS_FILE);
    } catch {
      const defaultTenant = createDefaultTenant('system', 'Default Organization', 'individual');
      defaultTenant.id = 'default';
      await fs.writeFile(TENANTS_FILE, JSON.stringify([defaultTenant], null, 2));
    }

    try {
      await fs.access(USERS_FILE);
    } catch {
      const { hash, salt } = hashPassword('admin123');
      const defaultAdmin: UserWithPassword = {
        id: generateId(),
        email: 'admin@upsc.local',
        name: 'System Administrator',
        role: 'admin',
        tenantId: 'default',
        tenantRole: 'owner',
        tenants: ['default'],
        createdAt: new Date().toISOString(),
        isActive: true,
        passwordHash: hash,
        salt: salt,
        preferences: {
          defaultTenant: 'default',
          theme: 'light',
          language: 'en'
        }
      };
      await fs.writeFile(USERS_FILE, JSON.stringify([defaultAdmin], null, 2));
    }

    try {
      await fs.access(SESSIONS_FILE);
    } catch {
      await fs.writeFile(SESSIONS_FILE, JSON.stringify([], null, 2));
    }
  }
}

// User database operations
export class UserDatabase {
  private static async readUsers(): Promise<UserWithPassword[]> {
    await initializeDatabase();
    try {
      const data = await fs.readFile(USERS_FILE, 'utf-8');
      return JSON.parse(data);
    } catch {
      return [];
    }
  }
  
  private static async writeUsers(users: UserWithPassword[]): Promise<void> {
    await ensureDataDir();
    await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2));
  }
  
  static async findByEmail(email: string): Promise<UserWithPassword | null> {
    const users = await this.readUsers();
    return users.find(user => user.email.toLowerCase() === email.toLowerCase()) || null;
  }
  
  static async findById(id: string): Promise<User | null> {
    const users = await this.readUsers();
    const user = users.find(user => user.id === id);
    if (!user) return null;
    
    // Remove password fields from returned user
    const { passwordHash, salt, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
  
  static async findByTenant(tenantId: string): Promise<User[]> {
    const users = await this.readUsers();
    return users
      .filter(user => user.tenantId === tenantId)
      .map(({ passwordHash, salt, ...user }) => user);
  }
  
  static async createUser(userData: RegisterData): Promise<User> {
    const users = await this.readUsers();

    // Check if email already exists
    const existingUser = users.find(user =>
      user.email.toLowerCase() === userData.email.toLowerCase()
    );

    if (existingUser) {
      throw new Error('Email already exists');
    }

    // Generate password hash
    const { hash, salt } = hashPassword(userData.password);

    let tenantId = userData.tenantId;
    let tenantRole: 'owner' | 'admin' | 'member' = 'member';

    // Handle tenant creation if needed
    if (!tenantId && userData.tenantName) {
      // Create new tenant
      const newTenant = createDefaultTenant(
        generateId(), // Temporary ID, will be updated after user creation
        userData.tenantName,
        userData.organizationType || 'individual'
      );
      tenantId = newTenant.id;
      tenantRole = 'owner';

      // Save the new tenant
      await TenantDatabase.createTenant(newTenant);
    } else if (!tenantId) {
      tenantId = 'default';
    }

    // Create new user
    const newUser: UserWithPassword = {
      id: generateId(),
      email: userData.email.toLowerCase(),
      name: userData.name,
      role: userData.role || 'student',
      tenantId,
      tenantRole,
      tenants: [tenantId],
      createdAt: new Date().toISOString(),
      isActive: true,
      passwordHash: hash,
      salt: salt,
      preferences: {
        defaultTenant: tenantId,
        theme: 'light',
        language: 'en'
      }
    };

    users.push(newUser);
    await this.writeUsers(users);

    // Update tenant owner if this user created the tenant
    if (tenantRole === 'owner' && userData.tenantName) {
      await TenantDatabase.updateTenant(tenantId, { ownerId: newUser.id });
    }

    // Return user without password fields
    const { passwordHash, salt: _, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  }
  
  static async updateUser(id: string, updates: Partial<User>): Promise<User | null> {
    const users = await this.readUsers();
    const userIndex = users.findIndex(user => user.id === id);
    
    if (userIndex === -1) {
      return null;
    }
    
    // Update user data
    users[userIndex] = {
      ...users[userIndex],
      ...updates,
      id, // Ensure ID cannot be changed
    };
    
    await this.writeUsers(users);
    
    // Return updated user without password fields
    const { passwordHash, salt, ...userWithoutPassword } = users[userIndex];
    return userWithoutPassword;
  }
  
  static async updatePassword(id: string, newPassword: string): Promise<boolean> {
    const users = await this.readUsers();
    const userIndex = users.findIndex(user => user.id === id);
    
    if (userIndex === -1) {
      return false;
    }
    
    const { hash, salt } = hashPassword(newPassword);
    users[userIndex].passwordHash = hash;
    users[userIndex].salt = salt;
    
    await this.writeUsers(users);
    return true;
  }
  
  static async deleteUser(id: string): Promise<boolean> {
    const users = await this.readUsers();
    const filteredUsers = users.filter(user => user.id !== id);
    
    if (filteredUsers.length === users.length) {
      return false; // User not found
    }
    
    await this.writeUsers(filteredUsers);
    return true;
  }
  
  static async getAllUsers(): Promise<User[]> {
    const users = await this.readUsers();
    return users.map(({ passwordHash, salt, ...user }) => user);
  }
  
  static async getUserStats(tenantId?: string): Promise<{
    total: number;
    byRole: Record<string, number>;
    active: number;
  }> {
    const users = await this.readUsers();
    const filteredUsers = tenantId
      ? users.filter(user => user.tenantId === tenantId)
      : users;

    const stats = {
      total: filteredUsers.length,
      byRole: {} as Record<string, number>,
      active: filteredUsers.filter(user => user.isActive).length
    };

    filteredUsers.forEach(user => {
      stats.byRole[user.role] = (stats.byRole[user.role] || 0) + 1;
    });

    return stats;
  }
}

// Tenant database operations
export class TenantDatabase {
  private static async readTenants(): Promise<Tenant[]> {
    await initializeDatabase();
    try {
      const data = await fs.readFile(TENANTS_FILE, 'utf-8');
      return JSON.parse(data);
    } catch {
      return [];
    }
  }

  private static async writeTenants(tenants: Tenant[]): Promise<void> {
    await ensureDataDir();
    await fs.writeFile(TENANTS_FILE, JSON.stringify(tenants, null, 2));
  }

  static async findById(id: string): Promise<Tenant | null> {
    const tenants = await this.readTenants();
    return tenants.find(tenant => tenant.id === id) || null;
  }

  static async findByName(name: string): Promise<Tenant | null> {
    const tenants = await this.readTenants();
    return tenants.find(tenant => tenant.name === name) || null;
  }

  static async findByDomain(domain: string): Promise<Tenant | null> {
    const tenants = await this.readTenants();
    return tenants.find(tenant => tenant.domain === domain) || null;
  }

  static async createTenant(tenantData: Tenant): Promise<Tenant> {
    const tenants = await this.readTenants();

    // Check if tenant name already exists
    const existingTenant = tenants.find(tenant =>
      tenant.name === tenantData.name
    );

    if (existingTenant) {
      throw new Error('Tenant name already exists');
    }

    tenants.push(tenantData);
    await this.writeTenants(tenants);

    return tenantData;
  }

  static async updateTenant(id: string, updates: Partial<Tenant>): Promise<Tenant | null> {
    const tenants = await this.readTenants();
    const tenantIndex = tenants.findIndex(tenant => tenant.id === id);

    if (tenantIndex === -1) {
      return null;
    }

    // Update tenant data
    tenants[tenantIndex] = {
      ...tenants[tenantIndex],
      ...updates,
      id, // Ensure ID cannot be changed
      updatedAt: new Date().toISOString()
    };

    await this.writeTenants(tenants);
    return tenants[tenantIndex];
  }

  static async deleteTenant(id: string): Promise<boolean> {
    if (id === 'default') {
      throw new Error('Cannot delete default tenant');
    }

    const tenants = await this.readTenants();
    const tenantIndex = tenants.findIndex(tenant => tenant.id === id);

    if (tenantIndex === -1) {
      return false;
    }

    tenants.splice(tenantIndex, 1);
    await this.writeTenants(tenants);

    // TODO: Clean up tenant-specific data
    return true;
  }

  static async getAllTenants(): Promise<Tenant[]> {
    return await this.readTenants();
  }

  static async getTenantsForUser(userId: string): Promise<Tenant[]> {
    const tenants = await this.readTenants();
    const user = await UserDatabase.findById(userId);

    if (!user) return [];

    // Return tenants where user is a member
    return tenants.filter(tenant =>
      tenant.id === user.tenantId ||
      (user.tenants && user.tenants.includes(tenant.id)) ||
      tenant.ownerId === userId
    );
  }
}

// Session storage (for additional security/tracking)
export class SessionDatabase {
  private static async readSessions(): Promise<any[]> {
    await initializeDatabase();
    try {
      const data = await fs.readFile(SESSIONS_FILE, 'utf-8');
      return JSON.parse(data);
    } catch {
      return [];
    }
  }
  
  private static async writeSessions(sessions: any[]): Promise<void> {
    await ensureDataDir();
    await fs.writeFile(SESSIONS_FILE, JSON.stringify(sessions, null, 2));
  }
  
  static async logSession(userId: string, sessionData: any): Promise<void> {
    const sessions = await this.readSessions();
    sessions.push({
      id: generateId(),
      userId,
      createdAt: new Date().toISOString(),
      ...sessionData
    });
    
    // Keep only last 100 sessions per user
    const userSessions = sessions.filter(s => s.userId === userId);
    if (userSessions.length > 100) {
      const otherSessions = sessions.filter(s => s.userId !== userId);
      const recentUserSessions = userSessions.slice(-100);
      await this.writeSessions([...otherSessions, ...recentUserSessions]);
    } else {
      await this.writeSessions(sessions);
    }
  }
  
  static async getUserSessions(userId: string): Promise<any[]> {
    const sessions = await this.readSessions();
    return sessions.filter(session => session.userId === userId);
  }
}

// Tenant-scoped data management
export class TenantDataManager {
  private static getTenantDataPath(tenantId: string, dataType: string): string {
    return path.join(USER_DATA_DIR, tenantId, `${dataType}.json`);
  }

  private static async ensureTenantDataDir(tenantId: string): Promise<void> {
    const tenantDir = path.join(USER_DATA_DIR, tenantId);
    try {
      await fs.access(tenantDir);
    } catch {
      await fs.mkdir(tenantDir, { recursive: true });
    }
  }

  static async readTenantData<T>(tenantId: string, dataType: string): Promise<T[]> {
    await this.ensureTenantDataDir(tenantId);
    const filePath = this.getTenantDataPath(tenantId, dataType);

    try {
      const data = await fs.readFile(filePath, 'utf-8');
      return JSON.parse(data);
    } catch {
      return [];
    }
  }

  static async writeTenantData<T>(tenantId: string, dataType: string, data: T[]): Promise<void> {
    await this.ensureTenantDataDir(tenantId);
    const filePath = this.getTenantDataPath(tenantId, dataType);
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
  }

  static async addTenantData<T extends { id: string; userId: string }>(
    tenantId: string,
    dataType: string,
    item: T
  ): Promise<T> {
    const data = await this.readTenantData<T>(tenantId, dataType);

    // Ensure the item belongs to this tenant
    const itemWithTenant = { ...item, tenantId };
    data.push(itemWithTenant);

    await this.writeTenantData(tenantId, dataType, data);
    return itemWithTenant;
  }

  static async updateTenantData<T extends { id: string; userId: string }>(
    tenantId: string,
    dataType: string,
    itemId: string,
    updates: Partial<T>
  ): Promise<T | null> {
    const data = await this.readTenantData<T>(tenantId, dataType);
    const itemIndex = data.findIndex(item => item.id === itemId);

    if (itemIndex === -1) {
      return null;
    }

    data[itemIndex] = { ...data[itemIndex], ...updates };
    await this.writeTenantData(tenantId, dataType, data);

    return data[itemIndex];
  }

  static async deleteTenantData(
    tenantId: string,
    dataType: string,
    itemId: string
  ): Promise<boolean> {
    const data = await this.readTenantData(tenantId, dataType);
    const itemIndex = data.findIndex((item: any) => item.id === itemId);

    if (itemIndex === -1) {
      return false;
    }

    data.splice(itemIndex, 1);
    await this.writeTenantData(tenantId, dataType, data);

    return true;
  }

  static async getUserDataInTenant<T extends { userId: string }>(
    tenantId: string,
    dataType: string,
    userId: string
  ): Promise<T[]> {
    const data = await this.readTenantData<T>(tenantId, dataType);
    return data.filter(item => item.userId === userId);
  }

  static async migrateLegacyData(tenantId: string, userId: string): Promise<void> {
    // This method will help migrate existing localStorage data to tenant-scoped storage
    // Implementation will be added when we update the frontend components
  }
}

// Initialize database on module load
initializeDatabase().catch(console.error);
