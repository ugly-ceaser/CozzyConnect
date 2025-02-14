import { APIEndpoint } from ".";
import { log, responseData } from "@/utils/helpers";
import { KYCPayload, KYCResponse } from "@/model/kyc";


export const handleCreateKYC = async (payload: KYCPayload, token: string) => {
  try {
    const request = await fetch(APIEndpoint.kycCreate.url, {
      method: APIEndpoint.kycCreate.method,
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
    });
    const response = await request.json();
    log("RESPONSE [KYC CREATE]:", response)
    if ("statusCode" in response && response?.statusCode > 300) throw new Error(response.message);
    return responseData("Kyc created", response);
  } catch (error: any) {
    if(String(error.message).includes('Unauthorized')) return responseData(error.message, null, false, true);
    return responseData(error.message, null, false);
  }
}

export const handleUpdateKYC = async (payload: KYCPayload, token: string) => {
  try {
    const request = await fetch(APIEndpoint.kycUpdate.url, {
      method: APIEndpoint.kycUpdate.method,
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
    });
    const response = await request.json();
    log("RESPONSE [KYC UPDATE]:", response)
    if ("statusCode" in response && response?.statusCode > 300) throw new Error(response.message);
    return responseData("Kyc updated", response);
  } catch (error: any) {
    if(String(error.message).includes('Unauthorized')) return responseData(error.message, null, false, true);
    return responseData(error.message, null, false);
  }
}


export const handleFetchKYC = async (token: string) => {
  try {
    const request = await fetch(APIEndpoint.getKyc.url, {
      method: APIEndpoint.getKyc.method,
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
    });
    const response = await request.json();
    log("KYC RESPONSE:", response)
    if ("statusCode" in response && response?.statusCode > 300) throw new Error(response.message);
    return responseData<KYCResponse>("KYC", response.data);
  } catch (error: any) {
    if(String(error.message).includes('Unauthorized')) return responseData(error.message, null, false, true);
    return responseData(error.message, null, false);
  }
}