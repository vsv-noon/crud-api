import { User } from './types';

const users = new Map<string, User>();

export const db = {
  getAll: async (): Promise<User[]> => Array.from(users.values()),
  getById: async (id: string): Promise<User | undefined> => users.get(id),
  create: async (user: User): Promise<User> => {
    users.set(user.id, user);
    return user;
  },
};
