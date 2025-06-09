import Axios from "axios";
import useNetworkLoaderStore from "@/stores/useNetworkLoaderStore";
import { CustomHttpError } from "./errors/CustomHttpError";
import env from "@/config/env";


const { baseUrl } = env;

const api = Axios.create({
  baseURL: baseUrl,
  withCredentials: false,
  headers: {
    Accept: "application/json",
  },
});
api.interceptors.request.use(
  function (config) {
    showLoadingBar();

    return config;
  },
  function (error) {
    hideLoadingBar();
    // Do something with request error
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  function (response) {
    hideLoadingBar();
    if (response.data?.status === "error") {
      if (
        response.data?.errors &&
        Object.values(response.data?.errors).length
      ) {
        const errors = Object.values(response.data?.errors);
        return Promise.reject(
          new CustomHttpError(errors[0], {
            statusCode: 400,
            responseText: errors[0],
            payload: response.data?.errors,
          })
        );
      }

      return Promise.reject(
        new CustomHttpError(response.data?.message, {
          statusCode: 400,
          responseText: response.data?.message,
        })
      );
    }
    return response.data;
  },
  function (err) {
    hideLoadingBar();
    if (!err.response) {
      return Promise.reject(
        new CustomHttpError(
          "Error occured while sending the request, please check your internet settings",
          {
            statusCode: 0,
            responseText:
              "Error occured while sending the request, please check your internet settings",
          }
        )
      );
    }

    if (err.response.data && err.response.data.message) {
      return Promise.reject(
        new CustomHttpError(err.response.data.message, {
          statusCode: err.response.status,
          responseText: err.response.data.message,
          payload: err.response.data.payload,
          responseCode: err.response.data.responseCode,
        })
      );
    }
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(
      new CustomHttpError("Error occured while sending the request", {
        statusCode: err.response.status,
        responseText: "Error occured while sending the request",
      })
    );
  }
);

function showLoadingBar() {
  useNetworkLoaderStore.getState().increaseLoadingCount();
}

function hideLoadingBar() {
  useNetworkLoaderStore.getState().decreaseLoadingCount();
}

export default api;
