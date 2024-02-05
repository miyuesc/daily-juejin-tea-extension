type FetchParams = Record<string, unknown>;

export const fetchGet = async (url: string, params: FetchParams = {}) => {
  const firstUrl = url;
  let paramsUrl = "?";
  for (let key in params) {
    paramsUrl += `${key}=${params[key]}&`;
  }
  return await fetch(`${firstUrl}${paramsUrl}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    mode: "cors",
  }).then((response) => response.json());
};

export const fetchPost = async (
  url: string,
  params: FetchParams = {},
  data?: unknown
) => {
  const firstUrl = url;
  let paramsUrl = "?";
  for (let key in params) {
    paramsUrl += `${key}=${params[key]}&`;
  }
  return await fetch(`${firstUrl}${paramsUrl}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    mode: "cors",
    body: JSON.stringify(data),
  }).then((response) => response.json());
};
