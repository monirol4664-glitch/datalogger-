const API = "https://muddy-frog-54f3.monirol4664.workers.dev";

function getUser(){
  return JSON.parse(localStorage.getItem("user"));
}

// LOGIN
async function login(){
  let res = await fetch(API+"/login",{
    method:"POST",
    body: JSON.stringify({
      email: email.value,
      password: password.value
    })
  });

  let data = await res.json();

  if(!data.id){
    alert("Invalid login");
    return;
  }

  localStorage.setItem("user", JSON.stringify(data));

  if(data.role === "admin"){
    location.href="admin.html";
  } else {
    location.href="dashboard.html";
  }
}

// SIGNUP
async function signup(){
  let res = await fetch(API+"/signup",{
    method:"POST",
    body: JSON.stringify({
      name:name.value,
      email:email.value,
      password:password.value
    })
  });

  let data = await res.json();

  if(!data.success){
    alert(data.error);
    return;
  }

  alert("Registered");
  location.href="login.html";
}

// PROFILE
async function saveProfile(){
  let user = getUser();

  await fetch(API+"/profile",{
    method:"POST",
    body: JSON.stringify({
      id:user.id,
      name:name.value,
      reg:reg.value,
      roll:roll.value,
      father:father.value
    })
  });

  alert("Saved");
}

// RESULTS
async function loadResults(){
  let user = getUser();
  let res = await fetch(API+"/student-data?id="+user.id);
  let data = await res.json();

  let html="";

  data.forEach(d=>{
    html+=`
    <div>
      <h4>${d.grade}</h4>
      <button onclick="viewResult('${d.grade}')">View</button>
      <div id="res-${d.grade}"></div>
    </div>`;
  });

  results.innerHTML=html;
}

async function viewResult(g){
  let user = getUser();

  let res = await fetch(API+"/view-result?id="+user.id+"&grade="+g);
  let data = await res.json();

  let h="";
  data.result.forEach(r=>{
    h+=`${r.subject} ${r.result_grade} ${r.cgpa}<br>`;
  });

  document.getElementById("res-"+g).innerHTML=h;
}

// PAYMENTS
async function loadPayments(){
  let user = getUser();
  let res = await fetch(API+"/student-data?id="+user.id);
  let data = await res.json();

  let html="";

  data.forEach(d=>{
    html+=`
    <div>
      <h4>${d.grade}</h4>
      <button onclick="pay('${d.payment_id}')">Pay</button>
    </div>`;
  });

  payments.innerHTML=html;
}

function pay(pid){
  let user = getUser();
  location.href=API+"/bkash?pid="+pid+"&uid="+user.id;
}

// ADMIN
async function createPayment(){
  await fetch(API+"/create-payment-item",{
    method:"POST",
    body: JSON.stringify({
      grade:p_grade.value,
      name:p_name.value,
      amount:p_amount.value
    })
  });
  alert("Created");
}

async function addResult(){
  await fetch(API+"/add-result",{
    method:"POST",
    body: JSON.stringify({
      student_id:r_sid.value,
      grade:r_grade.value,
      subject:r_subject.value,
      result_grade:r_gradeval.value,
      cgpa:r_cgpa.value
    })
  });
  alert("Added");
}