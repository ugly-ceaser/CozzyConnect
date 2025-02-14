import { UserResponseData } from "./user";

export interface VerifyOTP {
  otp: string;
  email: string;
  dataVerified: "phoneNumber" | "email";
}

export interface ChangePasswordPayload {
  password: string;
  confirm_password: string;
}

export interface RegisterData {
  email: string;
  password: string;
}

export interface LoginData {
  EmailOrPhoneNumber: string;
  password: string;
}

export interface RegisterResponse {
  access_token: string;
  data: UserResponseData;
}

export interface LoginResponse extends RegisterResponse {
  data: UserResponseData;
}
