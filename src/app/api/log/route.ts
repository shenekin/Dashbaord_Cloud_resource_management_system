/**
 * API route for handling log entries
 * Writes logs to files in the log directory
 */

import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

interface LogEntry {
  timestamp: string;
  level: string;
  category: string;
  message: string;
  data?: any;
}

/**
 * Get log file path based on category
 */
function getLogFilePath(category: string): string {
  const logDir = join(process.cwd(), 'log');
  const fileName = category === 'ecs' ? 'ecs.log' : `${category}.log`;
  return join(logDir, fileName);
}

/**
 * Format log entry as string
 */
function formatLogEntry(entry: LogEntry): string {
  const dataStr = entry.data 
    ? ` | Data: ${JSON.stringify(entry.data, null, 2)}`
    : '';
  return `[${entry.timestamp}] [${entry.level.toUpperCase()}] [${entry.category}] ${entry.message}${dataStr}\n`;
}

/**
 * POST handler for log entries
 */
export async function POST(request: NextRequest) {
  try {
    const entry: LogEntry = await request.json();

    // Validate log entry
    if (!entry.timestamp || !entry.level || !entry.category || !entry.message) {
      return NextResponse.json(
        { error: 'Invalid log entry' },
        { status: 400 }
      );
    }

    // Only process info, debug, and trace levels (exclude error and warning)
    const allowedLevels = ['info', 'debug', 'trace'];
    if (!allowedLevels.includes(entry.level.toLowerCase())) {
      return NextResponse.json(
        { error: 'Log level not allowed' },
        { status: 400 }
      );
    }

    // Ensure log directory exists
    const logDir = join(process.cwd(), 'log');
    try {
      await mkdir(logDir, { recursive: true });
    } catch (error: any) {
      // Directory might already exist, ignore error
      if (error.code !== 'EEXIST') {
        throw error;
      }
    }

    // Get log file path
    const logFilePath = getLogFilePath(entry.category);

    // Format and write log entry
    const logString = formatLogEntry(entry);
    await writeFile(logFilePath, logString, { flag: 'a' });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    // Don't expose internal errors to client
    return NextResponse.json(
      { error: 'Failed to write log' },
      { status: 500 }
    );
  }
}

