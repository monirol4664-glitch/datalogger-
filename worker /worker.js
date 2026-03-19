// worker.js (UPDATED - NO RESULT LOCK)

export default {
  async fetch(req, env) {
    const url = new URL(req.url);

    /* AUTH */
    if (url.pathname === "/signup") {
      const b = await req.json();
      await env.DB.prepare(
        "INSERT INTO students (name,email,password) VALUES (?,?,?)"
      ).bind(b.name, b.email, b.password).run();
      return new Response("ok");
    }

    if (url.pathname === "/login") {
      const b = await req.json();
      const user = await env.DB.prepare(
        "SELECT id,name,email,role FROM students WHERE email=? AND password=?"
      ).bind(b.email, b.password).first();
      return Response.json(user || {});
    }

    /* PROFILE */
    if (url.pathname === "/profile") {
      const b = await req.json();
      await env.DB.prepare(
        "UPDATE students SET name=?,reg=?,roll=?,father=? WHERE id=?"
      ).bind(b.name, b.reg, b.roll, b.father, b.id).run();
      return new Response("updated");
    }

    /* ADMIN */
    if (url.pathname === "/create-payment-item") {
      const b = await req.json();
      await env.DB.prepare(
        "INSERT INTO payment_items (grade,name,amount) VALUES (?,?,?)"
      ).bind(b.grade, b.name, b.amount).run();
      return new Response("ok");
    }

    if (url.pathname === "/add-result") {
      const b = await req.json();
      await env.DB.prepare(
        "INSERT INTO results (student_id,grade,subject,result_grade,cgpa) VALUES (?,?,?,?,?)"
      ).bind(
        b.student_id,
        b.grade,
        b.subject,
        b.result_grade,
        b.cgpa
      ).run();
      return new Response("ok");
    }

    if (url.pathname === "/all-students") {
      const data = await env.DB.prepare(
        "SELECT id,name,email,role FROM students"
      ).all();
      return Response.json(data.results);
    }

    /* STUDENT DATA */
    if (url.pathname === "/student-data") {
      const id = url.searchParams.get("id");

      const data = await env.DB.prepare(`
        SELECT DISTINCT 
          r.grade,
          p.id as payment_id,
          p.name as payment_name,
          p.amount
        FROM results r
        LEFT JOIN payment_items p ON r.grade = p.grade
        WHERE r.student_id=?
      `).bind(id).all();

      return Response.json(data.results);
    }

    /* ✅ VIEW RESULT (NO LOCK) */
    if (url.pathname === "/view-result") {
      const id = url.searchParams.get("id");
      const grade = url.searchParams.get("grade");

      const result = await env.DB.prepare(
        "SELECT subject,result_grade,cgpa FROM results WHERE student_id=? AND grade=?"
      ).bind(id, grade).all();

      return Response.json({
        locked: false,
        result: result.results
      });
    }

    /* PAYMENT */
    if (url.pathname === "/bkash") {
      const pid = url.searchParams.get("pid");
      const uid = url.searchParams.get("uid");

      const existing = await env.DB.prepare(
        "SELECT * FROM payments WHERE student_id=? AND payment_id=?"
      ).bind(uid, pid).first();

      if (!existing) {
        await env.DB.prepare(
          "INSERT INTO payments (student_id,payment_id,status) VALUES (?,?,?)"
        ).bind(uid, pid, "Paid").run();
      }

      return new Response(`
        <html>
        <body style="text-align:center;padding:50px;">
          <h2>✅ Payment Successful</h2>
          <a href="/dashboard.html">Back to Dashboard</a>
        </body>
        </html>
      `, { headers: { "content-type": "text/html" } });
    }

    /* MEMO */
    if (url.pathname === "/memo") {
      const uid = url.searchParams.get("uid");
      const pid = url.searchParams.get("pid");

      const student = await env.DB.prepare(
        "SELECT name,reg,roll FROM students WHERE id=?"
      ).bind(uid).first();

      const payment = await env.DB.prepare(
        "SELECT name,amount,grade FROM payment_items WHERE id=?"
      ).bind(pid).first();

      return new Response(`
Elite University Payment Memo

Student: ${student?.name || ""}
Reg: ${student?.reg || ""}
Roll: ${student?.roll || ""}

Payment: ${payment?.name || ""}
Semester: ${payment?.grade || ""}
Amount: ${payment?.amount || ""}৳

Status: Paid
      `);
    }

    return new Response("API Running");
  }
};