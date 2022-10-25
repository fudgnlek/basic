"use strict";

// 마커를 담을 배열입니다
var markers = [];   
var hosIdx;
var mapContainer = document.getElementById('map'), // 지도를 표시할 div 
    mapOption = {
        center: new kakao.maps.LatLng(37.56687, 126.97804), // 지도의 중심좌표
        level: 3, // 지도의 확대 레벨
        mapTypeId : kakao.maps.MapTypeId.ROADMAP // 지도종류
    }; 

// 지도를 생성한다 
var map = new kakao.maps.Map(mapContainer, mapOption); 

// 마커를 클릭하면 장소명을 표출할 인포윈도우 입니다
var infowindow = new kakao.maps.InfoWindow({zIndex:1});




// 장소 검색 객체를 생성합니다
var ps = new kakao.maps.services.Places(map); 

const keyword = window.localStorage.getItem('keyword');
console.log(keyword);

const title = document.querySelector("#h1");
title.innerText = keyword;




if(navigator.geolocation){
    // GeoLocation을 이용해서 접속 위치를 얻어옵니다
    navigator.geolocation.getCurrentPosition(function(position) {
        
        var lat = position.coords.latitude, // 위도
            lon = position.coords.longitude; // 경도
        
        var locPosition = new kakao.maps.LatLng(lat, lon), // 마커가 표시될 위치를 geolocation으로 얻어온 좌표로 생성합니다
            message = '<div style="padding:5px;font-size:12px;">현재 위치</div>'; // 인포윈도우에 표시될 내용입니다
        
        // 마커와 인포윈도우를 표시합니다
        displayMarker1(locPosition, message);

        // 키워드로 장소 검색
        ps.keywordSearch(keyword,placesSearchCB,{
            location: new kakao.maps.LatLng(lat,lon)
        });

        // 키워드 검색 완료 시 호출되는 콜백함수 입니다
        function placesSearchCB (data, status, pagination) {
            if (status === kakao.maps.services.Status.OK) {

                // 정상적으로 검색이 완료됐으면
                // 검색 목록과 마커를 표출합니다
                displayPlaces(data,lat,lon);
                

                //sorting(data,lat,lon);

                // 페이지 번호를 표출합니다
                displayPagination(pagination);
        
            } else if (status === kakao.maps.services.Status.ZERO_RESULT) {
        
                alert('검색 결과가 존재하지 않습니다.');
                return;
        
            } else if (status === kakao.maps.services.Status.ERROR) {
        
                alert('검색 결과 중 오류가 발생했습니다.');
                return;
        
            }
        }

    });

    
}
else{
    var locPosition = new kakao.maps.LatLng(33.450701, 126.570667),    
        message = 'geolocation을 사용할수 없어요..'
        
    displayMarker1(locPosition, message);
}



