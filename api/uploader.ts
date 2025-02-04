
import axios from 'axios';
import { log } from '@/utils/helpers';
import { BLACKBLAZE_APPLICATION_KEY, BLACKBLAZE_KEY_ID } from '@/constants/Variables';


const BUCKET_ID = BLACKBLAZE_KEY_ID
const AUTHORIZATION_TOKEN = BLACKBLAZE_APPLICATION_KEY

// Type for the response from Backblaze upload URL request
export type BackblazeUploadResponse = {
  authorizationToken: string;
  uploadUrl: string;
};

// Type for the response from file upload request
export type FileUploadResponse = {
  fileId: string;
  fileName: string;
  uploadTimestamp: number;
};

export type FileType = {
  uri: string;
  name: string;
  mimeType: string;
}

// Function to get the upload URL and token from Backblaze B2
const getBackblazeUploadUrl = async (bucketId: string, authorizationToken: string): Promise<BackblazeUploadResponse> => {
  const response = await axios.post(
    'https://api.backblazeb2.com/b2api/v2/b2_get_upload_url',
    { bucketId },
    {
      headers: {
        Authorization: authorizationToken,
      },
    }
  );
  return response.data;
};

// Function to upload the file to Backblaze B2
const uploadFileToBackblaze = async (payload: FileType, uploadUrl: string,authorizationToken: string): Promise<FileUploadResponse> => {
  const file = await fetch(payload.uri);
  const blob = await file.blob();

  const response = await axios.post(
    uploadUrl,
    blob,
    {
      headers: {
        Authorization: authorizationToken,
        'Content-Type': payload.mimeType,
        'X-Bz-File-Name': encodeURIComponent(payload.name),
        'X-Bz-Content-Sha1': 'do_not_verify',
      },
    }
  );
  return response.data;
};

export const handleUploadFile = async (file: FileType) => {
  try {
    const { uploadUrl, authorizationToken: uploadAuthToken } = await getBackblazeUploadUrl(BUCKET_ID, AUTHORIZATION_TOKEN);
    const uploadResponse = await uploadFileToBackblaze(file, uploadUrl, uploadAuthToken);
    return uploadResponse
  }
  catch (error: any) {
    log("[ERROR] UPLOAD:", error)
    return null
  }
}
