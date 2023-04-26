export default defineNuxtConfig({
    target: 'static',
    nitro: {
        preset: "cloudflare_pages",
        prerender: {
            ignore: ['/404'],
            routes: ['/']
        },
        serveStatic: true
    },
    runtimeConfig: {
        // The private keys which are only available server-side
        apiSecret: '123',
        // Keys within public are also exposed client-side
        public: {
            apiBase: '/api'
        }
    },
    build: {
        transpile: ['gsap'],
    }
})