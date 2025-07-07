import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function GET(request: NextRequest) {
  try {
    const diagnostics: any = {
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      jwtSecret: process.env.JWT_SECRET ? 'SET' : 'NOT_SET',
      jwtSecretLength: process.env.JWT_SECRET?.length || 0,
      workingDirectory: process.cwd(),
      dataDirectory: path.join(process.cwd(), 'data'),
      files: {} as any,
      errors: [] as any[]
    };

    // Check if data directory exists
    try {
      const dataDir = path.join(process.cwd(), 'data');
      await fs.access(dataDir);
      diagnostics.files.dataDirectoryExists = true;
      
      // List files in data directory
      const files = await fs.readdir(dataDir);
      diagnostics.files.dataDirectoryContents = files;
      
      // Check specific files
      for (const file of ['users.json', 'tenants.json', 'sessions.json']) {
        try {
          const filePath = path.join(dataDir, file);
          const stats = await fs.stat(filePath);
          diagnostics.files[file] = {
            exists: true,
            size: stats.size,
            modified: stats.mtime.toISOString()
          };
          
          // For users.json, check if admin user exists
          if (file === 'users.json') {
            const content = await fs.readFile(filePath, 'utf-8');
            const users = JSON.parse(content);
            const adminUser = users.find((u: any) => u.email === 'admin@upsc.local');
            diagnostics.files[file].adminUserExists = !!adminUser;
            diagnostics.files[file].totalUsers = users.length;
            if (adminUser) {
              diagnostics.files[file].adminUserStructure = {
                hasPasswordHash: !!adminUser.passwordHash,
                hasSalt: !!adminUser.salt,
                hasTenantRole: !!adminUser.tenantRole,
                hasTenants: !!adminUser.tenants,
                role: adminUser.role
              };
            }
          }
        } catch (error: any) {
          diagnostics.files[file] = {
            exists: false,
            error: error.message
          };
        }
      }
    } catch (error: any) {
      diagnostics.files.dataDirectoryExists = false;
      diagnostics.errors.push(`Data directory access error: ${error.message}`);
    }

    // Test JWT secret functionality
    try {
      const { SignJWT } = await import('jose');
      const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'test');
      const jwt = await new SignJWT({ test: true })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('1h')
        .sign(secret);
      diagnostics.jwtTest = 'SUCCESS';
    } catch (error: any) {
      diagnostics.jwtTest = `FAILED: ${error.message}`;
      diagnostics.errors.push(`JWT test error: ${error.message}`);
    }

    // Test database initialization
    try {
      const { UserDatabase } = await import('@/lib/database');
      const users = await UserDatabase.getAllUsers();
      diagnostics.databaseTest = {
        status: 'SUCCESS',
        userCount: users.length,
        adminExists: users.some(u => u.email === 'admin@upsc.local')
      };
    } catch (error: any) {
      diagnostics.databaseTest = {
        status: 'FAILED',
        error: error.message
      };
      diagnostics.errors.push(`Database test error: ${error.message}`);
    }

    return NextResponse.json(diagnostics, { status: 200 });

  } catch (error: any) {
    return NextResponse.json({
      error: 'Diagnostic failed',
      message: error.message,
      stack: error.stack
    }, { status: 500 });
  }
}
