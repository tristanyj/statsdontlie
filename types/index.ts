export * from './api';

export type User = {
  id: number;
  username: string;
};

export type UserRegister = {
  email: string;
  username: string;
  password: string;
};

export type UserLogin = {
  username: string;
  password: string;
};

export type SessionPlayer = {
  id: number;
};
