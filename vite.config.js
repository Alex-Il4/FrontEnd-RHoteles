import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    host: true, // Esto es útil para permitir conexiones desde otras IPs en tu red local
    port: 5173, // Asegúrate de que este es el puerto de Vite
    strictPort: true,
    hmr: {
      clientPort: 5173
    },
    allowedHosts: [
      'localhost',
      '127.0.0.1',
      '0.0.0.0',
      '*.ngrok-free.app', // Mantén este comodín
      'd9ae-190-62-84-165.ngrok-free.app' // <-- ¡AÑADE ESTA LÍNEA ESPECÍFICA!
                                         // Si te da un nuevo subdominio, tendrás que actualizarlo de nuevo.
    ],
    proxy: {
      '/api': {
        target: 'http://localhost:8081',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/api'),
      }
    }
  }
})