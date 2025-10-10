export type UserWithPassword = {
  id: number;
  email: string;
  password: string | null;
  firstName: string;
  lastName: string;
  role: string;
  createdAt: Date;
};

export type SafeUser = Omit<UserWithPassword, 'password'>;

export type UserRole = 'user' | 'admin' | 'moderator';
