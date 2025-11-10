import { User } from './types';

const users = new Map<string, User>();

export const db = {
  getAll: async (): Promise<User[]> => Array.from(users.values()),
  getById: async (id: string): Promise<User | undefined> => users.get(id),
  create: async (user: User): Promise<User> => {
    users.set(user.id, user);
    return user;
  },
  update: async (
    id: string,
    partial: Partial<User>
  ): Promise<User | undefined> => {
    const existing = users.get(id);
    if (!existing) return undefined;
    const updated: User = { ...existing, ...partial, id };
    users.set(id, updated);
    return updated;
  },
  delete: async (id: string): Promise<boolean> => users.delete(id),
};
