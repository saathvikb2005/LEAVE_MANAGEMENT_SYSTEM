export interface User {
  userId?: number;
  username: string;
  password?: string;
  role: string;
  name: string;
  email: string;
  phone?: string;
  department?: string;
  manager?: { userId: number } | null;  
}
