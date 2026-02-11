"use strict";
/**
 * User Service
 * Handles user-related business logic
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
class UserService {
    constructor() {
        this.users = new Map();
    }
    /**
     * Creates a new user
     */
    async createUser(name, email) {
        const user = {
            id: this.generateId(),
            name,
            email,
            createdAt: new Date()
        };
        this.users.set(user.id, user);
        return user;
    }
    /**
     * Retrieves user by ID
     */
    async getUserById(id) {
        return this.users.get(id);
    }
    /**
     * Updates user information
     */
    async updateUser(id, updates) {
        const user = this.users.get(id);
        if (!user) {
            return null;
        }
        const updatedUser = { ...user, ...updates };
        this.users.set(id, updatedUser);
        return updatedUser;
    }
    /**
     * Deletes a user
     */
    async deleteUser(id) {
        return this.users.delete(id);
    }
    /**
     * Lists all users
     */
    async listUsers() {
        return Array.from(this.users.values());
    }
    generateId() {
        return Math.random().toString(36).substring(2, 15);
    }
}
exports.UserService = UserService;
//# sourceMappingURL=user.service.js.map