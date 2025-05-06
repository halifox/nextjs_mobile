import axios from 'axios'

export default async function handler(req, res) {
    try {
        const {id, cid} = req.query
        const cookie = process.env.BILIBILI_COOKIE
        const response = await axios.get(`https://api.bilibili.com/x/player/playurl`, {
            headers: {
                "cookie": cookie,
            },
            params: {
                avid: id,
                cid: cid,
                platform: 'html5',
                high_quality: 1,
                qn: 64,
            }
        })
        res.status(response.status).json(response.data)
    } catch (error) {
        res.status(599).json({
            status: error.response?.status,
            body: error.response?.body,
            error: error.message,
        })
    }
}
