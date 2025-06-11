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
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${accessToken}`);

    const raw = JSON.stringify(payload);

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    const response = await fetch(
      "https://yce-api-01.perfectcorp.com/s2s/v1.1/file/skin-analysis",
      // @ts-ignore
      requestOptions
    );

    const result = await response.json(); 

    return result.result.files[0];

  } catch (error) {
    console.error("Upload image error:", error);
    throw error;
  }
}


export interface SkinAnalysisAction {
  id: number;
  params: object;
  dst_actions: string[];
}

export interface SkinAnalysisPayload {
  request_id: number;
  payload: {
    file_sets: {
      src_ids: string[];
    };
    actions: SkinAnalysisAction[];
  };
}

export interface SkinAnalysisResponse {
  status: number;
  result: {
    task_id: string;
  };
}

// Call the skin analysis API
export async function runSkinAnalysis(payload: SkinAnalysisPayload, accessToken: string): Promise<SkinAnalysisResponse> {
  try {
    const response = await api.post(
      "https://yce-api-01.perfectcorp.com/s2s/v1.0/task/skin-analysis",
      payload,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        }
      }
    );
    // @ts-ignore
    return response;
  } catch (error) {
    throw error;
  }
}

// Example usage function
export async function analyzeSkinFeatures(fileId: string, accessToken: string, features: string[] = ["hd_wrinkle", "hd_pore", "hd_texture", "hd_acne"]) {
  const payload: SkinAnalysisPayload = {
    request_id: 0,
    payload: {
      file_sets: {
        src_ids: [fileId]
      },
      actions: [
        {
          id: 0,
          params: {},
          dst_actions: features
        }
      ]
    }
  };

  try {
    const result = await runSkinAnalysis(payload, accessToken);
    console.log(result,"res")
    return result;
  } catch (error) {
    console.error('Skin analysis failed:', error);
    throw error;
  }
}

// Check skin analysis status (corrected version)
export async function checkSkinAnalysisStatus(taskId: string, accessToken: string) {
  try {
    const response = await api.get(
      `${apiEndpoints.skinAnalysis.CHECK_STATUS}?task_id=${taskId}`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
}


