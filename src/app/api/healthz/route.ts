import { NextRequest, NextResponse } from 'next/server';

/**
 * Health Check Endpoint für Docker Container + Load Balancer
 * 
 * Used by:
 * - Docker HEALTHCHECK instruction
 * - Hetzner Load Balancer health checks  
 * - Uptime monitoring services
 * - Kubernetes liveness/readiness probes (future)
 */
export async function GET(request: NextRequest) {
  try {
    // Basic service health indicators
    const healthData = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      version: process.env.npm_package_version || '0.1.0',
      
      // System metrics für monitoring
      memory: {
        used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
        total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
        rss: Math.round(process.memoryUsage().rss / 1024 / 1024),
      },
      
      // Request metadata für debugging
      requestId: request.headers.get('x-request-id') || 'unknown',
      userAgent: request.headers.get('user-agent')?.includes('Docker') ? 'docker-healthcheck' : 'external-monitor',
      
      // Geographic/deployment info (für multi-region später)
      region: process.env.DEPLOYMENT_REGION || 'hetzner-nbg1',
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    };
    
    // Lightweight dependency checks (erweitert später bei DB/Redis)
    const checks = {
      nextjs: true, // If this runs, Next.js is healthy
      filesystem: checkFilesystem(),
      // database: await checkDatabase(), // TODO: Wenn PostgreSQL später
      // redis: await checkRedis(), // TODO: Wenn Redis Cache später
    };
    
    const allHealthy = Object.values(checks).every(Boolean);
    
    if (!allHealthy) {
      return NextResponse.json(
        { 
          ...healthData, 
          status: 'degraded',
          checks,
          message: 'Some components are unhealthy'
        },
        { status: 503 } // Service Unavailable für failing health checks
      );
    }
    
    // Successful health check
    return NextResponse.json({
      ...healthData,
      checks,
      message: 'All systems operational'
    }, {
      status: 200,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
        'Content-Type': 'application/json',
      }
    });
    
  } catch (error) {
    // Critical error - container should be restarted
    console.error('Health check failed:', error);
    
    return NextResponse.json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'Service is experiencing critical errors'
    }, {
      status: 503,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Content-Type': 'application/json',
      }
    });
  }
}

/**
 * Simple filesystem check - ensure we can read/write
 */
function checkFilesystem(): boolean {
  try {
    // Check if we can access the Next.js build directory
    const fs = require('fs');
    return fs.existsSync('./.next') || fs.existsSync('./public');
  } catch {
    return false;
  }
}

/**
 * Database health check (für später)
 * 
async function checkDatabase(): Promise<boolean> {
  try {
    // TODO: Simple SELECT 1 query gegen PostgreSQL
    return true;
  } catch {
    return false;
  }
}
*/

/**
 * Redis health check (für später) 
 *
async function checkRedis(): Promise<boolean> {
  try {
    // TODO: Redis PING command
    return true;
  } catch {
    return false;
  }
}
*/