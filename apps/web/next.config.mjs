/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // Proxy API requests to backend
  async rewrites() {
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:4000';
    
    return [
      {
        source: '/api/:path*',
        destination: `${backendUrl}/:path*`,
      },
    ];
  },

  // Image optimization configuration
  images: {
    remotePatterns: (() => {
      const allowlist = process.env.IMAGE_DOMAIN_ALLOWLIST || '';
      if (!allowlist) return [];
      
      return allowlist.split(',').map(domain => {
        const trimmed = domain.trim();
        // Parse domain - handle both http://domain.com and domain.com formats
        const urlMatch = trimmed.match(/^(?:https?:\/\/)?([^/]+)/);
        const hostname = urlMatch ? urlMatch[1] : trimmed;
        
        return {
          protocol: trimmed.startsWith('https://') ? 'https' : 'http',
          hostname: hostname,
        };
      }).filter(pattern => pattern.hostname);
    })(),
  },

  // Security headers
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