// 검색 결과 목록과 마커를 표출하는 함수입니다
function displayPlaces(places,lat,lon) {

    var listEl = document.getElementById('placesList'), 
    menuEl = document.getElementById('menu_wrap'),
    fragment = document.createDocumentFragment(), 
    bounds = new kakao.maps.LatLngBounds(), 
    listStr = '';



    // 검색 결과 목록에 추가된 항목들을 제거합니다
    removeAllChildNods(listEl);

    // 지도에 표시되고 있는 마커를 제거합니다
    removeMarker();

    for ( var i=0; i<places.length; i++ ) {

        // 마커를 생성하고 지도에 표시합니다
        var placePosition = new kakao.maps.LatLng(places[i].y, places[i].x),
            marker = addMarker(placePosition, i), 
            itemEl = getListItem(i, places[i]); // 검색 결과 항목 Element를 생성합니다

            
        // 검색된 장소 위치를 기준으로 지도 범위를 재설정하기위해
        // LatLngBounds 객체에 좌표를 s
        bounds.extend(placePosition);

        // 마커와 검색결과 항목에 mouseover 했을때
        // 해당 장소에 인포윈도우에 장소명을 표시합니다
        // mouseout 했을 때는 인포윈도우를 닫습니다
        (function(marker, title) {
            kakao.maps.event.addListener(marker, 'mouseover', function() {
                displayInfowindow(marker, title);
            });

            kakao.maps.event.addListener(marker, 'mouseout', function() {
                infowindow.close();
            });

            itemEl.onmouseover =  function () {
                displayInfowindow(marker, title);
            };

            itemEl.onmouseout =  function () {
                infowindow.close();
            };

            // 예약 팝업창 뜨도록 하는 부분
            itemEl.onclick = function (event) {      
                var c = localStorage.getItem('num');
                
                if(c!=2){
                    alert('날짜와 시간을 먼저 선택해주세요');
                    return false;
                }

                var name = event.currentTarget.querySelector('.name');
                var address = event.currentTarget.querySelector('#address');
                console.log(name.innerHTML);
                console.log(address.innerHTML);
                var Hname = name.innerHTML;
                var Haddress = address.innerHTML;
                window.localStorage.setItem('name', Hname);
                window.localStorage.setItem('address', Haddress);
                let contents = `
                <div style="font-weight: bold; font-size:25px; margin-bottom: 5px; text-align:center; color:black">`
                    + Hname + `
                </div>
                <div style=" font-size:15px; margin-bottom: 35px; text-align:center; color:gray"> < &nbsp;`
                    + Haddress + `&nbsp; >
                </div>
                <p> 이름 : <input type="text" id="name" placeholder="이름" style="margin-bottom:13px" > </p> 
                <p> 번호 : <input type="tel" id="phone" placeholder="010-0000-0000" style="margin-bottom:13px"> </p>
                <p> 생년월일 : <input type="date" id="birth" style="margin-bottom:13px"> </p>
                <div> <button id="reservation" style="background-color:black; color: white; border-radius: 5px; width: 100px; margin-top: 10px; margin-left: 76px"> 예약하기 </button></div>
                `
                
                // database 
                var hosName = name.innerHTML;
                const request = {
                    hosName : hosName
                }
                fetch("/user/gethosIdx",{
                    method:"POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body : JSON.stringify(request),
                })
                .then((response) => response.json())
                .then((data) => {
                    // const res = data.code;
                    // return res;
                    if(data.code==410){
                        alert("등록된 병원이 아닙니다. 예약이 불가합니다.");
                        return false;
                    }
                    else{
                        hosIdx = data.result; 
                        console.log(hosIdx)
                        $("#popup").html(contents);
                        $("#popup").bPopup({
                            speed: 650,
                            transition: "slideIn",
                            transitionClose: "slideBack",
                            position: [($(document).width()-300)/2,120]
                        });
                    }
                    
                });
            };
            
        })(marker, places[i].place_name);

        fragment.appendChild(itemEl);
    }

    // 검색결과 항목들을 검색결과 목록 Element에 추가합니다
    listEl.appendChild(fragment);
    menuEl.scrollTop = 0;

    console.log(places);

    sorting(places,lat,lon);

    // 검색된 장소 위치를 기준으로 지도 범위를 재설정합니다
    map.setBounds(bounds);
}

$(document).on('click','#reservation',function(){
    const userIdx = window.localStorage.getItem('userIdx');
    var name = window.localStorage.getItem('name');
    var address = window.localStorage.getItem('address');
    var username = document.getElementById('name');
    var usernum = document.getElementById('phone');
    var userbirth = document.getElementById('birth');
    var date = localStorage.getItem('date');
    var time = localStorage.getItem('time');

    let newContent = `
                <h3 style="font-weight: bold; font-size:27px; margin-bottom: 5px; text-align:center; color:black"> 예약 완료 </h3>
                <div style="font-size:25px; margin-bottom: 5px; text-align:center; color:black">`
                    + name + `
                </div>
                <div style=" font-size:15px; margin-bottom: 35px; text-align:center; color:gray"> < &nbsp;`
                    + address + `&nbsp; >
                </div>
                <div style=" font-size:15px; margin-bottom: 5px; text-align:center; color:black">
                <p> 이름 : `+ username.value +
                `<p> 번호 : `+ usernum.value +
                `<p> 날짜 : `+ date + 
                `<p> 시간 : `+ time +
                `</div>
                <div> <button id="end" style="background-color:black; color: white; border-radius: 5px; width: 100px; margin-top: 10px; margin-left: 76px"> 확인 </button></div>
                `

    const req2 = { 
        hosIdx : hosIdx, 
        Date: date,
        Time : time,
        userIdx : userIdx,
        userName : username.value,
        userNum : usernum.value,
        userBirth : userbirth.value
    };
        console.log(req2);
    
    fetch("/user/reservation",{
    method : "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body : JSON.stringify(req2),
    })
    .then((response) => response.json())
    .then((data) => {
        if(data.code!=200){
            alert("해당 시간에 예약이 불가능합니다. 다른 시간을 선택해주세요");
            location.replace('/hospital');
            }
            else{
                alert('예약 완료');
                $("#popup").html(newContent);
                
            }
        //    const resIdx = data.result.resIdx;
        //    console.log(resIdx);
        
    });


    
    
});

