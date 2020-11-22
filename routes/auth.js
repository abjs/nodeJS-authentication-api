const express = require('express');
const router = express.Router();
const createError = require('http-errors')
const User = require('../Model/User.model')
const { authSchema } = require('../Model/validation_schema')
const { signAccessToke,signRefreshToken,verifyRefreshToken } = require('../helpers/jwt_Helper')



router.post('/register', async (req, res, next) => {
    //   //  console.log(req.body)
    //     // res.send("auth register is working")
    try {
        const result = await authSchema.validateAsync(req.body)
        const doesExist = await User.findOne({ email: result.email });
        if (doesExist) throw createError.Conflict(`${result.email} already exists`)
        const doesExistUser = await User.findOne({ username: result.username })
        if (doesExistUser) throw createError.Conflict(`${result.username} already exists takern`)

        const user = new User(result)
        const savedUsers = await user.save()
        const accessToken = await signAccessToke(savedUsers.id)
        const refreshToken = await signRefreshToken(savedUsers.id)
        res.send({accessToken,refreshToken}) 
    } catch (error) {
        if (error.isJoi === true) {
            error.status = 422; 
        }
        next(error)
    }

    //res.send(username + ':' + email + ':' + password);

})

router.post('/login', async (req, res, next) => {
    // res.send("auth login is working")
    try {
        const result = await authSchema.validateAsync(req.body)
        // res.send(result)
        const user = await User.findOne({ username: result.username })
        if (!user) throw createError.NotFound("User not registered")
        const email = await User.findOne({ email: result.email });
        if (!email) throw createError.NotFound("Invalid infomations")
        const isMatch = await user.isValidPassword(result.password)
        if (!isMatch) throw createError.Unauthorized("Uaer Name or Password incorrect")
        const accessToken = await signAccessToke(user.id)
        const refreshToken = await signRefreshToken(user.id)

        res.send({accessToken,refreshToken})

    } catch (error) {
        if (error.isJoi === true) return (next(createError.BadRequest("Invalid Authorization ")))
        next(error)
    }
    
})

router.get('/', (req, res) => {
    res.send("auth root is working")
})

router.delete('/logout', async (req, res) => {
    res.send("auth logout is working")
})


router.post('/refresh-token', async (req, res, next) => {
    // res.send(req.body.refreshToken)

    try {
        const {refreshToken} = req.body;
        if (!refreshToken) throw createError.BadRequest()
        const userId = await verifyRefreshToken(refreshToken)
        const accessToken = await signAccessToke(userId)
        const refToken = await signRefreshToken(userId)
        res.send({accessToken:accessToken,refreshToken:refToken})
        
    } catch (error) {
        next(error)
    }
})

router.get('/test', (req, res) => {
    res.send("auth test Working")
})





module.exports = router;
