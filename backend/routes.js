import { dbService } from './db.js';

export async function handleRequest(request, env) {
  const url = new URL(request.url);

  // 1. Home Route (Fixes your "Not Found" error)
  if (url.pathname === "/") {
    return new Response(JSON.stringify({ 
      system: "University Backend v1.0",
      status: "Online" 
    }), { headers: { "Content-Type": "application/json" } });
  }

  // 2. Course Catalog Route
  if (url.pathname === "/api/courses") {
    const courses = await dbService.getAllCourses(env.DB);
    return Response.json(courses);
  }

  // 3. Simple 404 for everything else
  return new Response("Route not defined in university system", { status: 404 });
}
