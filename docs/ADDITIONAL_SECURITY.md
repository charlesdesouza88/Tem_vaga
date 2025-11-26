# Additional Security Features - Implementation Guide

## 🛡️ Overview

This document covers the advanced security features implemented in v1.1.0 beyond password hashing, validation, and rate limiting.

---

## 1. Security Headers 🔒

### What They Do
Security headers protect against common web vulnerabilities like XSS, clickjacking, and MIME sniffing.

### Implementation
All security headers are automatically applied via **Next.js middleware** to every route.

**File:** `src/middleware.ts`

### Headers Applied

| Header | Value | Protection Against |
|--------|-------|---------------------|
| `X-Frame-Options` | `DENY` | Clickjacking attacks (prevents site from being embedded in iframes) |
| `X-Content-Type-Options` | `nosniff` | MIME type sniffing attacks |
| `X-XSS-Protection` | `1; mode=block` | Cross-site scripting (XSS) attacks |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | Information leakage via Referer header |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=()` | Unauthorized access to device features |
| `Content-Security-Policy` | (See below) | XSS, data injection, and other code injection attacks |

### Content Security Policy (CSP)
```
default-src 'self'
script-src 'self' 'unsafe-eval' 'unsafe-inline'
style-src 'self' 'unsafe-inline' https://fonts.googleapis.com
font-src 'self' https://fonts.gstatic.com
img-src 'self' data: https:
connect-src 'self' https://*.supabase.co wss://*.supabase.co https://www.googleapis.com
frame-ancestors 'none'
```

**Note:** `unsafe-eval` and `unsafe-inline` are required by Next.js for development. For production, consider using nonces or hashes.

### Utility Functions

**File:** `src/lib/security-headers.ts`

```typescript
import { applySecurityHeaders, createSecureResponse } from "@/lib/security-headers"

// Apply to existing response
const response = NextResponse.json({ data })
return applySecurityHeaders(response)

// Create new secure response
return createSecureResponse({ data }, { status: 200 })
```

---

## 2. Request Logging & Audit Trail 📊

### What It Does
Logs all API requests for security monitoring, debugging, and compliance.

### Implementation

**File:** `src/lib/logger.ts`

### Features

- **Automatic logging** of sensitive operations (auth, bookings, settings)
- **In-memory storage** (last 1000 requests)
- **Request metadata**: IP, user agent, method, path, duration
- **Status tracking**: Success/failure with error messages
- **User tracking**: Links requests to user IDs

### Usage

```typescript
import { logRequest, extractRequestInfo } from "@/lib/logger"

export async function POST(req: Request) {
    const startTime = Date.now()
    const requestInfo = extractRequestInfo(req)

    try {
        // Your logic here
        
        logRequest({
            ...requestInfo,
            timestamp: new Date().toISOString(),
            userId: "user-id",
            status: 200,
            duration: Date.now() - startTime,
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        logRequest({
            ...requestInfo,
            timestamp: new Date().toISOString(),
            status: 500,
            duration: Date.now() - startTime,
            error: error.message,
        })
        throw error
    }
}
```

### Monitoring Functions

```typescript
import { 
    getRecentLogs, 
    getUserLogs, 
    getFailedRequests,
    getRequestsByIP 
} from "@/lib/logger"

// Get last 100 requests
const recent = getRecentLogs(100)

// Get all requests from a user
const userRequests = getUserLogs("user-id", 50)

// Get failed requests (4xx, 5xx)
const failures = getFailedRequests(50)

// Detect potential abuse
const suspiciousIP = getRequestsByIP("192.168.1.1", 50)
```

### Console Output Example

```
[AUDIT] POST /api/auth/register | User: anonymous | IP: 192.168.1.1 | Status: 200
[AUDIT] POST /api/bookings/create | User: clabcd123 | IP: 192.168.1.2 | Status: 201
```

### Production Recommendations

For production, replace in-memory storage with:
- **Database**: Store logs in Supabase/PostgreSQL
- **Logging Service**: DataDog, Sentry, AWS CloudWatch
- **File System**: Rotating log files

---

## 3. CSRF Protection 🔐

### What It Does
Prevents Cross-Site Request Forgery attacks where malicious sites make unauthorized requests on behalf of users.

### Implementation

**File:** `src/lib/csrf.ts`

### Two Approaches

#### Approach 1: Origin Validation (Currently Used)

Validates that requests come from the same origin as the application.

```typescript
import { validateOrigin } from "@/lib/csrf"

export async function POST(req: Request) {
    const originCheck = validateOrigin(req)
    if (originCheck) {
        return originCheck // Returns 403 error
    }

    // Continue with request
}
```

**How it works:**
- Checks `Origin` or `Referer` headers
- Compares against `NEXT_PUBLIC_APP_URL`
- Only applicable to state-changing methods (POST, PUT, DELETE)
- GET requests are allowed (read-only)

#### Approach 2: CSRF Tokens (Available, Not Implemented)

For applications requiring stricter CSRF protection.

```typescript
import { generateCsrfToken, verifyCsrfToken } from "@/lib/csrf"

// Generate token for session
const token = generateCsrfToken(sessionId)

// Client must send token in header
const isValid = verifyCsrfToken(sessionId, token)
```

**Client-side usage:**
```javascript
// Include token in requests
fetch('/api/bookings/create', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': csrfToken
    },
    body: JSON.stringify(data)
})
```

#### Approach 3: Double Submit Cookie

Alternative pattern that doesn't require server-side storage.

```typescript
import { generateDoubleSubmitToken, verifyDoubleSubmitToken } from "@/lib/csrf"

