# Logging Configuration

## Overview

A comprehensive logging system has been implemented for the ECS Server Creation form. The system records all application activities (info, debug, trace levels) while automatically masking sensitive data such as passwords, access keys, and secret keys.

## Log Directory Structure

```
/log
  ├── .gitkeep
  └── ecs.log          # ECS server creation logs
```

Log files are stored in the `log` directory at the project root.

## Log Levels

The logging system supports the following levels (excluding error and warning):

- **info**: General informational messages about application flow
- **debug**: Detailed debugging information for troubleshooting
- **trace**: Very detailed trace information for deep debugging

**Note**: Error and warning levels are explicitly excluded as per requirements.

## Sensitive Data Masking

The logger automatically masks the following sensitive fields:

- `password`, `adminPassword`, `admin_password`
- `accessKey`, `access_key`, `accessKeyId`, `access_key_id`
- `secretKey`, `secret_key`, `secretAccessKey`, `secret_access_key`
- `ak`, `sk`
- `token`, `authToken`, `auth_token`, `refreshToken`, `refresh_token`

All masked values are replaced with `***MASKED***` in log files.

## Implementation Details

### Logger Utility

**File**: `src/lib/logger.ts`

- Provides `createLogger(category)` function to create logger instances
- Automatically masks sensitive data before logging
- Sends logs to API route for file writing
- Falls back gracefully if logging fails (doesn't break application)

### API Route

**File**: `src/app/api/log/route.ts`

- Handles POST requests to `/api/log`
- Validates log entries
- Writes logs to appropriate files based on category
- Creates log directory if it doesn't exist
- Only processes info, debug, and trace levels

### ECS Logging Integration

**Files Modified**:
- `src/app/servers/create/hooks/useServerSubmit.ts`
- `src/components/server-form/ECSServerForm.tsx`

**Logged Events**:

1. **Form Review**:
   - When user clicks "Review & Create Server"
   - Form validation results
   - Form data summary (with sensitive data masked)

2. **Form Submission**:
   - When user confirms submission
   - Final validation results
   - Server creation start

3. **Credential Retrieval**:
   - When credentials are retrieved from local storage
   - Credential ID and customer/provider info (credentials themselves are masked)

4. **API Request**:
   - When API request is prepared
   - Request endpoint and payload (with sensitive data masked)
   - Server configuration details

5. **Server Creation Success**:
   - Server ID, name, status
   - Creation timestamp

6. **Server Creation Failure**:
   - Error messages
   - Status codes
   - Endpoint information

## Usage Examples

### Creating a Logger

```typescript
import { createLogger } from '@/lib/logger';

const logger = createLogger('ecs');

// Log info message
logger.info('Server creation started', { serverName: 'my-server' });

// Log debug message
logger.debug('Form validation passed', { fieldCount: 10 });

// Log trace message
logger.trace('Detailed trace information', { data: {...} });
```

### Log Format

Log entries are formatted as:

```
[2024-01-13T10:30:45.123Z] [INFO] [ecs] Server creation started | Data: {
  "serverName": "my-server",
  "region": "us-east-1",
  "adminPassword": "***MASKED***"
}
```

## Log File Location

- **ECS Logs**: `log/ecs.log`
- **Other Category Logs**: `log/{category}.log`

## Security Considerations

1. **Sensitive Data Protection**:
   - All passwords, access keys, and secret keys are automatically masked
   - Masked values appear as `***MASKED***` in logs

2. **Error Handling**:
   - Logging failures do not break the application
   - Errors in logging are silently handled

3. **Client-Side Logging**:
   - Logs are sent to server-side API route for file writing
   - No sensitive data is stored in browser storage

## Performance Considerations

1. **Asynchronous Logging**:
   - Logs are sent asynchronously to avoid blocking UI
   - Failed log writes don't affect application flow

2. **Development Mode**:
   - Logs are also printed to console in development mode
   - Helps with debugging during development

3. **Production Mode**:
   - Console logging is disabled in production
   - Only file logging is active

## Testing

To test the logging system:

1. Navigate to `/resources/ecs/create`
2. Fill out the ECS creation form
3. Click "Review & Create Server"
4. Confirm submission
5. Check `log/ecs.log` for logged events

## Log Rotation

Currently, logs are appended to files. For production use, consider implementing:

- Log rotation based on file size
- Log rotation based on date
- Automatic cleanup of old logs
- Log compression for archived logs

## Future Enhancements

1. **Log Levels Configuration**:
   - Allow configuration of log levels via environment variables
   - Support for different log levels in development vs production

2. **Log Aggregation**:
   - Integration with log aggregation services (e.g., ELK, Splunk)
   - Centralized log management

3. **Log Analytics**:
   - Log parsing and analysis tools
   - Dashboard for log monitoring

4. **Structured Logging**:
   - JSON format for easier parsing
   - Support for log metadata

## Troubleshooting

### Logs Not Appearing

1. Check that `log` directory exists and is writable
2. Verify API route `/api/log` is accessible
3. Check browser console for errors
4. Verify log level is not error or warning

### Sensitive Data in Logs

1. Verify masking function is working correctly
2. Check that sensitive field names match the mask list
3. Review log entries manually

### Performance Issues

1. Check log file sizes
2. Consider implementing log rotation
3. Monitor API route performance

## Files Created/Modified

### Created Files:
- `src/lib/logger.ts` - Logger utility
- `src/app/api/log/route.ts` - Log API route
- `log/.gitkeep` - Log directory placeholder
- `LOGGING_CONFIGURATION.md` - This documentation

### Modified Files:
- `src/app/servers/create/hooks/useServerSubmit.ts` - Added ECS logging
- `src/components/server-form/ECSServerForm.tsx` - Added form logging

## Compliance

- ✅ Sensitive data (passwords, AK, SK) are automatically masked
- ✅ Only info, debug, and trace levels are logged (errors/warnings excluded)
- ✅ Logs are stored in `log` directory at project root
- ✅ ECS server creation events are logged to `ecs.log`
- ✅ No Chinese comments added
- ✅ Existing functionality is not affected

