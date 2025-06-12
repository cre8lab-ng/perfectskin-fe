import api from "@/util/api";

// Get WooCommerce product tags by search term
export async function getAllTags(
  searchTerm: string,
  consumerKey: string,
  consumerSecret: string
) {
  try {
    const response = await api.get(
      "https://beautyhub.ng/wp-json/wc/v3/products/tags",
      {
        auth: {
          username: consumerKey,
          password: consumerSecret,
        },
        params: {
          search: searchTerm.toLowerCase(), // 👈 force lowercase
        },
      }
    );
    console.log(response)
    return response || [];
  } catch (error) {
    console.error("❌ Failed to fetch tags:", error);
    return [];
  }
}

// Get products by tag ID (only published)
export async function getProductsByTagId(
  tagId: number,
  consumerKey: string,
  consumerSecret: string
) {
  try {
    const response = await api.get(
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

    return (response || []).map((p: any) => ({
      id: p.id,
      name: p.name,
      price_html: p.price_html,
      brand: p.brands[0].name,
      image: p.images?.[0]?.src || null,
      link: p.permalink, 
    }));
  } catch (error) {
    console.error(`❌ Failed to fetch products for tag ID ${tagId}:`, error);
    return [];
  }
}

// Get products by tag name
export async function getProductsByTagName(
  tagName: string,
  consumerKey: string,
  consumerSecret: string
) {
  try {
    const tags = await getAllTags(tagName, consumerKey, consumerSecret);
    console.log(tags,1)

    if (!Array.isArray(tags) || tags.length === 0) {
      console.warn(`⚠️ Tag "${tagName}" not found.`);
      return [];
    }
    console.log(tags,2)
    const tagId = tags[0].id;
    const products = await getProductsByTagId(tagId, consumerKey, consumerSecret);
console.log(products,"products")
    return products;
  } catch (error) {
    console.error(`❌ Error getting products by tag name "${tagName}":`, error);
    return [];
  }
}
