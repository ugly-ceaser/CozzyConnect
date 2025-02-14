import { UserResponseData } from "@/model/user";
import { APIEndpoint } from ".";
import { log, responseData } from "@/utils/helpers";
import { NotitificationResponseData } from "@/model/notification";

export const handleGetUser = async (token: string) => {
  try {
    const request = await fetch(APIEndpoint.profile.url, {
      method: APIEndpoint.profile.method,
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
    });
    const response = await request.json();
    if ("statusCode" in response && response?.statusCode > 300) throw new Error(response.message);
    return responseData<UserResponseData>("Fetched profile data", response.data);
  } catch (error: any) {
    if(String(error.message).includes('Unauthorized')) return responseData(error.message, null, false, true);
    return responseData(error.message, null, false);
  }
}

export const handleUpdateUserProfile = async (payload: Partial<UserResponseData>, token: string) => {
  try {
    const request = await fetch(APIEndpoint.profileUpdate.url, {
      method: APIEndpoint.profileUpdate.method,
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
    });
    log("PAYLOAD:", payload)
    const response = await request.json();
    log("UPDATE PROFILE RESULT:", response)
    if ("statusCode" in response && response?.statusCode > 300) throw new Error(response.message);
    return responseData<UserResponseData>("Fetched profile data", response.data);
  } catch (error: any) {
    if(String(error.message).includes('Unauthorized')) return responseData(error.message, null, false, true);
    return responseData(error.message, null, false);
  }
}

export const handleCreateUserProfile = async (payload: Partial<UserResponseData>, token: string) => {
  try {
    const request = await fetch(APIEndpoint.createUpdate.url, {
      method: APIEndpoint.createUpdate.method,
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
    });
    log("PAYLOAD:", payload)
    const response = await request.json();
    log("CREATE PROFILE RESULT:", response)
    if ("statusCode" in response && response?.statusCode > 300) throw new Error(response.message);
    return responseData<UserResponseData>("Created profile data", response.data);
  } catch (error: any) {
    if(String(error.message).includes('Unauthorized')) return responseData(error.message, null, false, true);
    return responseData(error.message, null, false);
  }
}

export const handleGetNotifications = async (token: string, payload?: { page: number, perPage: number }) => {
  if(!token) return;
  try { 
    const endpoint = APIEndpoint.getNotifications(payload?.page, payload?.perPage);
    const request = await fetch(endpoint.url, {
      method: endpoint.method,
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
    });
    const response = await request.json();
    log("GET NOTIFICATION:", response)
    if ("statusCode" in response && response?.statusCode > 300) throw new Error(response.message);
    return responseData<NotitificationResponseData>("Notitifications", response.data);
  } catch (error: any) {
    console
    if(String(error.message).includes('Unauthorized')) return responseData(error.message, null, false, true);
    return responseData(error.message, null, false);
  }
}
