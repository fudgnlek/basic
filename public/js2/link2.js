
const eyeBtn = document.querySelector("#eyeBtn");
const hbBtn = document.querySelector("#hbBtn");
const skBtn = document.querySelector("#skBtn");
const jhBtn = document.querySelector("#jhBtn");
const nBtn = document.querySelector("#nBtn");
const noBtn = document.querySelector("#noBtn");
const skinBtn = document.querySelector("#skinBtn");
const tBtn = document.querySelector("#tBtn");

//const phar = document.querySelector("#")


eyeBtn.addEventListener("click", function(){
    window.localStorage.setItem("keyword",'안과');
    return location.replace("/user/getmap");
});

hbBtn.addEventListener("click", function(){
    window.localStorage.setItem("keyword",'흉부외과');
    return location.replace("/user/getmap");
});

skBtn.addEventListener("click", function(){
    window.localStorage.setItem("keyword",'신경외과');
    return location.replace("/user/getmap");
});


jhBtn.addEventListener("click", function(){
    window.localStorage.setItem("keyword",'정형외과');
    return location.replace("/user/getmap");
});

nBtn.addEventListener("click", function(){
    window.localStorage.setItem("keyword",'내과');
    return location.replace("/user/getmap");
});

noBtn.addEventListener("click", function(){
    window.localStorage.setItem("keyword",'이비인후과');
    return location.replace("/user/getmap");
});


skinBtn.addEventListener("click", function(){
    window.localStorage.setItem("keyword",'피부과');
    return location.replace("/user/getmap");
});

tBtn.addEventListener("click", function(){
    window.localStorage.setItem("keyword",'치과');
    return location.replace("/user/getmap");
});

