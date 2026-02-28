export interface IUserProfile {
  id: string;
  displayName: string;
  role: 'INVESTITOR' | 'IZVODJAC';
  email: string;
  bio: string;
  location: string;
  joinedAt: Date;
  skills?: string[];
}
