const express = require('express')
const app = express()
const port = 5000

const config = require('./config/key')

const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const { User } = require('./models/User')

// body-parser를 앱 내에서 사용하려면 다음과 같이 작성
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json());

mongoose.connect(config.mongoURI, {
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
}).then(() => console.log('MongoDB Connected...'))
    .catch(err => console.log(err))


app.get('/', (req, res) => res.send('Hello world!'))

// register router
app.post('/register', (req, res) => {
    const user = new User(req.body)

    // db에 user를 저장
    user.save((err, userInfo) => {
        if(err) return res.json({ success: false, err })
        return res.status(200).json({
            success: true
        })
    })
})

// login router
app.post('/login', (req, res) => {
    // 1. 사용자에게 받은 이메일이 디비에 있는지 조회
    User.findOne({ email: req.body.email }, (err, user) => {
        if(!user) {
            return res.json({
                loginSuccess: false,
                message: "제공된 이메일에 해당하는 유저가 없습니다."
            })
        }
        // 디비에 사용자의 이메일이 있을 경우 => password 같은지 체크
        user.comparePassword(req.body.password, (err, isMatch) => {
            if(!isMatch)
                return res.json({ loginSuccess: false, message: "비밀번호가 틀렸습니다." })
            // 비밀번호까지 맞다면 토큰을 생성하기
            return res.json({ loginSuccess: true })
            // user.generateToken((err, user) => { 
            // })
        })
    })
})

app.listen(port, () => console.log(`Example app listening on port ${port}`))