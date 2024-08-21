// admin.dto.ts
export class AdminLoginDto {
    email: string;
    password: string;
  }
  
  export class AdminRegisterDto {
    email: string;
    password: string;
    roles?: string[]; 
  }
  