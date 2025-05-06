import axios from 'axios'
import {parse} from 'cookie'

import {get_request_headers_params} from "@/lib/xhs_xs_xsc_56"


export default async function handler(req, res) {
    try {
        const {keyword, page} = req.query
        const cookie = process.env.XHS_COOKIE
        const cookies = parse(cookie)
        const data = {
            "keyword": keyword,
            "page": page,
            "page_size": 20,
            "search_id": "2eqmckkponhqh9wexteg8",
            "sort": "general",
            "note_type": 0,
            "ext_flags": [],
            "geo": "",
            "image_formats": ["jpg", "webp", "avif"]
        }
        const params = get_request_headers_params('/api/sns/web/v1/search/notes', data, cookies['a1'])
        const config = {
            headers: {
                "cookie": cookie,
                "x-s": params['xs'],
                "x-t": params['xt'],
                "x-s-common": params['xs_common'],
            },
        }
        const response = await axios.post('https://edith.xiaohongshu.com/api/sns/web/v1/search/notes', data, config)
        res.status(response.status).json(response.data)
    } catch (error) {
        res.status(599).json({
            status: error.response?.status,
            body: error.response?.body,
            error: error.message,
        })
    }
}
