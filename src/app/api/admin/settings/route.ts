import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';

interface SystemSettings {
  siteName: string;
  siteDescription: string;
  maintenanceMode: boolean;
  registrationEnabled: boolean;
  emailNotifications: boolean;
  maxUsersPerTenant: number;
  sessionTimeout: number;
  backupFrequency: string;
  logLevel: string;
}

// In a real application, these would be stored in a database
let systemSettings: SystemSettings = {
  siteName: 'UPSC Dashboard',
  siteDescription: 'Comprehensive UPSC preparation platform',
  maintenanceMode: false,
  registrationEnabled: true,
  emailNotifications: true,
  maxUsersPerTenant: 1000,
  sessionTimeout: 24,
  backupFrequency: 'daily',
  logLevel: 'info'
};

export async function GET(request: NextRequest) {
  try {
    // Check authentication and admin role
    const session = await getSession(request);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      settings: systemSettings
    });
  } catch (error) {
    console.error('Error fetching admin settings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch settings' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check authentication and admin role
    const session = await getSession(request);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    const body = await request.json();
    
    // Validate required fields
    const requiredFields = ['siteName', 'siteDescription', 'maxUsersPerTenant', 'sessionTimeout'];
    for (const field of requiredFields) {
      if (!body[field] && body[field] !== false && body[field] !== 0) {
        return NextResponse.json(
          { error: `${field} is required` },
          { status: 400 }
        );
      }
    }

    // Validate data types and ranges
    if (typeof body.maxUsersPerTenant !== 'number' || body.maxUsersPerTenant < 1) {
      return NextResponse.json(
        { error: 'maxUsersPerTenant must be a positive number' },
        { status: 400 }
      );
    }

    if (typeof body.sessionTimeout !== 'number' || body.sessionTimeout < 1 || body.sessionTimeout > 168) {
      return NextResponse.json(
        { error: 'sessionTimeout must be between 1 and 168 hours' },
        { status: 400 }
      );
    }

    const validBackupFrequencies = ['hourly', 'daily', 'weekly', 'monthly'];
    if (!validBackupFrequencies.includes(body.backupFrequency)) {
      return NextResponse.json(
        { error: 'Invalid backup frequency' },
        { status: 400 }
      );
    }

    const validLogLevels = ['error', 'warn', 'info', 'debug'];
    if (!validLogLevels.includes(body.logLevel)) {
      return NextResponse.json(
        { error: 'Invalid log level' },
        { status: 400 }
      );
    }

    // Update settings
    systemSettings = {
      siteName: body.siteName.trim(),
      siteDescription: body.siteDescription.trim(),
      maintenanceMode: Boolean(body.maintenanceMode),
      registrationEnabled: Boolean(body.registrationEnabled),
      emailNotifications: Boolean(body.emailNotifications),
      maxUsersPerTenant: Number(body.maxUsersPerTenant),
      sessionTimeout: Number(body.sessionTimeout),
      backupFrequency: body.backupFrequency,
      logLevel: body.logLevel
    };

    // Log the settings change
    console.log(`Admin ${session.user.email} updated system settings:`, {
      timestamp: new Date().toISOString(),
      changes: systemSettings
    });

    return NextResponse.json({
      success: true,
      message: 'Settings updated successfully',
      settings: systemSettings
    });
  } catch (error) {
    console.error('Error updating admin settings:', error);
    return NextResponse.json(
      { error: 'Failed to update settings' },
      { status: 500 }
    );
  }
}
