type FetchParams = Record<string, unknown>

export async function fetchGet(url: string, params: FetchParams = {}) {
  const firstUrl = url
  let paramsUrl = '?'
  for (const key in params)
    paramsUrl += `${key}=${params[key]}&`

  return await fetch(`${firstUrl}${paramsUrl}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    mode: 'cors',
  }).then(response => response.json())
}

export async function fetchPost(url: string, params: FetchParams = {}, data: unknown, headers = {}, cors = true) {
  const firstUrl = url
  let paramsUrl = ''
  for (const key in params)
    paramsUrl += `${key}=${params[key]}&`

  return await fetch(`${firstUrl}${paramsUrl ? `?${paramsUrl}` : ''}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    credentials: 'include',
    mode: cors ? 'cors' : 'same-origin',
    body: JSON.stringify(data),
  }).then(response => response.json())
}
