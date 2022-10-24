"use strict";
const hosID = document.querySelector("#id");
const password = document.querySelector("#pw");
const loginBtn = document.querySelector("#loginBtn");

loginBtn.addEventListener("click",login);

function refreshPage(){
    window.location.reload();
} 

function login(){

    if(id.value.length<1 || password.value.length<1){
        return alert("회원 정보를 입력해주세요");
    }
    
    // 로그인 api 요청

    const req = {
        hosID : hosID.value,
        password :password.value,
    };
    console.log(req);
    
    fetch("/login",{
        method : "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body : JSON.stringify(req),
    })
    .then((response) => response.json())
    .then((data) => {
        if(data.code!=200){
            return alert("아이디 비밀번호를 다시 입력하세요");
        }
        const jwt = data.result.jwt;
        console.log(data);
        localStorage.setItem("x-access-token",jwt);
        alert(data.message);
        return location.replace("/reservation");
        });

    
}