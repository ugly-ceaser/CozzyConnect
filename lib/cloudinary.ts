import { log } from "@/utils/helpers";
import axios from "axios";

export type FileType = {
  uri: string;
  name: string;
  mimeType: string;
};

export type UploadResponse = {
  asset_id: string;
  public_id: string;
  version: number;
  version_id: string;
  signature: string;
  resource_type: string;
  created_at: string;
  tags: any[];
  bytes: number;
  type: string;
  etag: string;
  placeholder: false;
  url: string;
  secure_url: string;
  folder: string;
  access_mode: string;
  existing: false;
  original_filename: string;
};

const CLOUD_NAME = "dw0mvf7os"
const UPLOAD_PRESET = "cozzyconnet"


log({ CLOUD_NAME, UPLOAD_PRESET });

const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/raw/upload`;

// Upload the file to Cloudinary
export const handleFileUpload = async ({ name, uri }: FileType) => {
  const formData = new FormData();
  formData.append("file", {
    uri: uri,
    type: "application/octet-stream",
    name: name,
  } as any);
  formData.append("upload_preset", UPLOAD_PRESET);

  try {
    const uploadResponse = await axios.post(cloudinaryUrl, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    if (uploadResponse?.status > 300) throw new Error("Error uploading file");
    return uploadResponse.data as UploadResponse;
  } catch (error: any) {
    log("[ERROR] - UPLOAD FILE:", error);
  }
};
