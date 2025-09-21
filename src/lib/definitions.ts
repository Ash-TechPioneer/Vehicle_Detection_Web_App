export type User = {
  id: number;
  username: string;
  email: string;
  password_plaintext: string;
  role: 'admin' | 'member';
  status: 'approved' | 'pending';
  instituteId: string;
};

export type Vehicle = {
  plate_text: string;
  owner_name: string;
  phone: string;
  vehicle_model: string;
  institute_id: string;
};

export type History = {
  history_id: number;
  user_id: number;
  plate_text: string;
  verified_at: Date;
  status: 'Registered' | 'Unregistered';
};

export type NewHistory = Omit<History, 'history_id' | 'user_id' | 'verified_at'>;

export type VehicleData = {
  plate_text: string;
  owner_name: string;
  phone: string;
  vehicle_model: string;
  institute_id: string;
};
