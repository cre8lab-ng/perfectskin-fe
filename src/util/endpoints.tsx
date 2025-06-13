export const apiEndpoints = {
  auth: {
    GET_TOKEN: '/s2s/v1.0/client/auth',
  },
  skinAnalysis: {
    UPLOAD_IMAGE: "/s2s/v1.0/file/skin-analysis",
    RUN_SKIN_ANALYSIS: "/s2s/v1.1/task/skin-analysis",
    CHECK_STATUS: '/s2s/v1.0/task/skin-analysis',
  },
};
