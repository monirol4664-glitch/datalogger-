// Shared Utilities
export function getTodaySemester() {
  const now = new Date();
  const month = now.getMonth();
  const year = now.getFullYear();
  
  return {
    semester: month < 6 ? 'Spring' : 'Fall',
    year: year,
    month: month
  };
}

export function getCorsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };
}

export function createErrorResponse(error, status = 500) {
  return new Response(JSON.stringify({ error: error.message }), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

export function createSuccessResponse(data, status = 200) {
  return new Response(JSON.stringify({ success: true, ...data }), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
