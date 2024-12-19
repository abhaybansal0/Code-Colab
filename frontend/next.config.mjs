/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
        return [
            {
                source: '/api/:path*',
                destination: `${process.env.NEXT_PUBLIC_BACKEND_DOMAIN}/api/:path*`, // Proxy to the backend
            },
            {
                source: '/socket.io/:path*',
                destination: `${process.env.NEXT_PUBLIC_BACKEND_DOMAIN}/socket.io/:path*`, // Socket.IO endpoint
            },
        ];
    },

};


export default nextConfig;
