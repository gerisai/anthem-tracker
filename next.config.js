/** @type {import('next').NextConfig} */
const nextConfig = {
    // The home page is the current program. A config redirect is handled by
    // Vercel's routing layer, so it doesn't invoke a function. Not permanent,
    // so browsers don't cache it if "/" gets its own page later.
    async redirects() {
        return [
            {
                source: '/',
                destination: '/programs/current',
                permanent: false
            }
        ]
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'avatars.githubusercontent.com',
                port: '',
                pathname: '/u/**'
            }
        ]
    }
}

module.exports = nextConfig
