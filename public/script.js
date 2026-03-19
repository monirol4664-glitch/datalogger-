// script.js (GLOBAL FRONTEND SCRIPT)

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

  if(!data){
    alert("Invalid login");
    return;
  }

  localStorage.setItem("user", JSON.stringify(data));
  location.href = "dashboard.html";
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
   PROFILE
========================= */

async function saveProfile(){
  let user = JSON.parse(localStorage.getItem("user"));

  let name = document.getElementById("name").value;
  let reg = document.getElementById("reg").value;
  let roll = document.getElementById("roll").value;
  let father = document.getElementById("father").value;

  await fetch(API + "/profile", {
    method: "POST",
    body: JSON.stringify({
      id: user.id,
      name,
      reg,
      roll,
      father
    })
  });

  alert("Profile updated");
}

/* =========================
   LOAD DATA
========================= */

async function loadResults(){
  let user = JSON.parse(localStorage.getItem("user"));

  let res = await fetch(API + "/student-data?id=" + user.id);
  let data = await res.json();

  let container = document.getElementById("results");
  let html = "";

  data.forEach(d=>{
    html += `
      <div class="section-box">
        <h4>${d.grade}</h4>
        <button class="btn-outline" onclick="viewResult('${d.grade}')">View Result</button>
        <button class="btn-primary" onclick="downloadResult('${d.grade}')">Download Result</button>
        <div id="res-${d.grade}"></div>
      </div>
    `;
  });

  container.innerHTML = html;
}

async function loadPayments(){
  let user = JSON.parse(localStorage.getItem("user"));

  let res = await fetch(API + "/student-data?id=" + user.id);
  let data = await res.json();

  let container = document.getElementById("payments");
  let html = "";

  data.forEach(d=>{
    html += `
      <div class="section-box">
        <h4>${d.grade}</h4>
        <button class="btn-primary" onclick="pay('${d.payment_id}')">Pay Now</button>
        <button class="btn-outline" onclick="downloadMemo('${d.payment_id}')">Download Memo</button>
      </div>
    `;
  });

  container.innerHTML = html;
}

/* =========================
   RESULT FUNCTIONS
========================= */

// ONLY CHANGE THIS FUNCTION

async function viewResult(grade){
  let user = JSON.parse(localStorage.getItem("user"));
  let box = document.getElementById("res-" + grade);

  let res = await fetch(API + "/view-result?id=" + user.id + "&grade=" + grade);
  let data = await res.json();

  let html = "";
  data.result.forEach(r=>{
    html += `
      <p>Subject: ${r.subject}</p>
      <p>Grade: ${r.result_grade}</p>
      <p>CGPA: ${r.cgpa}</p>
      <hr>
    `;
  });

  box.innerHTML = html;
}

async function downloadResult(grade){
  let user = JSON.parse(localStorage.getItem("user"));

  let res = await fetch(API + "/view-result?id=" + user.id + "&grade=" + grade);
  let data = await res.json();

  if(data.locked){
    alert("Please complete payment first");
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