$(document).on('click','#end',function(){
    location.replace('/user/main');
    window.localStorage.removeItem('name');
    window.localStorage.removeItem('address');
    window.localStorage.removeItem('date');
    window.localStorage.removeItem('time');
    window.localStorage.removeItem('num');
})

$(window).on('beforeunload', function(){
    window.localStorage.removeItem('name');
    window.localStorage.removeItem('address');
    window.localStorage.removeItem('date');
    window.localStorage.removeItem('time');
    window.localStorage.removeItem('num');
    
})

// 검색결과 항목을 Element로 반환하는 함수입니다
function getListItem(index, places) {
    
    var el = document.createElement('li'),
    itemStr = '<span class="markerbg marker_' + (index+1) + '"></span>' +
                '<div class="info">' +
                '   <h5 class="name">' + places.place_name + '</h5>';

    if (places.road_address_name) {
        itemStr += '    <span>' + places.road_address_name + '</span>' +
                    '   <span class="jibun gray" id="address">' +  places.address_name  + '</span>';
    } else {
        itemStr += '    <span id="address">' +  places.address_name  + '</span>'; 
    }

    itemStr += '  <span class="tel">' + places.phone  + '</span>' +
                '</div>';           

    el.innerHTML = itemStr;
    el.className = 'item';

    
    return el;
}



// 지도에 마커와 인포윈도우를 표시하는 함수입니다
function displayMarker1(locPosition, message) {
    
    // 마커를 생성하고 지도에 표시합니다
    var marker = new kakao.maps.Marker({
        map: map,
        position: locPosition
    });

    // 마커에 클릭이벤트를 등록합니다
    kakao.maps.event.addListener(marker, 'click', function() {
        // 마커를 클릭하면 장소명이 인포윈도우에 표출됩니다
        infowindow.setContent(message);
        infowindow.open(map, marker);
    });
    
    
    // 지도 중심좌표를 접속위치로 변경합니다
    map.setCenter(locPosition);      
}

// 지도에 마커를 표시하는 함수입니다
function displayMarker(place) {
    
    // 마커를 생성하고 지도에 표시합니다
    var marker = new kakao.maps.Marker({
        map: map,
        position: new kakao.maps.LatLng(place.y, place.x) 
    });

    // 마커에 클릭이벤트를 등록합니다
    kakao.maps.event.addListener(marker, 'click', function() {
        // 마커를 클릭하면 장소명이 인포윈도우에 표출됩니다
        infowindow.setContent('<div style="padding:5px;font-size:12px;">' + place.place_name + '</div>');
        infowindow.open(map, marker);
    });

    
}

// 검색결과 목록의 자식 Element를 제거하는 함수입니다
function removeAllChildNods(el) {   
    while (el.hasChildNodes()) {
        el.removeChild (el.lastChild);
    }
}

// 지도 위에 표시되고 있는 마커를 모두 제거합니다
function removeMarker() {
    for ( var i = 0; i < markers.length; i++ ) {
        markers[i].setMap(null);
    }   
    markers = [];
}

