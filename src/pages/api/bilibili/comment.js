import axios from 'axios'

export default async function handler(req, res) {
    try {
        const {id, page} = req.query
        const cookie = process.env.BILIBILI_COOKIE
        const response = await axios.get(`https://api.bilibili.com/x/v2/reply`, {
            headers: {
                "cookie": cookie,
            },
            params: {
                type: 1,
                oid: id,
                sort: 0,
                nohot: 0,
                ps: 20,
                pn: page,
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
