# Authentication Service

> **File:** `auth.service.ts`
> **Type:** Service
> **Module:** Authentication
> **Created:** 2026-02-11

## 📋 Overview

The **AuthService** handles user authentication and token management for the application. It provides secure login/logout functionality and token validation for protected routes.

## 🔑 Key Components

### Interfaces

#### LoginCredentials
```typescript
interface LoginCredentials {
    email: string;
    password: string;
}
```

#### AuthToken
```typescript
interface AuthToken {
    token: string;      // JWT or session token
    expiresAt: Date;    // Token expiration time
    userId: string;     // Associated user ID
}
```

### Main Methods

| Method | Purpose | Returns |
|--------|---------|---------|
| `login(credentials)` | Authenticate user | `Promise<AuthToken>` |
| `validateToken(token)` | Check token validity | `Promise<boolean>` |
| `logout(token)` | Invalidate token | `Promise<void>` |

## 📖 Usage

### User Login

```typescript
import { AuthService } from './auth/auth.service';

const authService = new AuthService();

const token = await authService.login({
    email: 'user@example.com',
    password: 'securePassword123'
});

console.log('Logged in:', token);
// Store token in cookies or localStorage
```

### Token Validation (Middleware)

```typescript
async function authMiddleware(req, res, next) {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }

    const isValid = await authService.validateToken(token);

    if (!isValid) {
        return res.status(401).json({ error: 'Invalid or expired token' });
    }

    next();
}
```

### User Logout

```typescript
await authService.logout(token);
console.log('User logged out successfully');
```

## 🔗 Dependencies

- Part of the **auth** module
- Should integrate with `UserService` for credential verification
- Consider using JWT library for production tokens

## ⚠️ Security Considerations

### Current Implementation Issues

1. **No Password Hashing** - Passwords should be hashed with bcrypt
2. **Simple Token Generation** - Use JWT or secure random tokens
3. **In-Memory Storage** - Tokens are lost on restart
4. **No Rate Limiting** - Vulnerable to brute force attacks

### Production Checklist

- [ ] Implement password hashing (bcrypt)
- [ ] Use JWT with secret key
- [ ] Store tokens in Redis or database
- [ ] Add rate limiting for login attempts
- [ ] Implement refresh token mechanism
- [ ] Add multi-factor authentication (MFA)
- [ ] Log authentication attempts

## 🎯 Recommended Implementation

```typescript
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

async login(credentials: LoginCredentials): Promise<AuthToken> {
    // 1. Find user by email
    const user = await this.userService.findByEmail(credentials.email);

    if (!user) {
        throw new Error('Invalid credentials');
    }

    // 2. Verify password
    const isValid = await bcrypt.compare(credentials.password, user.passwordHash);

    if (!isValid) {
        throw new Error('Invalid credentials');
    }

    // 3. Generate JWT
    const token = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
    );

    return {
        token,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
        userId: user.id
    };
}
```

## 📅 Changelog

- **2026-02-11**: Initial implementation with basic token management
- **TODO**: Migrate to JWT and add password hashing
