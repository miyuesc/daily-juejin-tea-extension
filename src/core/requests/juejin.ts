import { fetchPost } from "@/core/utils/fetch";

const baseUrl = "https://api.juejin.cn";

export const getCreatorJPowerHistory = async (userId?: string | null) => {
  try {
    return await fetchPost(
      `${baseUrl}/growth_api/v1/user_growth/author_jpower_detail`,
      { aid: 2608, uuid: "", spider: 0 },
      { cursor: "0", limit: 30 },
    );
  } catch (error) {
    throw new Error("Request Failed");
  }
};

export const getCreatorDataCards = async (datas: string[], userId: string) => {
  try {
    return await fetchPost(
      `${baseUrl}/growth_api/v1/user_growth/author_jpower_detail`,
      { aid: 2608, uuid: "", spider: 0 },
      { datas, user_id: userId },
    );
  } catch (error) {
    throw new Error("Request Failed");
  }
};
