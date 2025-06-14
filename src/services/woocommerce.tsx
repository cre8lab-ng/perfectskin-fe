import api from "@/util/api";
import { AxiosResponse } from "axios";

// ----------- Interfaces -----------

interface WooTag {
  id: number;
  name: string;
  slug: string;
}

interface WooProduct {
  id: number;
  name: string;
  price_html: string;
  brands: { name: string }[];
  images: { src: string }[];
  permalink: string;
}

export interface MappedProduct {
  id: number;
  name: string;
  price_html: string;
  brand: string;
  image: string | null;
  link: string;
}

interface WooOrder {
  id: number;
  billing?: {
    email?: string;
    first_name?: string;
    last_name?: string;
  };
}

interface CreateOrderPayload {
  payment_method: string;
  payment_method_title: string;
  set_paid: boolean;
  status: string;
  billing: {
    email: string;
    first_name: string;
    last_name: string;
  };
  line_items: {
    name: string;
    quantity: number;
    total: string;
  }[];
}

// ----------- API Functions -----------

export async function getAllTags(
  searchTerm: string,
  consumerKey: string,
  consumerSecret: string
): Promise<WooTag[]> {
  try {
    const response: AxiosResponse<WooTag[]> = await api.get(
      "https://beautyhub.ng/wp-json/wc/v3/products/tags",
      {
        auth: {
          username: consumerKey,
          password: consumerSecret,
        },
        params: {
          search: searchTerm.toLowerCase(),
        },
      }
    );
    return response.data || [];
  } catch (error) {
    console.error("❌ Failed to fetch tags:", error);
    return [];
  }
}

export async function getProductsByTagId(
  tagId: number,
  consumerKey: string,
  consumerSecret: string
): Promise<MappedProduct[]> {
  try {
    const response: AxiosResponse<WooProduct[]> = await api.get(
      "https://beautyhub.ng/wp-json/wc/v3/products",
      {
        auth: {
          username: consumerKey,
          password: consumerSecret,
        },
        params: {
          tag: tagId,
          per_page: 20,
          status: "publish",
        },
      }
    );

    return (response.data || []).map((p) => ({
      id: p.id,
      name: p.name,
      price_html: p.price_html,
      brand: p.brands?.[0]?.name || "Unknown Brand",
      image: p.images?.[0]?.src || null,
      link: p.permalink,
    }));
  } catch (error) {
    console.error(`❌ Failed to fetch products for tag ID ${tagId}:`, error);
    return [];
  }
}

export async function getProductsByTagName(
  tagName: string,
  consumerKey: string,
  consumerSecret: string
): Promise<MappedProduct[]> {
  try {
    const tags = await getAllTags(tagName, consumerKey, consumerSecret);

    if (!Array.isArray(tags) || tags.length === 0) {
      console.warn(`⚠️ Tag "${tagName}" not found.`);
      return [];
    }

    const tagId = tags[0].id;
    const products = await getProductsByTagId(tagId, consumerKey, consumerSecret);
    return products;
  } catch (error) {
    console.error(`❌ Error getting products by tag name "${tagName}":`, error);
    return [];
  }
}

export async function getCompletedOrdersByEmail(
  email: string,
  consumerKey: string,
  consumerSecret: string
): Promise<WooOrder[]> {
  try {
    const response: AxiosResponse<WooOrder[]> = await api.get(
      "https://beautyhub.ng/wp-json/wc/v3/orders",
      {
        auth: {
          username: consumerKey,
          password: consumerSecret,
        },
        params: {
          status: "completed",
          per_page: 100,
        },
      }
    );

    const matchingOrders = (response.data || []).filter(
      (order) => order.billing?.email?.toLowerCase() === email.toLowerCase()
    );

    return matchingOrders;
  } catch (error) {
    console.error(`❌ Failed to fetch completed orders for ${email}:`, error);
    return [];
  }
}

export async function hasUserCompletedOrder(
  email: string,
  consumerKey: string,
  consumerSecret: string
): Promise<boolean> {
  const orders = await getCompletedOrdersByEmail(email, consumerKey, consumerSecret);
  return orders.length > 0;
}

export async function createWooCompletedOrder(
  email: string,
  consumerKey: string,
  consumerSecret: string
): Promise<WooOrder | null> {
  try {
    const payload: CreateOrderPayload = {
      payment_method: "paystack",
      payment_method_title: "Paystack",
      set_paid: true,
      status: "completed",
      billing: {
        email,
        first_name: "Paystack",
        last_name: "Customer",
      },
      line_items: [
        {
          name: "Skin Analysis Access",
          quantity: 1,
          total: "5000",
        },
      ],
    };

    const response: AxiosResponse<WooOrder> = await api.post(
      "https://beautyhub.ng/wp-json/wc/v3/orders",
      payload,
      {
        auth: {
          username: consumerKey,
          password: consumerSecret,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("❌ Failed to create WooCommerce order:", error);
    return null;
  }
}
