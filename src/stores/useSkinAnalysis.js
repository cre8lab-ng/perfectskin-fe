import { create } from "zustand";
import { persist } from "zustand/middleware";
import Cookies from "js-cookie";
import api from "@/util/api";
import { uploadImage } from "@/services/skinAnalysis"; 

const initialState = {
  uploadLoading: false,
  uploadError: null,
  uploadedFileId: null,
  uploadUrl: null,
  uploadHeaders: null,
  uploadMethod: null,
};

const useSkinAnalysis = create(
  persist(
    (set, get) => ({
      ...initialState,

      setUploadedFileInfo: ({ file_id, url, headers, method }) =>
        set((state) => ({
          ...state,
          uploadedFileId: file_id,
          uploadUrl: url,
          uploadHeaders: headers,
          uploadMethod: method,
        })),

      uploadSkinImage: async (file: File) => {
        try {
          set((state) => ({ ...state, uploadLoading: true, uploadError: null }));

          const accessToken = Cookies.get("accessToken") || get().accessToken;

          const payload = {
            files: [
              {
                content_type: file.type,
                file_name: file.name,
                file_size: file.size,
              },
            ],
          };

          const response = await api.post("/s2s/v1.1/file/skin-analysis", payload, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
          });

          const result = response?.data?.result?.files?.[0];

          if (result) {
            set((state) => ({
              ...state,
              uploadedFileId: result.file_id,
              uploadUrl: result.requests?.[0]?.url,
              uploadHeaders: result.requests?.[0]?.headers,
              uploadMethod: result.requests?.[0]?.method,
              uploadLoading: false,
            }));
          }

          return result;
        } catch (error: any) {
          set((state) => ({ ...state, uploadLoading: false, uploadError: error?.message || "Upload failed" }));
          throw error;
        }
      },

      resetUploadState: () => {
        set(() => initialState);
      },
    }),
    {
      name: "skin-analysis",
      whitelist: ["uploadedFileId"],
    }
  )
);

export default useSkinAnalysis;
