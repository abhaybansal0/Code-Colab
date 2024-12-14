/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
        return [
            {
                source: '/api/:path*',
                destination: 'http://localhost:5000/api/:path*', // Proxy to the backend
            },
            {
                source: '/socket.io/:path*',
                destination: 'http://localhost:5000/socket.io/:path*', // Socket.IO endpoint
            },
        ];
    },

};


export default nextConfig;
