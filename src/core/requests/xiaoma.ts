import { fetchPost } from "@/core/utils/fetch";

const baseUrl = "https://api.xiaomark.com";

export const createShortLink = async (originUrl: string) => {
  try {
    return await fetchPost(
      `${baseUrl}/v1/link/create`,
      {},
      {
        apikey: "",
        origin_url: originUrl,
        report: true,
        webhook: true,
        webhook_scene: "test",
      },
    );
  } catch (error) {
    throw new Error("Request Failed");
  }
};
