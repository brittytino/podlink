import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Enhanced Prisma client configuration with connection handling
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    errorFormat: 'pretty',
    // Add connection configuration for Neon
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  });

// Helper function to execute Prisma operations with automatic reconnection
let isReconnecting = false;

async function executeWithRetry<T>(
  operation: () => Promise<T>,
  operationName = 'operation'
): Promise<T> {
  let retries = 0;
  const maxRetries = 3;

  while (retries < maxRetries) {
    try {
      return await operation();
    } catch (error: any) {
      // Check if it's a connection closed error
      const isConnectionError = 
        error?.message?.includes('Closed') ||
        error?.message?.includes('Connection') ||
        error?.code === 'P1001' ||
        error?.code === 'P1000' ||
        (error?.kind === 'Closed' && error?.cause === null);

      if (isConnectionError && retries < maxRetries - 1 && !isReconnecting) {
        retries++;
        console.log(`🔄 Connection closed in ${operationName}, attempting reconnect (attempt ${retries}/${maxRetries})...`);
        
        isReconnecting = true;
        try {
          // Disconnect and reconnect
          await prisma.$disconnect().catch(() => {});
          await new Promise((resolve) => setTimeout(resolve, 500 * retries)); // Exponential backoff
          await prisma.$connect();
          console.log(`✅ Database reconnected`);
        } catch (reconnectError) {
          console.error(`❌ Reconnection attempt ${retries} failed:`, reconnectError);
        } finally {
          isReconnecting = false;
        }
        
        // Retry the operation after reconnection
        continue;
      }
      
      // Not a connection error or max retries reached
      throw error;
    }
  }
  
  throw new Error(`Max reconnection attempts (${maxRetries}) reached for ${operationName}`);
}

// Override Prisma client methods to use automatic reconnection
const originalPrisma = prisma;

// Create a proxy that wraps all Prisma operations
export const prismaWithAutoReconnect = new Proxy(originalPrisma, {
  get(target, prop) {
    const value = (target as any)[prop];
    
    // If it's a model (user, pod, etc.), wrap its methods
    if (typeof value === 'object' && value !== null && prop !== '$connect' && prop !== '$disconnect' && prop !== '$queryRaw') {
      return new Proxy(value, {
        get(modelTarget: any, modelProp: string) {
          const modelValue = modelTarget[modelProp];
          
          // Wrap async methods (findUnique, findMany, create, update, etc.)
          if (typeof modelValue === 'function') {
            return function (...args: any[]) {
              return executeWithRetry(
                () => modelValue.apply(modelTarget, args),
                `${String(prop)}.${modelProp}`
              );
            };
          }
          
          return modelValue;
        },
      });
    }
    
    // For $connect and $disconnect, return as-is
    if (prop === '$connect' || prop === '$disconnect') {
      return value;
    }
    
    // For everything else (including $queryRaw), wrap in retry
    if (typeof value === 'function') {
      return function (...args: any[]) {
        return executeWithRetry(
          () => value.apply(target, args),
          String(prop)
        );
      };
    }
    
    return value;
  },
});

// Test database connection on startup (lazy, on first query if needed)
let connectionTested = false;
async function testConnection() {
  if (!connectionTested) {
    try {
      await prisma.$connect();
      console.log('✅ Database connection successful');
      connectionTested = true;
    } catch (error) {
      console.error('❌ Failed to connect to database:', error);
      // Don't throw - let it retry on first query
    }
  }
}

// Setup graceful shutdown handlers only in Node.js runtime (not Edge Runtime)
// We detect Edge Runtime by checking if we're in a context where process.on exists
// and can be safely called. In Edge Runtime, this entire block will be skipped.
(function setupShutdownHandlers() {
  // Check if we're in Node.js runtime (not Edge Runtime)
  // Edge Runtime doesn't have process.on, so accessing it directly would fail
  const isNodeRuntime = typeof process !== 'undefined' && 
                        typeof process.env !== 'undefined' && 
                        'NODE_ENV' in process.env;
  
  if (!isNodeRuntime) {
    // We're in Edge Runtime, skip shutdown handlers
    return;
  }

  // Safe to access process.on in Node.js runtime
  // Use dynamic check to avoid Edge Runtime errors
  try {
    // This will only work in Node.js runtime
    const processOn = typeof process !== 'undefined' && 
                      'on' in process && 
                      typeof (process as any).on === 'function';
    
    if (processOn) {
      // Test connection in production (Node.js only)
      if (process.env.NODE_ENV === 'production') {
        testConnection();
      }

      // Graceful shutdown handler
      const gracefulShutdown = async () => {
        try {
          await prisma.$disconnect();
          console.log('✅ Database connection closed gracefully');
        } catch (error) {
          console.error('Error disconnecting from database:', error);
        }
      };

      // Register shutdown handlers
      (process as any).on('beforeExit', gracefulShutdown);
      (process as any).on('SIGINT', gracefulShutdown);
      (process as any).on('SIGTERM', gracefulShutdown);
    }
  } catch (error) {
    // We're in Edge Runtime, this is expected and safe to ignore
    // Prisma will work fine without shutdown handlers
  }
})();

// Reuse Prisma instance globally in development (use wrapped version for auto-reconnect)
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prismaWithAutoReconnect as any;
}

// Export Prisma client with automatic reconnection
// This ensures all database operations automatically retry on connection errors
export default prismaWithAutoReconnect;
