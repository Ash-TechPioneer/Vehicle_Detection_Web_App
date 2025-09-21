import type { User, Vehicle, History } from './definitions';

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

export const vehicles: Vehicle[] = [
  {
    plate_text: 'ABC-123',
    owner_name: 'John Doe',
    phone: '555-1234',
    vehicle_model: 'Toyota Camry',
    institute_id: 'INST-001',
  },
  {
    plate_text: 'XYZ-789',
    owner_name: 'Jane Smith',
    phone: '555-5678',
    vehicle_model: 'Honda Civic',
    institute_id: 'INST-001',
  },
  {
    plate_text: 'LUV-CODE',
    owner_name: 'Dev Person',
    phone: '555-1337',
    vehicle_model: 'Subaru WRX',
    institute_id: 'INST-001',
  },
];

export let history: History[] = [
  {
    history_id: 1,
    user_id: 2,
    plate_text: 'ABC-123',
    verified_at: new Date('2023-10-26T10:00:00Z'),
    status: 'Registered',
  },
  {
    history_id: 2,
    user_id: 2,
    plate_text: 'TEST-404',
    verified_at: new Date('2023-10-26T10:05:00Z'),
    status: 'Unregistered',
  },
  {
    history_id: 3,
    user_id: 2,
    plate_text: 'XYZ-789',
    verified_at: new Date('2023-10-26T11:20:00Z'),
    status: 'Registered',
  },
];
