import { fetchPost } from "@/core/utils/fetch";

const baseUrl = "https://api.coze.com/open_api/v2";

export const createArticleSummary = async (id: string) => {
  try {
    return await fetchPost(
      `${baseUrl}/chat`,
      {},
      {
        bot_id: "7369838133141307410",
        user: "29032201862555",
        query: `{'id': ${id} }`,
        stream: false,
      },
      {
        Authorization: `Bearer pat_JlwrYzgzdoAH0ONQTF98H0hE8QSC4pRSoqoLrl3D5FMS2WIbtr6uwFfybvIqmGqC`,
        Host: "api.coze.com",
      },
    );
  } catch (error) {
    throw new Error("Request Failed");
  }
};
