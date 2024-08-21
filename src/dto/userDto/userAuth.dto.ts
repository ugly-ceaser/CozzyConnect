// src/dto/userDto.ts

export class userRegDto {
    email: string;
    password: string;
    // Add other fields as needed
  }
  
  export class userLogDto {
    EmailOrPhoneNumber: string;
    password: string;
  }

  
  export class passDto {
    password: string;
    confirm_password: string;
  }
  
  export class ForgotPasswordDto {
    email: string;
  }
  

  export class ResetPasswordDto {
    token: string;
    newPassword: string;
  }

  export class EditAuthtDto {
    email?: string; // Use TypeScript's optional chaining
    phoneNumber?: string;
   
}