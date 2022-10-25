"use strict";

const userID = document.querySelector("#userID");
const userName = document.querySelector("#userName");
const password = document.querySelector("#password");
const password2 = document.querySelector("#password2");
const signupBtn = document.querySelector("#signupBtn");
console.log(password.value);
signupBtn.addEventListener("click",signup);




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
        document.querySelector('.check').style.color = 'green';
        return true;
    }
    
}

function refreshPage(){
    window.location.reload();
} 

function signup(){
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
        if(userID.value == ""){
            alert("아이디를 입력하세요.");
            userID.focus();
            return false;
        }
        if(userName.value == ""){
            alert("이름을 입력하세요.");
            userName.focus();
            return false;
        }
        const req = {
            userID : userID.value,
            userName: userName.value,
            password :password.value,
        };
        console.log(req);

        fetch("/user/signup",{
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
            return location.replace("/user/login");
          });
    }

    
}

