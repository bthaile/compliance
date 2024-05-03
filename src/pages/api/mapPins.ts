import { NextApiRequest, NextApiResponse } from "next";
import Socket from "simple-websocket";

const socket2 = new Socket(process.env.NEXT_PUBLIC_SECOND_WEBSOCKET_SERVER ??
  'wss://wss.terravalue.net:8089');

const id = '5f4ac741b9024e2680ae82990d49d4bd';
const userId = 'iltbXdwI5fZZPji5IiYW8O2MZOG2';


const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { query } = req;

  await new Promise(resolve => {
    socket2.on('connect', (data) => {
      socket2.send(
        JSON.stringify({
          id: id,
          status: 'ADD_MAP_PINS',
          userId: userId,
          payload: query,
        }),
      );
      console.log('resolve')
      resolve(data);
    });
  });

  console.log('awaiting')
  const resp = await new Promise(resolve => {
    socket2.on('data', (data: BufferSource | undefined) => {
      const resp = new TextDecoder('utf-8').decode(data);
      resolve(data);
      console.log(resp);
      res.status(200).json(resp);
    });
  });
  res.status(200).json(resp);
}

export default handler;