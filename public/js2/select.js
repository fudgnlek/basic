"use strict";

function getInfo(){
    const userIdx = window.localStorage.getItem("userIdx");
    const req = {userIdx: userIdx};
    fetch("/user/getResInfo",{
        method:"POST",
        headers: {
        "Content-Type": "application/json"
    },
    body : JSON.stringify(req),
    }).then((response) => response.json())
    .then((data) => {
        // const res = data.code;
        // return res;
        console.log(data.code);
        const resInfo = data.result;
        if(resInfo.length<1){
            var contents = `<div style=" font-size:13px; margin-bottom: 3px; text-align:center; color:black">예약 내역이 없습니다.</div>`;
            console.log(contents);
            $("#mypage").html(contents);
            $("#mypage").bPopup({
                modalClose : true,
                opacity : 0.3,
                position: [$(document).width()*0.75,175]
            });
        }
        else{
            
            var page = document.getElementById('mypage');
            var hnarr = [];
            var haarr = [];
            var darr = [];
            var tarr = [];
            

            for(var i=0;i<resInfo.length;i++){
                list(i,resInfo[i],hnarr,haarr,darr,tarr);
            }

            console.log(page.innerHTML);
            $("#mypage").bPopup({
                modalClose : true,
                opacity : 0.3,
                position: [$(document).width()*0.75,175]
            });


        }
        
    });

};

function list(i,resInfo,hnarr,haarr,darr,tarr){
    var page = document.getElementById('mypage');
    console.log(resInfo);
    hnarr[i] = resInfo.hosName;
    haarr[i] = resInfo.hosAddress1;
    darr[i] = resInfo.Date;
    tarr[i] = resInfo.Time;

    var el = document.createElement('div'),
    content = `<div style=" font-size:13px; margin-bottom: 3px; text-align:center; color:black">
    <p style=" font-weight: bold;">`+ (i+1) +` . 병원 : `+ hnarr[i] +
    `<p> 주소 : `+ haarr[i] +
    `<p> 날짜 : `+ darr[i] + 
    `<p> 시간 : `+ tarr[i] +
    `<p> -------------------------
    </div>`

    el.innerHTML = content;
    page.appendChild(el);
    
}

function refreshPage(){
    window.location.reload();
    //window.localStorage.clear();
    window.localStorage.removeItem('name');
    window.localStorage.removeItem('address');
    window.localStorage.removeItem('date');
    window.localStorage.removeItem('time');
    window.localStorage.removeItem('num');
} 
