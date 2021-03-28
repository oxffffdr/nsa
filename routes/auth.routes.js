const {Router} =require('express');
const {check, validationResult} = require('express-validator')
const router = Router()
const jwt = require('jsonwebtoken')
const bccrypt = require('bcryptjs')
const config = require('config')
const User = require('../models/User')

router.post('/register', 
    [
        check('email',"не корректный e-mail").isEmail(), 
        check('password',"min length 6 symbols" ).isLength({min: 6})
    ], 
    async (req,res)=>{
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()){
            return res.status(400).json({
                                            errors: errors.array(),
                                            message: "Не коррестные данные при регистрации..."
                                        })
        }

        const {email, password} = req.body

        const candidate = await User.findOne({email})
        
        if (candidate) {
           return res.status(400).json({message: "Такой пользователь уже существует !!!"})
        }

        const hashPsw = await bccrypt.hash(password, 12)
        const user = new User({email, password: hashPsw})

        await user.save()

        res.status(201).json({message: "User has been created..."})

    } catch(e) {
        res.status(500).json({massage:"Register: Something goes wrong...",info: e.message})
    }
})

router.post('/login', 
[
    check('email',"не корректный e-mail").normalizeEmail().isEmail(), 
    check('password',"Enter password" ).exists()
],
async (req,res)=>{
try {
    const errors = validationResult(req)

        if (!errors.isEmpty()){
            return res.status(400).json({
                                            errors: errors.array(),
                                            message: "Login: Не верные данные при входе в систему!"
                                        })
        }
        
        const {email, password} = req.body

        const user = await User.findOne({email})

        if (!user) {
            res.status(400).json({message:"Пользователь не найден..."})
        }

        const isMathch = await bccrypt.compare(password,user.password)

        if (!isMathch) {
            res.status(400).json({message:"Не правильный пароль..."})
        }

        const token = jwt.sign(
            {userId: user.id},
            config.get('jwtSecret'),
            {expiresIn: '1h'}
        )
        res.json({token, userId: user.id})

} catch (e) {
    res.status(500).json({massage:"Loginning: Something goes wrong...", info: e.message})
}
})

module.exports = router;