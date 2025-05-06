/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            new URL('http://sns-webpic-qc.xhscdn.com/**'),
            new URL('https://*.hdslb.com/**'),
            new URL('http://*.hdslb.com/**'),
            new URL('https://*.bilivideo.com/**'),
        ],
    },
};

export default nextConfig;
