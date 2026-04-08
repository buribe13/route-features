/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['baseui', 'styletron-react', 'styletron-engine-monolithic'],
}

module.exports = nextConfig
