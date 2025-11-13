import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Optimized Prisma client configuration for Neon free tier
// Neon free tier databases pause after inactivity and need time to wake up
const prismaBase =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
    errorFormat: 'pretty',
    // Optimize for Neon free tier
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  });

// Export base prisma for compatibility
export const prisma = prismaBase;

// Helper function to wake up Neon database (for free tier)
async function wakeUpDatabase(): Promise<boolean> {
  try {
    // Simple query to wake up the database
    await prismaBase.$queryRaw`SELECT 1`;
    return true;
  } catch (error) {
    return false;
  }
}

// Helper function to execute Prisma operations with automatic reconnection
// Optimized for Neon free tier (databases wake up in 2-5 seconds)
let isReconnecting = false;

async function executeWithRetry<T>(
  operation: () => Promise<T>,
  operationName = 'operation',
  maxRetries = 3 // Reduced from 5 for faster failure
): Promise<T> {
  let retries = 0;

  while (retries < maxRetries) {
    try {
      return await operation();
    } catch (error: any) {
      // Check if it's a connection error (Neon pause/resume)
      const isConnectionError = 
        error?.message?.includes('Can\'t reach database server') ||
        error?.message?.includes('Connection') ||
        error?.message?.includes('ECONNREFUSED') ||
        error?.message?.includes('ETIMEDOUT') ||
        error?.code === 'P1001' ||
        error?.code === 'P1000' ||
        error?.code === 'P1017' ||
        (error?.kind === 'Closed' && error?.cause === null);

      if (isConnectionError && retries < maxRetries - 1 && !isReconnecting) {
        retries++;
        // Optimized delays for Neon free tier wake-up (typically 2-5 seconds)
        // Use progressive delays: 2s, 3s, 4s instead of exponential backoff
        const delays = [2000, 3000, 4000];
        const delay = delays[retries - 1] || 4000;
        
        if (retries === 1) {
          console.log(`🔄 Database connection error in ${operationName}`);
          console.log(`💡 Neon free tier databases pause after inactivity. Waking up database (this takes 2-5 seconds)...`);
        } else {
          console.log(`🔄 Retrying ${operationName} (attempt ${retries}/${maxRetries}) after ${delay}ms...`);
        }
        
        isReconnecting = true;
        try {
          // Disconnect first to clear any stale connections
          await prismaBase.$disconnect().catch(() => {});
          
          // Wait for database to wake up (Neon free tier takes 2-5 seconds)
          await new Promise((resolve) => setTimeout(resolve, delay));
          
          // Try to wake up the database with a simple query
          try {
            await wakeUpDatabase();
            if (retries === 1) {
              console.log(`✅ Database woke up successfully`);
            }
          } catch (wakeError) {
            // Database might still be waking up, continue with retry
            if (retries === 1) {
              console.log(`⏳ Database still waking up, continuing retry...`);
            }
          }
        } catch (reconnectError) {
          // Log only on first retry to avoid spam
          if (retries === 1) {
            console.error(`❌ Reconnection attempt ${retries} failed:`, reconnectError);
          }
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
  
  throw new Error(`Max reconnection attempts (${maxRetries}) reached for ${operationName}. Database may be paused or unreachable.`);
}

// Create a proxy that wraps all Prisma operations with retry logic
export const prismaWithAutoReconnect = new Proxy(prismaBase, {
  get(target, prop) {
    const value = (target as any)[prop];
    
    // If it's a model (user, pod, etc.), wrap its methods
    if (typeof value === 'object' && value !== null && prop !== '$connect' && prop !== '$disconnect' && prop !== '$queryRaw' && prop !== '$transaction') {
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
    
    // For $queryRaw, wrap it with retry
    if (prop === '$queryRaw') {
      return function (...args: any[]) {
        return executeWithRetry(
          () => value.apply(target, args),
          '$queryRaw'
        );
      };
    }
    
    // For $transaction, wrap it
    if (prop === '$transaction') {
      return function (...args: any[]) {
        return executeWithRetry(
          () => value.apply(target, args),
          '$transaction'
        );
      };
    }
    
    // For everything else, wrap in retry
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

// Test database connection on startup (non-blocking)
let connectionTested = false;
async function testConnection() {
  if (!connectionTested) {
    try {
      // Try to wake up the database
      await wakeUpDatabase();
      console.log('✅ Database connection successful');
      connectionTested = true;
    } catch (error) {
      console.error('❌ Failed to connect to database:', error);
      console.error('💡 Neon free tier databases pause after inactivity. The database will wake up on first query.');
      // Don't throw - let it retry on first query
    }
  }
}

// Setup graceful shutdown handlers only in Node.js runtime
(function setupShutdownHandlers() {
  const isNodeRuntime = typeof process !== 'undefined' && 
                        typeof process.env !== 'undefined' && 
                        'NODE_ENV' in process.env;
  
  if (!isNodeRuntime) {
    return;
  }

  try {
    const processOn = typeof process !== 'undefined' && 
                      'on' in process && 
                      typeof (process as any).on === 'function';
    
    if (processOn) {
      // Test connection in development (non-blocking)
      if (process.env.NODE_ENV === 'development') {
        // Don't await - let it run in background
        testConnection().catch(() => {});
      }

      // Graceful shutdown handler
      const gracefulShutdown = async () => {
        try {
          await prismaBase.$disconnect();
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
    // Edge Runtime, safe to ignore
  }
})();

// Reuse Prisma instance globally in development
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prismaBase as any;
}

// Start database keep-alive to prevent Neon free tier from pausing
// This is optional but recommended for better user experience
// Note: Keep-alive is started in db-keepalive.ts automatically

// Export both versions for compatibility
// Use default export (prismaWithAutoReconnect) for automatic retry
// Named export (prisma) is the base client (already exported above)
export default prismaWithAutoReconnect;
