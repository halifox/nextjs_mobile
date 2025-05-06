import axios from 'axios'
import {parse} from 'cookie'

import {get_request_headers_params} from "@/lib/xhs_xs_xsc_56"

export default async function handler(req, res) {
    try {
        const {source_note_id, xsec_token, top_comment_id, cursor} = req.query
        const cookie = process.env.XHS_COOKIE
        const cookies = parse(cookie)
        const data = {
            "note_id": source_note_id,
            "cursor": cursor,
            "top_comment_id": top_comment_id,
            "image_formats": ["jpg", "webp", "avif"],
            "xsec_token": xsec_token,
        }
        const params = get_request_headers_params('/api/sns/web/v2/comment/page', data, cookies['a1'])
        const config = {
            headers: {
                "cookie": cookie,
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:138.0) Gecko/20100101 Firefox/138.0',
                "x-s": params['xs'],
                "x-t": params['xt'],
                "x-s-common": params['xs_common'],
            },
            params: data,
        }
        const response = await axios.get('https://edith.xiaohongshu.com/api/sns/web/v2/comment/page', config)
        res.status(response.status).json(response.data)
    } catch (error) {
        res.status(599).json({
            status: error.response?.status,
            body: error.response?.body,
            error: error.message,
        })
    }
}
