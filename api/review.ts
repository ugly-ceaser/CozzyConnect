import { SupportResponse } from "@/model/contact";
import { APIEndpoint } from ".";
import { log, responseData } from "@/utils/helpers";
import { ReviewData } from "@/model/review";

export const handleCreateReview = async (payload: ReviewData, token: string) => {
  try { 
    const request = await fetch(APIEndpoint.createReview.url, {
      method: APIEndpoint.createReview.method,
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
    });
    const response = await request.json();
    log("CREATE REVIEW:", response)
    if ("statusCode" in response && response?.statusCode > 300) throw new Error(response.message);
    return responseData<SupportResponse>("Review sent", response.data);
  } catch (error: any) {

    if(String(error.message).includes('Unauthorized')) return responseData(error.message, null, false, true);
    return responseData(error.message, null, false);
  }
}

export const handleUpdateReview = async (id: number, payload: ReviewData, token: string) => {
  try { 
    const endpoint = APIEndpoint.updateReview(id)
    const request = await fetch(endpoint.url, {
      method: endpoint.method,
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
    });
    const response = await request.json();
    log("UPDATE REVIEW:", response)
    if ("statusCode" in response && response?.statusCode > 300) throw new Error(response.message);
    return responseData<SupportResponse>("Review updated", response.data);
  } catch (error: any) {

    if(String(error.message).includes('Unauthorized')) return responseData(error.message, null, false, true);
    return responseData(error.message, null, false);
  }
}