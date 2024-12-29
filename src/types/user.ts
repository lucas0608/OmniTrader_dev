export type UserClass = 'Admin' | 'Live' | 'Demo';

export interface User {
  username: string;
  password: string;
  host: string;
  port: string;
  class: UserClass;
  keyType: 'hmac' | 'ed25519';
  apiKey: string;
  secretKey: string;
}

export interface UserFormData {
  username: string;
  password: string; // Add password field
  host: string;
  port: string;
  class: UserClass;
}