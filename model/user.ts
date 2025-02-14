export interface UserData {
  name: string;
  image: any;
  isVerified: boolean;
  phone: string;
  email: string;
}

export enum USER_TYPES {
  AGENT = "agent",
  USER = "user",
  CORP_MEMBER = "corpMember",
  LANDLORD = "landlord",
}

export interface UserResponseData {
  createdAt: string;
  email: string;
  fullName: string;
  id: string;
  address?: string;
  userType?: USER_TYPES;
  userId?: string;
  isVerified: boolean;
  phoneNumber: string;
  isEmailVerified: boolean;
  isNumberVerified: boolean;
  profilePicture: string;
  tempToken: null;
  updatedAt: string;
}

export const UserTypes = {
  AGENT: "agent",
  USER: "user",
  CORP_MEMBER: "corpMember",
  LANDLORD: "landlord",
};
