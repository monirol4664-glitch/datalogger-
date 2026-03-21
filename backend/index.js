import { handleRequest } from './routes.js';

export default {
  async fetch(request, env) {
    try {
      return await handleRequest(request, env);
    } catch (err) {
      return new Response(err.message, { status: 500 });
    }
  }
};
