export default defineNuxtConfig({
    target: 'static',
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