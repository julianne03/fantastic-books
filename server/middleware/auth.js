const { User } = require('../models/User');

let auth = (req, res, next) => {
    // 인증 처리하는 곳
    // 로그인 한 사용자 / 로그인 안 한 사용자

    // 클라이언트 쿠키에서 토큰 가져오기
    let token = req.cookies.x_auth;
    // token을 복호화하여 user._id 찾기
    User.findByToken(token, (err, user) => {
        if (err) throw err;
        if(!user) return res.json({ isAuth: false, error: true })

        req.token = token;
        req.user = user;
        next();
    })
    // user가 있으면 ok , 없으면 no
}

module.exports = { auth };