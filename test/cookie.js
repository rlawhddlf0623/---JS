const express = require('express');
const cookieParser = require('cookie-parser');
const port = 8080;
const app = express();

// 쿠키 미들웨어 등록
app.use(cookieParser());

app.get('/', (req, res) => {
    res.send('hello');
});

// 쿠키 옵션 중 자주 사용하는 애들만 체크
// 실습에서는 maxAge로 사용할 거라서 expires는 일단 주석처리, path 주석처리
const cookieOption = {
    // true로 설정하면 클라이언트가 자바스크립트(document.cookie)로 쿠키를 조작하는 것이 불가능해진다.
    httpOnly: true,
    // 밀리초 단위로 만들어진 순간부터 30초 뒤에 만료된다.
    maxAge: 30000,
    // 날짜로 만료일을 정한다, GMT 시간 방식으로 작성해야 한다.   maxAge or expires 중 1개만 사용하면 된다.
    // expires: '2022-12-09T09:00:00',
    // localhost:8080 경로에서는 쿠키가 없지만, localhost:8080/a/* 경로로 접속을 하면 쿠키가 생성된다. /a/ 뒤에는 어떤 경로든지 상관없다.  default: '/' => default 생략 가능
    // path: '/a',
    // true로 설정하면 https 보안서버에만 적용된다.   default: false => default 생략 가능
    secure: false,
    // true로 설정하면 쿠키를 암호화한다.  default: false => default 생략 가능
    signed: false
}

app.get('/set', (req, res) => {
    // res.cookie('key', 'value', 옵션객체);
    // res.cookie('test', '1', {});
    // 바로 옵션을 작성해도 되고, 위에 처럼 변수를 설정한 후에 넣어줘도 된다.
    res.cookie('test', '1', cookieOption);
    res.send('쿠키 생성 성공');
});

app.get('/get', (req, res) => {
    // 쿠키는 클라이언트에 저장되어 있기 때문에 req로 받아와야한다.
    // req.cookies는 쿠키가 없어도 사용할 수 있다. 대신 undefined 값이다.
    console.log(req.cookies);
    // 디셔너리 형태라서 key를 이용해서 값을 가져올 수 있다.
    console.log(req.cookies.test);
    res.send(req.cookies);
});

app.listen(port, () => {
    console.log('server open: ', port);
});