// 마커를 생성하고 지도 위에 마커를 표시하는 함수입니다
function addMarker(position, idx, title) {
    var imageSrc = 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_number_blue.png', // 마커 이미지 url, 스프라이트 이미지를 씁니다
        imageSize = new kakao.maps.Size(36, 37),  // 마커 이미지의 크기
        imgOptions =  {
            spriteSize : new kakao.maps.Size(36, 691), // 스프라이트 이미지의 크기
            spriteOrigin : new kakao.maps.Point(0, (idx*46)+10), // 스프라이트 이미지 중 사용할 영역의 좌상단 좌표
            offset: new kakao.maps.Point(13, 37) // 마커 좌표에 일치시킬 이미지 내에서의 좌표
        },
        markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imgOptions),
            marker = new kakao.maps.Marker({
            position: position, // 마커의 위치
            image: markerImage 
        });

    marker.setMap(map); // 지도 위에 마커를 표출합니다
    markers.push(marker);  // 배열에 생성된 마커를 추가합니다

    return marker;
}

// 검색결과 목록 또는 마커를 클릭했을 때 호출되는 함수입니다
// 인포윈도우에 장소명을 표시합니다
function displayInfowindow(marker, title) {
    var content = '<div style="padding:5px;z-index:1;">' + title + '</div>';

    infowindow.setContent(content);
    infowindow.open(map, marker);
}

// 검색결과 목록 하단에 페이지번호를 표시는 함수입니다
function displayPagination(pagination) {
    var paginationEl = document.getElementById('pagination'),
        fragment = document.createDocumentFragment(),
        i; 

    // 기존에 추가된 페이지번호를 삭제합니다
    while (paginationEl.hasChildNodes()) {
        paginationEl.removeChild (paginationEl.lastChild);
    }

    for (i=1; i<=pagination.last; i++) {
        var el = document.createElement('a');
        el.href = "#";
        el.innerHTML = i;

        if (i===pagination.current) {
            el.className = 'on';
        } else {
            el.onclick = (function(i) {
                return function() {
                    pagination.gotoPage(i);
                }
            })(i);
        }

        fragment.appendChild(el);
    }
    paginationEl.appendChild(fragment);
}

// ---------------- 거리순 정렬 관련 코드 ---------------



function distance(lat1, lon1, lat2, lon2, unit) {
    var radlat1 = Math.PI * lat1/180;
    var radlat2 = Math.PI * lat2/180;
    var radlon1 = Math.PI * lon1/180;
    var radlon2 = Math.PI * lon2/180;
    var theta = lon1-lon2;
    var radtheta = Math.PI * theta/180;
    var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);

    dist = Math.acos(dist);
    dist = dist * 180/Math.PI;
    dist = dist * 60 * 1.1515;
    if (unit=="K") { dist = dist * 1.609344 }
    if (unit=="N") { dist = dist * 0.8684 }
    return dist;
}

