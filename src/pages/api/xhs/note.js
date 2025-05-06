import axios from 'axios'
import {parse} from 'cookie'

import {get_request_headers_params} from "@/lib/xhs_xs_xsc_56"

export default async function handler(req, res) {
    try {
        const {source_note_id, xsec_token} = req.query
        const cookie = process.env.XHS_COOKIE
        const cookies = parse(cookie)
        const data = {
            "source_note_id": source_note_id,
            "image_formats": ["jpg", "webp", "avif"],
            "extra": {"need_body_topic": "1"},
            "xsec_source": "pc_search",
            "xsec_token": xsec_token,
        }
        const params = get_request_headers_params('/api/sns/web/v1/feed', data, cookies['a1'])
        const config = {
            headers: {
                "cookie": cookie,
                "x-s": params['xs'],
                "x-t": params['xt'],
                "x-s-common": params['xs_common'],
            },
        }
        const response = await axios.post('https://edith.xiaohongshu.com/api/sns/web/v1/feed', data, config)
        res.status(response.status).json(response.data)
    } catch (error) {
        res.status(599).json({
            status: error.response?.status,
            body: error.response?.body,
            error: error.message,
        })
    }
}
