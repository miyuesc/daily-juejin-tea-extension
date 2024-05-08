import { fetchPost } from "@/core/utils/fetch";

const baseUrl = "https://api.xiaomark.com";

export const createShortLink = async (originUrl: string) => {
  try {
    return await fetchPost(
      `${baseUrl}/v1/link/create`,
      {},
      {
        apikey: "26bd768def862c254bdc93f1eadc3859",
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
