export * from './navigation';

export interface User {
  id: string;
  username: string;
  avatar?: string;
  email: string;
}

export interface Post {
  id: string;
  userId: string;
  imageUrl: string;
  caption: string;
  createdAt: Date;
  likes: number;
} 