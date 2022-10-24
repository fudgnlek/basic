"use strict";

const hosID = document.querySelector("#hosID");
const hosName = document.querySelector("#hosName");
const password = document.querySelector("#password");
const password2 = document.querySelector("#password2");
const hosAddress1 = document.querySelector("#hosAddress1");
const hosAddress2 = document.querySelector("#hosAddress2");
const hosNumber = document.querySelector("#hosNumber");

const signupBtn = document.querySelector("#signupBtn");

// var radios = document.getElementsByName('category');
// radios.addEventListener("click", cate_checked);
//var category_cheked;

signupBtn.addEventListener("click",signup);

var category = document.getElementsByName('category');
var categorySelected; // 여기에 선택된 radio 버튼의 값이 담기게 된다.
for(var i=0; i<category.length; i++) {
    if(category[i].checked) {
        categorySelected = category[i].value;
        console.log(categorySelected);
    }
}

var psword = 0;

function check(){
    var p1 = password.value;
    var p2 = password2.value;
    if (p1.length < 4) {
        alert("비밀번호를 다시 입력하시오.");
        return false;
    }
    if(p1 != p2){
        alert("비밀번호가 일치하지 않습니다.");
        return false;
    }

    else{
        alert("비밀번호가 일치합니다.");
        psword = 1;
        document.getElementById('che').style.color = 'green';
        return true;
    }
    
}

function refreshPage(){
    window.location.reload();
} 

function is_checked(){
    var checkbox = document.getElementById('flexCheckDefault');
    var is_ck = checkbox.checked;

    if(is_ck != true){
        alert("개인정보 제공 동의에 체크해주세요.");
        return false;
    }
    else if(psword != 1){
        alert("비밀번호를 확인해주세요.");
        return false;
    }
    else{
        return true;
    }   
}

function signup(){
   const req = {
    hosID : hosID.value,
    hosName: hosName.value,
    password :password.value,
    // categorySelected : categorySelected,
    hosAddress1 : hosAddress1.value,
    hosAddress2 : hosAddress2.value,
    hosNumber: hosNumber.value,
   };
   console.log(req);

   fetch("/signup",{
    method : "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body : JSON.stringify(req),
   }).then((response) => response.json())
    .then((data) => {
        if(data.code!=200){
            return alert("요청에문제가생겼습니다.");
        }
    const jwt = data.result.jwt;
    console.log(jwt);
    localStorage.setItem("x-access-token", jwt);
    alert(data.message);
    return location.replace("/login");
  });
}
