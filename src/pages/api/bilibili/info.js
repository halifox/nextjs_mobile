import axios from 'axios'

export default async function handler(req, res) {
    try {
        const {id} = req.query
        const cookie = process.env.BILIBILI_COOKIE
        const response = await axios.get(`https://api.bilibili.com/x/web-interface/view`, {
            headers: {
                "cookie": cookie,
            },
            params: {
                aid: id,
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
