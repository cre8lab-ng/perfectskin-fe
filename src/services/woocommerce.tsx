import env from "@/config/env";
import api from "@/util/api";
import { apiEndpoints } from "@/util/endpoints";
import crypto from "crypto";


// Get all WooCommerce product tags
export async function getAllTags(consumerKey: string, consumerSecret: string) {
    try {
      const response = await api.get(
        'https://beautyhub.ng/wp-json/wc/v3/products/tags',
        {
          auth: {
            username: consumerKey,
            password: consumerSecret
          }
        }
      );
      return response.data; // array of tag objects
    } catch (error) {
      console.error("Failed to fetch tags:", error);
      throw error;
    }
  }