// pages/api/proxy/[...path].ts
import type { NextApiRequest, NextApiResponse } from 'next';
import loanGoals20022003 from '../../../../assets/data/1-2-3-MemphisAnalysis2022-2023.json';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { path } = req.query as { path: string[] };
    const apiUrl = `http:/157.230.53.110:8080/compliance/loan/${path.join('/')}`;

    try {
        console.log('apiUrl:', apiUrl,  JSON.stringify(req.body))
    /*    if (path.join("") === "ranking") {
            // return file till endpoint is ready
            res.status(200).json(loanGoals20022003);
        }*/
        const externalResponse = await fetch(apiUrl, {
            method: req.method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: req.method === 'POST' ? JSON.stringify(req.body) : undefined,
        });

        const data = await externalResponse.json();
        res.status(externalResponse.status).json(data);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch data' });
    }
}
