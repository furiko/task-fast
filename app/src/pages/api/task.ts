import { NextApiRequest, NextApiResponse } from 'next'
import axios, { AxiosRequestConfig } from 'axios'

const databaseId = process.env.DB_ID
const secret = process.env.SECRET_KEY

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const url = 'https://api.notion.com/v1/pages'
  const notionVersion = '2021-08-16'

  console.log('req.body: ', req.body)
  const body = req.body

  const config = {
    headers: {
      Authorization: `Bearer ${secret}`,
      'Notion-Version': notionVersion,
      'Content-Type': 'application/json',
      'Allow-Control-Allow-Origin': '*',
    },
  }
  let request = null
  if (req.method == 'POST') {
    request = CreateTask(url, body, config)
  } else {
    request = UpdateTask(url, body, config)
  }

  request
    .then((resp) => {
      console.log(resp)
      res.status(200).json({ message: 'Success', data: resp.data })
    })
    .catch((err) => {
      console.error(err)
      res.status(500).json({ message: 'Failed' })
    })
}

const CreateTask = (url: string, body: any, config: AxiosRequestConfig) => {
  const data = {
    parent: { database_id: databaseId },
    properties: {
      title: {
        title: [
          {
            text: {
              content: body.name,
            },
          },
        ],
      },
      Tag: {
        multi_select: [
          {
            name: body.tag,
          },
        ],
      },
      Time: {
        date: {
          time_zone: 'Asia/Tokyo',
          start: body.start,
          end: body.end,
        },
      },
    },
  }

  return axios.post(url, data, config)
}

const UpdateTask = (url: string, body: any, config: AxiosRequestConfig) => {
  const data = {
    parent: { database_id: databaseId },
    properties: {
      Time: {
        date: {
          time_zone: 'Asia/Tokyo',
          start: body.start,
          end: body.end,
        },
      },
    },
  }

  return axios.patch(`${url}/${body.pageId}`, data, config)
}