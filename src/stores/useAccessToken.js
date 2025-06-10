// stores/useAccessToken.js
import { create } from "zustand";
import { getAccessToken } from "@/services/auth";

const useAccessToken = create((set) => {
  // Save the token globally once generated
  const autoGenerateToken = async () => {
    set({ isLoading: true, error: null });
    try {
      const token = await getAccessToken();
      set({ accessToken: token, isLoading: false });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to generate token";
      console.error("Auto token error:", error);
      set({ error: errorMessage, isLoading: false });
    }
  };

  // Immediately call to generate token on store creation
  autoGenerateToken();

  return {
    accessToken: null,
    isLoading: true,
    error: null,

    setAccessToken: (token) => set({ accessToken: token, error: null }),

    generateToken: async () => {
      set({ isLoading: true, error: null });
      try {
        const token = await getAccessToken();
        set({ accessToken: token, isLoading: false });
        return token;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Failed to generate token";
        console.error("Manual token error:", error);
        set({ error: errorMessage, isLoading: false });
        return null;
      }
    },

    clearToken: () => set({ accessToken: null, error: null }),

    clearError: () => set({ error: null }),
  };
});

export default useAccessToken;
