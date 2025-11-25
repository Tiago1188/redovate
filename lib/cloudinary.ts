import crypto from "crypto";

interface CloudinaryConfig {
  cloudName: string;
  apiKey: string;
  apiSecret: string;
}

let cachedConfig: CloudinaryConfig | null = null;

function parseCloudinaryConfig(): CloudinaryConfig {
  if (cachedConfig) {
    return cachedConfig;
  }

  const url = process.env.CLOUDINARY_URL;
  if (!url) {
    throw new Error("CLOUDINARY_URL is not configured");
  }

  const match = url.match(/^cloudinary:\/\/([^:]+):([^@]+)@(.+)$/);
  if (!match) {
    throw new Error("Invalid CLOUDINARY_URL format");
  }

  const [, apiKey, apiSecret, cloudName] = match;

  cachedConfig = {
    cloudName,
    apiKey,
    apiSecret,
  };

  return cachedConfig;
}

function createSignature(params: Record<string, string>, apiSecret: string) {
  const sorted = Object.keys(params)
    .sort()
    .map((key) => `${key}=${params[key]}`)
    .join("&");

  return crypto.createHash("sha1").update(sorted + apiSecret).digest("hex");
}

export interface UploadImageOptions {
  fileBuffer: Buffer;
  fileName: string;
  mimeType: string;
  folder?: string;
}

export interface CloudinaryUploadResult {
  url: string;
  secureUrl: string;
  publicId: string;
  width?: number;
  height?: number;
}

export async function uploadImageToCloudinary({
  fileBuffer,
  fileName,
  mimeType,
  folder = "redovate/hero",
}: UploadImageOptions): Promise<CloudinaryUploadResult> {
  const { apiKey, apiSecret, cloudName } = parseCloudinaryConfig();
  const timestamp = Math.floor(Date.now() / 1000);
  const sanitizedPublicId = fileName.replace(/\s+/g, "_").toLowerCase();

  const params: Record<string, string> = {
    timestamp: timestamp.toString(),
    public_id: sanitizedPublicId,
  };

  if (folder) {
    params.folder = folder;
  }

  const signature = createSignature(params, apiSecret);

  const formData = new FormData();
  formData.append("file", `data:${mimeType};base64,${fileBuffer.toString("base64")}`);
  formData.append("api_key", apiKey);
  formData.append("timestamp", params.timestamp);
  formData.append("signature", signature);
  if (folder) {
    formData.append("folder", folder);
  }
  formData.append("public_id", sanitizedPublicId);

  const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
  const response = await fetch(uploadUrl, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Cloudinary upload failed: ${errorBody}`);
  }

  const data = (await response.json()) as {
    secure_url: string;
    url: string;
    public_id: string;
    width?: number;
    height?: number;
  };

  return {
    url: data.url,
    secureUrl: data.secure_url,
    publicId: data.public_id,
    width: data.width,
    height: data.height,
  };
}

