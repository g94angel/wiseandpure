import { reactRouter } from '@react-router/dev/vite';

export default {
  plugins: [reactRouter()],
  server: {
    port: 5174,
    open: true,
  },
};
