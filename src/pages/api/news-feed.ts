// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import cacheData from "memory-cache";
import type { NextApiRequest, NextApiResponse } from 'next'

export interface Data {
  author: string;
  content: string;
  description: string;
  publishedAt: string;
  source: {
    id: null | string;
    name: string;
  }
  title: string;
  url: string;
  urlToImage: string;
}

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
async function fetchWithCache(url: string, options: object, key: string) {
  const value = cacheData.get(url + key);
  if (value) {
      return value;
  } else {
      const hours = 0.25;
      const res = await fetch(url, options);
      const data = await res.json();
      cacheData.put(url + key, data, hours * 1000 * 60 * 60);
      return data;
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<[Data]>) {

  let response;

  response = await fetchWithCache(`https://newsapi.org/v2/top-headlines?country=us&apiKey=${process.env.token}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
    }, 'latest headlines');

    if (response && response.status != 'error') {
      res.status(200).json(response)
    } else {
    res.status(500).json(response)
  }
}