module.exports = function(app){
    const index = require("../controllers/indexController");
    const jwtMiddleware = require("../../config/jwtMiddleware");

    //라우터 정의
    //app.HTTP메소드(uri, 컨트롤러 콜백함수)
    app.get("/signup", index.output.signup);
    app.get("/login",index.output.login);
    app.get("/reservation",index.output.reservation);


    //로그인
    app.post("/login",index.process.createJwt);
    //회원가입 
    app.post("/signup",index.process.signup);
    
    //로그인 유지, 토큰 검증
    app.get("/jwt", jwtMiddleware, index.readJwt);
    app.post("/getInfo", index.getInfo);
    //유저조회
    //app.get("/users", index.readUsers);
};