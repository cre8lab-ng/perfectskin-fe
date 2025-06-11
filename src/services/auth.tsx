import env from "@/config/env";
import api from "@/util/api";
import { apiEndpoints } from "@/util/endpoints";
import crypto from "crypto";

const { perfectSkinApiKey, perfectSkinSecretKey } = env;

// Create id_token by encrypting with RSA public key
function createIdToken(clientId: string, clientSecret: string): string {
  const timestamp = Date.now(); // in milliseconds
  const plainText = `client_id=${clientId}&timestamp=${timestamp}`;

  const publicKey = `-----BEGIN PUBLIC KEY-----\n${clientSecret}\n-----END PUBLIC KEY-----`;

  const encrypted = crypto.publicEncrypt(
    {
      key: publicKey,
      padding: crypto.constants.RSA_PKCS1_PADDING,
    },
    Buffer.from(plainText)
  );

  return encrypted.toString("base64");
}

export async function getAccessToken() {
  try {
    const payload = {
      client_id: perfectSkinApiKey,
      // @ts-ignore
      id_token: createIdToken(perfectSkinApiKey, perfectSkinSecretKey),
    };
    const response = await api.post(apiEndpoints.auth.GET_TOKEN, payload, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    // @ts-ignore
    return response?.result?.access_token;
  } catch (error: unknown) {
    console.error('Token generation failed:', error);
    throw error;
  }
}
