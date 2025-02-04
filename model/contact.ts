export interface SupportPayload {
  firstname: string;
  lastname: string;
  email: string;
  message: string;
}

export interface SupportResponse {
  data: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    message: string;
    createdAt: string;
  };
  success: boolean;
}
