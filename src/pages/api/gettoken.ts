// pages/api/get-access-token.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import { generateIdToken } from '@/utils/generateIdToken'; // adjust path if needed

const clientId = process.env.YOUCAM_API_KEY!;
const clientSecret = process.env.YOUCAM_PUBLIC_KEY!;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const id_token = generateIdToken(clientId, clientSecret);

    const response = await axios.post('https://<youcam-api-base>/s2s/v1.0/client/auth', {
      client_id: clientId,
      id_token,
    });

    const accessToken = response.data?.result?.access_token;

    res.status(200).json({ accessToken });
  } catch (error: any) {
    console.error('Token error:', error?.response?.data || error.message);
    res.status(500).json({ error: 'Failed to generate access token' });
  }
}
