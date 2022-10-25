module.exports = function(app){
    const index = require("../controllers/indexController");
    const jwtMiddleware = require("../../config/jwtMiddleware");

    //라우터 정의
    //app.HTTP메소드(uri, 컨트롤러 콜백함수)
    app.get("/",index.output.basic);

    
    //로그인 유지, 토큰 검증 (hospital)
    app.get("/hospital/jwt", jwtMiddleware, index.readJwt);
    app.post("/hospital/getInfo", index.getInfo);

    //로그인 유지, 토큰 검증 (user)
    app.get("/user/jwt", jwtMiddleware, index.readJwt);

    app.post("/user/gethosIdx",index.process.getHosIdx);
    app.post("/user/reservation",index.process.reservation);

    app.post("/user/getResInfo", index.getResInfo);
};
