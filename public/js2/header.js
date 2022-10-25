
const jwt = localStorage.getItem("x-access-token");
setHeader(jwt);


const btnSignout=document.querySelector("#sign-out");
btnSignout.addEventListener("click",signOut);

async function setHeader(jwt){
    if(!jwt){
        alert('로그인이 필요합니다.');
        location.replace('/user/login');
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

    const userIdx = data.result.userIdx;
    window.localStorage.setItem('userIdx', userIdx);
    const userName = data.result.userName;
    

    // 닉네임 들어가는 부분에 유저 이름 넣기 
    const spanNickname = document.querySelector(".nickname");
    spanNickname.innerHTML = userName;

    return true;

    // localStorage.setItem("x-access-token",jwt);
    // alert(data.message);
    // return location.replace("/main");
    });
}

function signOut(){
    localStorage.removeItem("x-access-token");
    location.replace('/user/login');
    }
