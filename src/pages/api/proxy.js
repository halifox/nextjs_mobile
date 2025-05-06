import axios from "axios"

export default async function handler(req, res) {
    const {url} = req.query
    const method = req.method
    const headers = req.headers
    const body = req.body

    delete headers['x-forwarded-host']
    delete headers['x-forwarded-port']
    delete headers['x-forwarded-proto']
    delete headers['x-forwarded-for']
    delete headers['host']
    delete headers['referer']
    const response = await axios({
        url: url,
        method: method,
        headers: {
            ...headers
        },
        data: body,
        responseType: 'arraybuffer',
        validateStatus: (status) => true,

    })
    Object.entries(response.headers).forEach(([key, value]) => {
        if (value) res.setHeader(key, value)
    })
    res.status(response.status).send(response.data)
}
