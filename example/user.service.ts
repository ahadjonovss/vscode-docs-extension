/**
 * User Service
 * Handles user-related business logic
 */

export interface User {
    id: string;
    name: string;
    email: string;
    createdAt: Date;
}

export class UserService {
    private users: Map<string, User> = new Map();

    /**
     * Creates a new user
     */
    async createUser(name: string, email: string): Promise<User> {
        const user: User = {
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
    async getUserById(id: string): Promise<User | undefined> {
        return this.users.get(id);
    }

    /**
     * Updates user information
     */
    async updateUser(id: string, updates: Partial<User>): Promise<User | null> {
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
    async deleteUser(id: string): Promise<boolean> {
        return this.users.delete(id);
    }

    /**
     * Lists all users
     */
    async listUsers(): Promise<User[]> {
        return Array.from(this.users.values());
    }

    private generateId(): string {
        return Math.random().toString(36).substring(2, 15);
    }
}
