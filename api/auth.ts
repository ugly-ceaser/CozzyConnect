import { ChangePasswordPayload, LoginData, LoginResponse, RegisterData, RegisterResponse } from "@/model/auth";
import { APIEndpoint } from ".";
import { log, responseData } from "@/utils/helpers";
import { VerifyOTP } from "@/model/auth";

export const handleRegister = async (payload: RegisterData) => {
  try {
    const request = await fetch(APIEndpoint.register.url, {
      method: APIEndpoint.register.method,
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const response = await request.json();
    log("RESGISTER RESPONSE:", response)
    if ("statusCode" in response && response?.statusCode > 300) {
      if(Array.isArray(response.message)) throw new Error(response.message[0])
      throw new Error(response.message);
    }
    return responseData<RegisterResponse>("Registration successful", response);
  } catch (error: any) {
    if(String(error.message).includes('Unauthorized')) return responseData(error.message, null, false, true);
    return responseData(error.message, null, false);
  }
}

export const handleLogin = async (payload: LoginData) => {
  try {
    const request = await fetch(APIEndpoint.login.url, {
      method: APIEndpoint.login.method,
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const response = await request.json();
    log({response})
    if ("statusCode" in response && response?.statusCode > 300) {
      if(Array.isArray(response.message)) throw new Error(response.message[0])
      throw new Error(response.message);
    }
    return responseData<LoginResponse>("Login successful", response);
  } catch (error: any) {
    if(String(error.message).includes('Unauthorized')) return responseData(error.message, null, false, true);
    return responseData(error.message, null, false);
  }
}

export const handleSendEmailOtp = async (email: string) => {
  try {
    const request = await fetch(APIEndpoint.otp.url, {
      method: APIEndpoint.otp.method,
      body: JSON.stringify({ email, dataVerified: 'email' }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const response = await request.json();
    log("RESPONSE [EMAIL OTP]:", response)
    if ("statusCode" in response && response?.statusCode > 300) {
      if(Array.isArray(response.message)) throw new Error(response.message[0])
      throw new Error(response.message);
    }
    return responseData("Otp sent", response);
  } catch (error: any) {
    if(String(error.message).includes('Unauthorized')) return responseData(error.message, null, false, true);
    return responseData(error.message, null, false);
  }
}

export const handleSendPhoneOtp = async (phone: string) => {
  try {
    const request = await fetch(APIEndpoint.otp.url, {
      method: APIEndpoint.otp.method,
      body: JSON.stringify({ phone, dataVerified: 'phoneNumber' }),
      headers: {
        "Content-Type": "application/json",
      },
    }); 
    const response = await request.json();
    log("RESPONSE [PHONE OTP]:", response)
    if ("statusCode" in response && response?.statusCode > 300) {
      if(Array.isArray(response.message)) throw new Error(response.message[0])
      throw new Error(response.message);
    }
    return responseData("Otp sent", response);
  } catch (error: any) {
    if(String(error.message).includes('Unauthorized')) return responseData(error.message, null, false, true);
    return responseData(error.message, null, false);
  }
}

export const handleVerifyOtp = async (payload: VerifyOTP) => {
  try {
    const request = await fetch(APIEndpoint.otpVerify.url, {
      method: APIEndpoint.otpVerify.method,
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const response = await request.json();
    log("RESPONSE [VERIFY OTP]:", response)
    if ("statusCode" in response && response?.statusCode > 300) {
      if(Array.isArray(response.message)) throw new Error(response.message[0])
      throw new Error(response.message);
    }
    return responseData("Otp verified", response.data);
  } catch (error: any) {
    if(String(error.message).includes('Unauthorized')) return responseData(error.message, null, false, true);
    return responseData(error.message, null, false);
  }
}

export const handleChangePassword = async (payload: ChangePasswordPayload, id: string) => {
  try {
    const request = await fetch(APIEndpoint.changePassword.url.replace(":id", id), {
      method: APIEndpoint.changePassword.method,
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const response = await request.json();
    log("RESPONSE [CHANGE PASSWORD]:", response)
    if ("statusCode" in response && response?.statusCode > 300) {
      if(Array.isArray(response.message)) throw new Error(response.message[0])
      throw new Error(response.message);
    }
    return responseData("Password Changed!", response.data);
  } catch (error: any) {
    if(String(error.message).includes('Unauthorized')) return responseData(error.message, null, false, true);
    return responseData(error.message, null, false);
  }
}