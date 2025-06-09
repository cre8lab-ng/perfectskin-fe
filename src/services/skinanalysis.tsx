import api from "@/util/api";
import { apiEndpoints } from "@/util/endpoints";



export async function uploadImage(file: File, accessToken: string) {
    const payload = {
      files: [
        {
          content_type: file.type,
          file_name: file.name,
          file_size: file.size,
        },
      ],
    };
  
    try {
      const response = await api.post(
        apiEndpoints.skinAnalysis.UPLOAD_IMAGE,
        payload,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Upload image error:', error);
      throw error;
    }
  }
  
