export interface KYCPayload {
  passportPhoto: string[];
  idType: string;
  idFrontImage: string;
  idBackImage: string;
  nyscNumber: string;
  nin: string;
}

export interface KYCResponse {
  id: number;
  userId: string;
  passportPhoto: string[];
  idType: string;
  idFrontImage: string;
  idBackImage: string;
  nyscNumber: string;
  nin: string;
  createdAt: string;
  updatedAt: string;
}
