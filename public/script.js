// script.js (GLOBAL FRONTEND SCRIPT)

;

// script.js (FINAL UPDATED WITH ADMIN SUPPORT + SEPARATE RESULTS & PAYMENTS)

const API = "https://muddy-frog-54f3.monirol4664.workers.dev";

/* =========================
   AUTH (LOGIN / SIGNUP)
========================= */

async function login(){
  let email = document.getElementById("email").value;
  let password = document.getElementById("password").value;

  let res = await fetch(API + "/login", {
    method: "POST",
    body: JSON.stringify({ email, password })
  });

  let data = await res.json();

  if(!data || !data.id){
    alert("Invalid login credentials");
    return;
  }

  localStorage.setItem("user", JSON.stringify(data));

  // ✅ ROLE BASED REDIRECT
  if(data.role === "admin"){
    location.href = "admin.html";
  } else {
    location.href = "dashboard.html";
  }
}

async function signup(){
  let name = document.getElementById("name").value;
  let email = document.getElementById("email").value;
  let password = document.getElementById("password").value;

  await fetch(API + "/signup", {
    method: "POST",
    body: JSON.stringify({ name, email, password })
  });

  alert("Registration successful");
  location.href = "login.html";
}

/* =========================
   SESSION GUARD
========================= */

function getUser(){
  return JSON.parse(localStorage.getItem("user"));
}

function requireStudent(){
  let user = getUser();
  if(!user || user.role === "admin"){
    alert("Access denied");
    location.href = "login.html";
  }
}

function requireAdmin(){
  let user = getUser();
  if(!user || user.role !== "admin"){
    alert("Admin only access");
    location.href = "login.html";
  }
}

function logout(){
  localStorage.removeItem("user");
  location.href = "login.html";
}

/* =========================
   PROFILE
========================= */

async function saveProfile(){
  let user = getUser();

  await fetch(API + "/profile", {
    method: "POST",
    body: JSON.stringify({
      id: user.id,
      name: document.getElementById("name").value,
      reg: document.getElementById("reg").value,
      roll: document.getElementById("roll").value,
      father: document.getElementById("father").value
    })
  });

  alert("Profile updated");
}

/* =========================
   RESULTS (SEPARATE FEATURE)
========================= */

async function loadResults(){
  let user = getUser();

  let res = await fetch(API + "/student-data?id=" + user.id);
  let data = await res.json();

  let container = document.getElementById("results");
  if(!container) return;

  let html = "";

  data.forEach(d=>{
    html += `
      <div class="section-box">
        <h4>${d.grade}</h4>

        <button class="btn-outline" onclick="viewResult('${d.grade}')">
          View Result
        </button>

        <button class="btn-primary" onclick="downloadResult('${d.grade}')">
          Download Result
        </button>

        <div id="res-${d.grade}">
          <p style="color:gray;">Click "View Result" to display</p>
        </div>
      </div>
    `;
  });

  container.innerHTML = html;
}

async function viewResult(grade){
  let user = getUser();
  let box = document.getElementById("res-" + grade);

  let res = await fetch(API + "/view-result?id=" + user.id + "&grade=" + grade);
  let data = await res.json();

  let html = "";

  if(!data.result || data.result.length === 0){
    box.innerHTML = "<p>No result available</p>";
    return;
  }

  data.result.forEach(r=>{
    html += `
      <p><strong>Subject:</strong> ${r.subject}</p>
      <p><strong>Grade:</strong> ${r.result_grade}</p>
      <p><strong>CGPA:</strong> ${r.cgpa}</p>
      <hr>
    `;
  });

  box.innerHTML = html;
}

async function downloadResult(grade){
  let user = getUser();

  let res = await fetch(API + "/view-result?id=" + user.id + "&grade=" + grade);
  let data = await res.json();

  if(!data.result || data.result.length === 0){
    alert("No result available");
    return;
  }

  let content = "Elite University Result Sheet\n\n";

  data.result.forEach(r=>{
    content += `${r.subject} | ${r.result_grade} | CGPA: ${r.cgpa}\n`;
  });

  let blob = new Blob([content], {type:"text/plain"});
  let a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "result.txt";
  a.click();
}

/* =========================
   PAYMENTS (SEPARATE FEATURE)
========================= */

async function loadPayments(){
  let user = getUser();

  let res = await fetch(API + "/student-data?id=" + user.id);
  let data = await res.json();

  let container = document.getElementById("payments");
  if(!container) return;

  let html = "";

  data.forEach(d=>{
    html += `
      <div class="section-box">
        <h4>${d.grade}</h4>

        <p><strong>${d.payment_name || "Payment"}</strong></p>
        <p>Amount: ${d.amount || "0"}৳</p>

        <button class="btn-primary" onclick="pay('${d.payment_id}')">
          Pay Now
        </button>

        <button class="btn-outline" onclick="downloadMemo('${d.payment_id}')">
          Download Memo
        </button>
      </div>
    `;
  });

  container.innerHTML = html;
}

function pay(pid){
  let user = getUser();
  window.location.href = API + "/bkash?pid=" + pid + "&uid=" + user.id;
}

async function downloadMemo(pid){
  let user = getUser();

  let res = await fetch(API + "/memo?pid=" + pid + "&uid=" + user.id);
  let text = await res.text();

  let blob = new Blob([text], {type:"text/plain"});
  let a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "payment_memo.txt";
  a.click();
}

/* =========================
   ADMIN FUNCTIONS
========================= */

async function createPayment(){
  requireAdmin();

  await fetch(API + "/create-payment-item", {
    method: "POST",
    body: JSON.stringify({
      grade: document.getElementById("p_grade").value,
      name: document.getElementById("p_name").value,
      amount: document.getElementById("p_amount").value
    })
  });

  alert("Payment option created");
}

async function addResult(){
  requireAdmin();

  await fetch(API + "/add-result", {
    method: "POST",
    body: JSON.stringify({
      student_id: document.getElementById("r_sid").value,
      grade: document.getElementById("r_grade").value,
      subject: document.getElementById("r_subject").value,
      result_grade: document.getElementById("r_gradeval").value,
      cgpa: document.getElementById("r_cgpa").value
    })
  });

  alert("Result added");
}

async function loadStudents(){
  requireAdmin();

  let res = await fetch(API + "/all-students");
  let data = await res.json();

  let container = document.getElementById("students");
  if(!container) return;

  let html = "";

  data.forEach(s=>{
    html += `
      <div class="section-box">
        <p><strong>ID:</strong> ${s.id}</p>
        <p><strong>Name:</strong> ${s.name || "Not set"}</p>
        <p><strong>Email:</strong> ${s.email}</p>
        <p><strong>Role:</strong> ${s.role}</p>
      </div>
    `;
  });

  container.innerHTML = html;
}

/* =========================
   HERO SLIDER
========================= */

function startSlider(){
  let i = 0;
  const slides = document.querySelectorAll(".slider img");

  if(!slides.length) return;

  setInterval(()=>{
    slides.forEach(s=>s.style.opacity="0");
    slides[i].style.opacity="1";
    i = (i+1)%slides.length;
  },3000);
}

/* =========================
   INIT
========================= */

document.addEventListener("DOMContentLoaded", ()=>{
  startSlider();

  if(document.getElementById("results")){
    requireStudent();
    loadResults();
    loadPayments();
  }

  if(document.getElementById("students")){
    requireAdmin();
  }
});