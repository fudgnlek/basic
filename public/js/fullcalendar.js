const getIdx = async () => {
    if(!jwt){
        return false;
    }
    const res = await fetch("/hospital/jwt",{
        method : "GET",
        headers: { "x-access-token": jwt}});
    const data = await res.json();
    
    if(data.code==403){
            //잘못된 토큰이면 로그아웃되도록
            signOut();
            return false;
        }

    return data.result.hosIdx;
}

document.addEventListener('DOMContentLoaded', function() {

    var calendarEl = document.getElementById('calendar');
    const printIdx = async () => {  
        idx = await getIdx();  
    
    // calendar 설정
    var calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: 'dayGridMonth',
    timeZone: 'local',
    editable: false,
    eventTimeFormat:{
        hour: '2-digit',
        minute: '2-digit',
        meridiem:true
    },

    eventClick: function(info){
        console.log(info);
        let year = info.event.start.getFullYear();
        let month = info.event.start.getMonth()+1;
        let date = info.event.start.getDate();
        let hour = info.event.start.getHours();
        let minute = info.event.start.getMinutes();

        let start = year + "." + month + "." + date + " " + "예약자";
        let num = hour + '시 ' + minute + '분' ;
        let usernum = localStorage.getItem(info.event.title);
        let contents = `
        <div style="font-weight: bold; font-size:20px; margin-bottom: 30px; text-align:center; color:black;">
        <i class="fa-solid fa-clipboard-list"></i>  &nbsp;
        ${start}
        <br><br>
        </div>
        <div style="font-size: 15px; margin-bottom: 20px; color:black;">
            <i class="fa-regular fa-square"></i> &nbsp;
            이름 : ${info.event.title} <br>
            &nbsp; &nbsp;&nbsp;&nbsp;
            시간 : ${num} <br>
            &nbsp; &nbsp;&nbsp;&nbsp;
            번호 : ${usernum}
            <br><br>
            
        </div>`;

        $("#popup").html(contents);
        $("#popup").bPopup({
            speed: 650,
            transition: "slideIn",
            transitionClose: "slideBack",
            position: [($(document).width()-300)/2,150]
        });
        info.jsEvent.stopPropagation();
        info.jsEvent.preventDefault();
    },

    firstDay: 1,
        titleFormat: function (date) {
        year = date.date.year;
        month = date.date.month + 1;

        return year + "년 " + month + "월";
        },
        
    });
    
    // data 받아온 부분
        const req = { hosIdx : idx };    
        fetch("/hospital/getInfo",{
            method : "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body : JSON.stringify(req),
            })
            .then((response) => response.json())
            .then((data) => {
                const resInfo = data.result;
                // console.log(resInfo);
                if(resInfo.length<1){
                    return alert("예약 정보가 없습니다.");
                }
                else{
                    console.log(resInfo);
                    for(var i=0; i<resInfo.length; i++)
                    {
                        let date = resInfo[i].Date;
                        // console.log(date);
                        let time = resInfo[i].Time;
                        let str = date.split('T',1);
                        let str2 = [str,time].join('T');
                        localStorage.setItem(resInfo[i].userName,resInfo[i].userNum);
                        // console.log(str2);
                        // event 달력에 표시
                        calendar.addEvent({
                            title:resInfo[i].userName,
                            start:str2
                        })
                        
                    }
                    
                }
                
            });calendar.render();
    }
    
    printIdx();
    
});



function refreshPage(){
    window.location.reload();
} 