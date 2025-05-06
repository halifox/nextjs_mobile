import axios from 'axios'

export default async function handler(req, res) {
    try {
        const {keyword, page} = req.query
        const cookie = process.env.BILIBILI_COOKIE
        const response = await axios.get(`https://api.bilibili.com/x/web-interface/search/type`, {
            headers: {
                "cookie": cookie,
            },
            params: {
                search_type: 'video',
                keyword: keyword,
                page: page,
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
