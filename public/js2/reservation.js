"use strict";
//import userData from "/js/header.js";
//const { user } = require("../../config/secret");
//const { currentUserIdx } = require("./header");
// const userIdx = require("/js/header.js");

const jwt = localStorage.getItem("x-access-token");
let userIdx;
const userName = document.querySelector("#name");
const userPhone = document.querySelector("#phone");
const userBirth = document.querySelector("#birth");

const reservBtn = document.querySelector("#reservation");

//병원 날짜+시간받아오기

reservBtn.addEventListener("click",reservation);


async function getUser(jwt){
    if(!jwt){
        return false;
    }
    fetch("/user/jwt",{
        method : "GET",
        headers: { 
        "x-access-token": jwt
    },
    //body : {}
    })
    .then((response) => response.json())
    .then((data) => {
        if(data.code==403){
            //잘못된 토큰이면 로그아웃되도록
            signOut();
            return false;
        }
    //유효한 토큰일 경우

    userIdx = data.result.userIdx;
    return true;

    });
}


function reservation(){

    const req = {
        //hosIdx :  ,
        userIdx : userIdx,
        userName: userName.value,
        userPhone :userPhone.value,
        userBirth : userBirth.value,
       };
       console.log(req);
    
       fetch("/user/reservation",{
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
           localStorage.setItem("x-access-token",jwt);
           alert(data.message);
           return location.replace("/user/main");
        });

       
}