function sorting(places,latitude,longitude){
    var but = document.getElementById('bu1');
    but.addEventListener("click",function(){
        for(let i=0; i<places.length; i++)
        {
            let distance2 = distance(latitude,longitude,places[i].y,places[i].x,'k');
            places[i].distance2 = distance2;
        }

        let newList = places.sort(function(a,b){
            if(a.distance2 > b.distance2)
            {
                return 1;
            }
            if(a.distance2 < b.distance2){
                return -1;
            }
            return 0;
        });

        console.log(newList);

        var listEl = document.getElementById('placesList'), 
        menuEl = document.getElementById('menu_wrap'),
        fragment1 = document.createDocumentFragment(), 
        bounds = new kakao.maps.LatLngBounds(), 
        listStr = '';

        // 검색 결과 목록에 추가된 항목들을 제거합니다
        removeAllChildNods(listEl);

        // 지도에 표시되고 있는 마커를 제거합니다
        removeMarker();

        for ( var i=0; i<newList.length; i++ ) {

            // 마커를 생성하고 지도에 표시합니다
            var placePosition = new kakao.maps.LatLng(newList[i].y, newList[i].x),
                marker = addMarker(placePosition, i);
            
            var itemEl = getListItem(i, newList[i]); // 검색 결과 항목 Element를 생성합니다
            
            // 검색된 장소 위치를 기준으로 지도 범위를 재설정하기위해
            // LatLngBounds 객체에 좌표를 추가합니다
            bounds.extend(placePosition);

            // 마커와 검색결과 항목에 mouseover 했을때
            // 해당 장소에 인포윈도우에 장소명을 표시합니다
            // mouseout 했을 때는 인포윈도우를 닫습니다
            (function(marker, title) {
                kakao.maps.event.addListener(marker, 'mouseover', function() {
                    displayInfowindow(marker, title);
                });

                kakao.maps.event.addListener(marker, 'mouseout', function() {
                    infowindow.close();
                });

                itemEl.onmouseover =  function () {
                    displayInfowindow(marker, title);
                };

                itemEl.onmouseout =  function () {
                    infowindow.close();
                };

                // 예약 팝업창 뜨도록 하는 부분
                itemEl.onclick = function (event) {      
                    var c = localStorage.getItem('num');
                    
                    if(c!=2){
                        alert('날짜와 시간을 먼저 선택해주세요');
                        return false;
                    }

                    var name = event.currentTarget.querySelector('.name');
                    var address = event.currentTarget.querySelector('#address');
                    console.log(name.innerHTML);
                    console.log(address.innerHTML);
                    var Hname = name.innerHTML;
                    var Haddress = address.innerHTML;
                    window.localStorage.setItem('name', Hname);
                    window.localStorage.setItem('address', Haddress);
                    let contents = `
                    <div style="font-weight: bold; font-size:25px; margin-bottom: 5px; text-align:center; color:black">`
                        + Hname + `
                    </div>
                    <div style=" font-size:15px; margin-bottom: 35px; text-align:center; color:gray"> < &nbsp;`
                        + Haddress + `&nbsp; >
                    </div>
                    <p> 이름 : <input type="text" id="name" placeholder="이름" style="margin-bottom:13px" > </p> 
                    <p> 번호 : <input type="tel" id="phone" placeholder="010-0000-0000" style="margin-bottom:13px"> </p>
                    <p> 생년월일 : <input type="date" id="birth" style="margin-bottom:13px"> </p>
                    <div> <button id="reservation" style="background-color:black; color: white; border-radius: 5px; width: 100px; margin-top: 10px; margin-left: 76px"> 예약하기 </button></div>
                    `
                    
                    // database 
                    var hosName = name.innerHTML;
                    const request = {
                        hosName : hosName
                    }
                    fetch("/user/gethosIdx",{
                        method:"POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body : JSON.stringify(request),
                    })
                    .then((response) => response.json())
                    .then((data) => {
                        // const res = data.code;
                        // return res;
                        if(data.code==410){
                            alert("등록된 병원이 아닙니다. 예약이 불가합니다.");
                            return false;
                        }
                        else{
                            hosIdx = data.result; 
                            console.log(hosIdx)
                            $("#popup").html(contents);
                            $("#popup").bPopup({
                                speed: 650,
                                transition: "slideIn",
                                transitionClose: "slideBack",
                                position: [($(document).width()-300)/2,120]
                            });
                        }
                        
                    });
                };
                
                })(marker, places[i].place_name);

                fragment1.appendChild(itemEl);
            }
            // 검색결과 항목들을 검색결과 목록 Element에 추가합니다
            listEl.appendChild(fragment1);
            menuEl.scrollTop = 0;

            // 검색된 장소 위치를 기준으로 지도 범위를 재설정합니다
            map.setBounds(bounds);
        })
    }


// 로그아웃 버튼 이벤트 연결
const btnSignOut = document.querySelector("#sign-out");
btnSignOut.addEventListener("click",signOut);

function refreshPage(){
    window.location.reload();
    //window.localStorage.clear();
    window.localStorage.removeItem('name');
    window.localStorage.removeItem('address');
    window.localStorage.removeItem('date');
    window.localStorage.removeItem('time');
    window.localStorage.removeItem('num');
} 

// 로그아웃
function signOut(event){
    localStorage.removeItem("x-access-token");
    location.replace("/user/login");
}

