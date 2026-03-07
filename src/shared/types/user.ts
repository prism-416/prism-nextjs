/**
 * User type definition
 * 공통으로 사용되는 사용자 타입
 */
export type User = {
  id: string;
  email: string;
  name: string;
  phone?: string;
  createdAt?: string;
  updatedAt?: string;
  access_token?: string;
  refresh_token?: string;
};

export type UserProfile = Pick<User, "id" | "email" | "name" | "phone">;
