import { SupportPayload, SupportResponse } from "@/model/contact";
import { APIEndpoint } from ".";
import { log, responseData } from "@/utils/helpers";

export const handleCreateContact = async (payload: SupportPayload ) => {
  try { 
    const request = await fetch(APIEndpoint.createContact.url, {
      method: APIEndpoint.createContact.method,
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const response = await request.json();
    log("CONTACT:", response)
    if ("statusCode" in response && response?.statusCode > 300) throw new Error(response.message);
    return responseData<SupportResponse>("Form submitted", response.data);
  } catch (error: any) {

    if(String(error.message).includes('Unauthorized')) return responseData(error.message, null, false, true);
    return responseData(error.message, null, false);
  }
}