import type { User, History } from './definitions';

export const users: User[] = [
  {
    id: 1,
    username: 'admin',
    email: 'admin@institute.com',
    password_plaintext: 'password',
    role: 'admin',
    status: 'approved',
    instituteId: 'INST-001',
  },
  {
    id: 2,
    username: 'member',
    email: 'guard1@institute.com',
    password_plaintext: 'password',
    role: 'member',
    status: 'approved',
    instituteId: 'INST-001',
  },
  {
    id: 3,
    username: 'janedoe',
    email: 'jane.doe@example.com',
    password_plaintext: 'password123',
    role: 'member',
    status: 'pending',
    instituteId: 'INST-001',
  },
  {
    id: 4,
    username: 'newguard',
    email: 'new.guard@example.com',
    password_plaintext: 'password123',
    role: 'member',
    status: 'pending',
    instituteId: 'INST-001',
  }
];
