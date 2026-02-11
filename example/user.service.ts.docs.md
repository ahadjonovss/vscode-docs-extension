# User Service

> **File:** `user.service.ts`
> **Type:** Service Layer
> **Created:** 2026-02-11

## 📋 Overview

The **UserService** class provides a complete CRUD (Create, Read, Update, Delete) interface for managing user data in the application. It acts as the primary business logic layer for all user-related operations.

## 🔑 Key Components

### User Interface

Defines the structure of a user object:

```typescript
interface User {
    id: string;        // Unique identifier
    name: string;      // User's full name
    email: string;     // User's email address
    createdAt: Date;   // Account creation timestamp
}
```

### UserService Class

Main service class that handles user management operations.

#### Methods

- **`createUser(name, email)`** - Creates a new user account
- **`getUserById(id)`** - Retrieves a user by their ID
- **`updateUser(id, updates)`** - Updates user information
- **`deleteUser(id)`** - Removes a user from the system
- **`listUsers()`** - Returns all users

## 📖 Usage

### Creating a User

```typescript
import { UserService } from './user.service';

const userService = new UserService();

const newUser = await userService.createUser(
    'John Doe',
    'john.doe@example.com'
);

console.log(newUser);
// Output: { id: 'abc123', name: 'John Doe', email: 'john.doe@example.com', createdAt: Date }
```

### Retrieving a User

```typescript
const user = await userService.getUserById('abc123');

if (user) {
    console.log(`Found user: ${user.name}`);
} else {
    console.log('User not found');
}
```

### Updating a User

```typescript
const updated = await userService.updateUser('abc123', {
    name: 'Jane Doe',
    email: 'jane.doe@example.com'
});

if (updated) {
    console.log('User updated successfully');
}
```

### Deleting a User

```typescript
const deleted = await userService.deleteUser('abc123');
console.log(deleted ? 'Deleted' : 'Not found');
```

### Listing All Users

```typescript
const allUsers = await userService.listUsers();
console.log(`Total users: ${allUsers.length}`);
```

## 🔗 Dependencies

### External Dependencies
- None (uses native JavaScript/TypeScript)

### Internal Dependencies
- Uses `Map<string, User>` for in-memory storage
- Can be extended to use database repositories

## 📝 Implementation Notes

### Current Storage Implementation

⚠️ **Important**: This service currently uses **in-memory storage** with a `Map`. This means:

- Data is lost when the application restarts
- Not suitable for production use
- Should be replaced with a database repository

### Recommended Improvements

1. **Persistent Storage**
   ```typescript
   // Replace Map with database repository
   constructor(private userRepository: UserRepository) {}
   ```

2. **Validation**
   ```typescript
   // Add email validation
   if (!this.isValidEmail(email)) {
       throw new Error('Invalid email format');
   }
   ```

3. **Error Handling**
   ```typescript
   // Add proper error handling
   try {
       await this.createUser(name, email);
   } catch (error) {
       logger.error('Failed to create user', error);
   }
   ```

4. **Pagination**
   ```typescript
   async listUsers(page: number, limit: number): Promise<User[]>
   ```

## 🧪 Testing

### Unit Test Example

```typescript
import { UserService } from './user.service';

describe('UserService', () => {
    let service: UserService;

    beforeEach(() => {
        service = new UserService();
    });

    it('should create a user', async () => {
        const user = await service.createUser('Test User', 'test@example.com');

        expect(user.id).toBeDefined();
        expect(user.name).toBe('Test User');
        expect(user.email).toBe('test@example.com');
    });

    it('should retrieve created user', async () => {
        const created = await service.createUser('Test', 'test@example.com');
        const retrieved = await service.getUserById(created.id);

        expect(retrieved).toEqual(created);
    });
});
```

## 🔒 Security Considerations

- **Email Validation**: Currently no validation - should validate email format
- **Input Sanitization**: No sanitization implemented - add before production
- **Authorization**: No permission checks - implement role-based access control
- **Rate Limiting**: Consider adding to prevent abuse

## 📅 Changelog

- **2026-02-11**: Initial implementation with in-memory storage
- **Future**: Plan to migrate to database-backed repository pattern

## 🎯 Related Files

- `user.controller.ts` - HTTP endpoints for user operations
- `user.repository.ts` - (Future) Database access layer
- `user.model.ts` - Type definitions and validations