const token = generateDoubleSubmitToken()
// Set as cookie and require in header
```

### Current Implementation

✅ **Origin validation** is currently applied to:
- `/api/auth/register`
- Can be added to other routes as needed

---

## 4. Improved Error Handling ⚠️

### What It Does
Provides consistent, secure error responses with proper status codes and logging.

### Implementation

**File:** `src/lib/error-handler.ts`

### Features

- **Standardized error format** across all APIs
- **Error codes** for programmatic error handling
- **Security-conscious** - doesn't expose internal errors
- **Type-safe** error handlers

### Error Response Format

```json
{
    "error": "Mensagem de erro em português",
    "code": "ERROR_CODE",
    "details": { ... },
    "timestamp": "2024-11-26T15:00:00.000Z"
}
```

### Error Codes

```typescript
ERROR_CODES = {
    VALIDATION_ERROR: "VALIDATION_ERROR",
    AUTHENTICATION_FAILED: "AUTHENTICATION_FAILED",
    AUTHORIZATION_FAILED: "AUTHORIZATION_FAILED",
    RESOURCE_NOT_FOUND: "RESOURCE_NOT_FOUND",
    RATE_LIMIT_EXCEEDED: "RATE_LIMIT_EXCEEDED",
    CSRF_TOKEN_INVALID: "CSRF_TOKEN_INVALID",
    INVALID_ORIGIN: "INVALID_ORIGIN",
    DATABASE_ERROR: "DATABASE_ERROR",
    EXTERNAL_API_ERROR: "EXTERNAL_API_ERROR",
    INTERNAL_ERROR: "INTERNAL_ERROR",
}
```

### Usage Examples

```typescript
import {
    createErrorResponse,
    handleZodError,
    handleAuthError,
    handleNotFoundError,
    handleApiError,
} from "@/lib/error-handler"

// Manual error creation
return createErrorResponse("User not found", "USER_NOT_FOUND", 404)

// Handle Zod validation errors
if (!validationResult.success) {
    return handleZodError(validationResult.error)
}

// Handle authentication
if (!user) {
    return handleAuthError("Credenciais inválidas")
}

// Generic error handler
try {
    // Your logic
} catch (error) {
    return handleApiError(error) // Automatically determines error type
}
```

### Error Handler Wrapper

Automatically wraps API routes with error handling:

```typescript
import { withErrorHandler } from "@/lib/error-handler"

export const POST = withErrorHandler(async function(req: Request) {
    // Your logic
    // Errors are automatically caught and handled
})
```

---

## 5. CORS Configuration 🌐

### What It Does
Controls which origins can make requests to your API.

### Implementation

Automatically configured in `src/middleware.ts` for API routes.

### Configuration

```typescript
const allowedOrigins = [
    process.env.NEXT_PUBLIC_APP_URL,
    "http://localhost:3000",
]
```

### Headers Set

- `Access-Control-Allow-Origin`: Allowed origins
- `Access-Control-Allow-Methods`: GET, POST, PUT, DELETE, OPTIONS
- `Access-Control-Allow-Headers`: Content-Type, Authorization, X-CSRF-Token

---

## 📋 Implementation Checklist

### Already Implemented ✅
- [x] Security headers middleware
- [x] Request logging system
- [x] Origin validation (CSRF)
- [x] Error handling utilities
- [x] CORS configuration

### Optional Enhancements 🔄
- [ ] Move logs to database
- [ ] Implement CSRF tokens (if needed)
- [ ] Add Sentry/DataDog integration
- [ ] Add rate limit monitoring dashboard
- [ ] Implement log rotation
- [ ] Add security event alerting

---

## 🧪 Testing

### Test Security Headers

```bash
curl -I http://localhost:3000

# Should see:
# X-Frame-Options: DENY
# X-Content-Type-Options: nosniff
# Content-Security-Policy: ...
```

### Test Origin Validation

```bash
# This should fail (invalid origin)
curl -X POST http://localhost:3000/api/auth/register \
  -H "Origin: https://evil-site.com" \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"Test123!"}'

# Should return 403 Forbidden
```

### Test Request Logging

Check console output after making requests. Should see:
```
[AUDIT] POST /api/auth/register | User: anonymous | IP: ... | Status: 200
```

---

## 🚀 Production Deployment

### Before Deploying

1. **Enable HSTS** (HTTPS only):
   ```typescript
   // In src/middleware.ts
   "Strict-Transport-Security": "max-age=31536000; includeSubDomains"
   ```

2. **Tighten CSP** (remove unsafe-inline/unsafe-eval if possible)

3. **Set up log aggregation** (DataDog, Sentry, CloudWatch)

4. **Configure environment-specific CORS**

5. **Review and test all security headers**

---

## 📚 Resources

- [OWASP Security Headers](https://owasp.org/www-project-secure-headers/)
- [Content Security Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)
- [CSRF Prevention](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html)
- [Next.js Security](https://nextjs.org/docs/app/building-your-application/configuring/security)

---

**Security Version:** 1.1.0  
**Last Updated:** November 26, 2024  
**Status:** Production Ready ✅
