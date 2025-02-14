import { log, responseData } from "@/utils/helpers";
import { APIEndpoint } from ".";
import { PropertyType, PropertyTypeData, SearchParams } from "@/model/property";
import { ReviewResponseData } from "@/model/review";

export const handleGetProperties = async ({ page = 1, token }: { page: number, token: string }) => {
  if(!token) return
  const LIMIT = 12
  const url = APIEndpoint.getProperties.url.replace(':page', (page + '')).replace(':limit', ('' + LIMIT))
  try { 
    const option: RequestInit = {
      method: APIEndpoint.getProperties.method,
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
    }
    log("REQUEST OPTION:", option)
    const request = await fetch(url, option);
    const response = await request.json();
    log("FETCH RESULT:", response)
    if ("statusCode" in response && response?.statusCode > 300) throw new Error(response.message);
    return responseData<PropertyTypeData>("Fetched properties data", response.data);
  } catch (error: any) {
    console
    if(String(error.message).includes('Unauthorized')) return responseData(error.message, null, false, true);
    return responseData(error.message, null, false);
  }
}

export const handleUploadProperty = async (payload: Partial<PropertyType>, token: string) => {
  if(!token) return 
  try { 
    const request = await fetch(APIEndpoint.createProperty.url, {
      method: APIEndpoint.createProperty.method,
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
    });
    const response = await request.json();
    log("CREATE PROPERTY:", response)
    if ("statusCode" in response && response?.statusCode > 300) throw new Error(response.message);
    return responseData<PropertyTypeData>("Property created!", response);
  } catch (error: any) {
    console
    if(String(error.message).includes('Unauthorized')) return responseData(error.message, null, false, true);
    return responseData(error.message, null, false);
  }
}

export const handleGetProperty = async (id: string, token: string) => {
  if(!token) return 
  try { 
    const request = await fetch(APIEndpoint.getProperty.url.replace(":id", id), {
      method: APIEndpoint.getProperty.method,
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
    });
    const response = await request.json();
    log("GET PROPERTY:", response)
    if ("statusCode" in response && response?.statusCode > 300) throw new Error(response.message);
    return responseData<PropertyTypeData>("Property details!", response.data);
  } catch (error: any) {

    if(String(error.message).includes('Unauthorized')) return responseData(error.message, null, false, true);
    return responseData(error.message, null, false);
  }
}

export const handleSearchProperty = async (payload: Partial<SearchParams>, token: string) => {
  if(!token) return 
  try { 
    const request = await fetch(APIEndpoint.searchProperty.url, {
      method: APIEndpoint.searchProperty.method,
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
    });
    const response = await request.json();
    log("SEARCH PROPERTY:", response)
    if ("statusCode" in response && response?.statusCode > 300) throw new Error(response.message);
    return responseData<PropertyTypeData>("Property details!", response.data);
  } catch (error: any) {

    if(String(error.message).includes('Unauthorized')) return responseData(error.message, null, false, true);
    return responseData(error.message, null, false);
  }
}

export const handleGetPropertyReview = async (id: number, token: string) => {
  if(!token) return;
  try { 
    const endpoint = APIEndpoint.getReviews(id);
    const request = await fetch(endpoint.url, {
      method: endpoint.method,
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
    });
    const response = await request.json();
    log("GET REVIEW:", response)
    if ("statusCode" in response && response?.statusCode > 300) throw new Error(response.message);
    return responseData<ReviewResponseData>("Review details!", response);
  } catch (error: any) {
    console
    if(String(error.message).includes('Unauthorized')) return responseData(error.message, null, false, true);
    return responseData(error.message, null, false);
  }
}
