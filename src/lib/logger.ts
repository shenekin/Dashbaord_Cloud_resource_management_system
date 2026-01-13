/**
 * Logger utility for recording application logs
 * Excludes error and warning levels - only logs info, debug, and trace
 * Automatically masks sensitive data (passwords, access keys, secret keys)
 */

type LogLevel = 'info' | 'debug' | 'trace';

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  category: string;
  message: string;
  data?: any;
}

/**
 * Mask sensitive fields in data objects
 * Prevents logging of passwords, access keys, and secret keys
 */
function maskSensitiveData(data: any): any {
  if (!data || typeof data !== 'object') {
    return data;
  }

  if (Array.isArray(data)) {
    return data.map(item => maskSensitiveData(item));
  }

  const masked: any = {};
  const sensitiveFields = [
    'password',
    'adminPassword',
    'admin_password',
    'accessKey',
    'access_key',
    'accessKeyId',
    'access_key_id',
    'secretKey',
    'secret_key',
    'secretAccessKey',
    'secret_access_key',
    'ak',
    'sk',
    'token',
    'authToken',
    'auth_token',
    'refreshToken',
    'refresh_token',
  ];

  for (const [key, value] of Object.entries(data)) {
    const lowerKey = key.toLowerCase();
    const isSensitive = sensitiveFields.some(field => 
      lowerKey.includes(field.toLowerCase())
    );

    if (isSensitive) {
      masked[key] = '***MASKED***';
    } else if (typeof value === 'object' && value !== null) {
      masked[key] = maskSensitiveData(value);
    } else {
      masked[key] = value;
    }
  }

  return masked;
}

/**
 * Format log entry as string
 */
function formatLogEntry(entry: LogEntry): string {
  const dataStr = entry.data 
    ? ` | Data: ${JSON.stringify(entry.data, null, 2)}`
    : '';
  return `[${entry.timestamp}] [${entry.level.toUpperCase()}] [${entry.category}] ${entry.message}${dataStr}`;
}

/**
 * Logger class for application logging
 */
class Logger {
  private category: string;

  constructor(category: string) {
    this.category = category;
  }

  /**
   * Log info level message
   */
  info(message: string, data?: any): void {
    this.log('info', message, data);
  }

  /**
   * Log debug level message
   */
  debug(message: string, data?: any): void {
    this.log('debug', message, data);
  }

  /**
   * Log trace level message
   */
  trace(message: string, data?: any): void {
    this.log('trace', message, data);
  }

  /**
   * Internal log method
   */
  private log(level: LogLevel, message: string, data?: any): void {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      category: this.category,
      message,
      data: data ? maskSensitiveData(data) : undefined,
    };

    const logString = formatLogEntry(entry);

    // Log to console (for development)
    if (process.env.NODE_ENV === 'development') {
      console.log(logString);
    }

    // Send to log API (for file logging)
    if (typeof window !== 'undefined') {
      this.sendToLogAPI(entry).catch(err => {
        // Silently fail - don't break application if logging fails
        if (process.env.NODE_ENV === 'development') {
          console.error('Failed to send log to API:', err);
        }
      });
    }
  }

  /**
   * Send log entry to API route for file writing
   */
  private async sendToLogAPI(entry: LogEntry): Promise<void> {
    try {
      await fetch('/api/log', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(entry),
      });
    } catch (error) {
      // Silently fail - logging should not break the application
    }
  }
}

/**
 * Create a logger instance for a specific category
 */
export function createLogger(category: string): Logger {
  return new Logger(category);
}

/**
 * Default logger instance
 */
export const logger = createLogger('app');

