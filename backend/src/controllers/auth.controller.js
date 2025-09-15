const userModel = require('../models/user.model')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { model } = require('mongoose')


async function registerUser(req, res) {
    const { fullName: { firstName, lastName }, email, password } = req.body

    const isUserAlreadyExists = await userModel.findOne({ email })
    if (isUserAlreadyExists) {
        res.status(400).json({ message: "User already Exists" })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await userModel.create({
        fullName: {
            firstName, lastName
        },
        email,
        password: hashedPassword
    })

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)
    res.cookie("token", token)

    res.status(201).json({
        message: "User registered sucessfully",
        user: {
            email: user.email,
            _id: user.id,
            fullName: user.fullName
        }
    })
}
async function loginUser(req, res) {
    const { email, password } = req.body

    const user = await userModel.findOne({ email })
    if (!user) {
        return res.status(400).json({ message: "Invalid email or password" })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
        return res.status(400).json({ message: "Invalid email or password" })
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)
    res.cookie("token", token)

    res.status(200).json({
        message: "User logged in sucessfully",
        user: {
            email: user.email,
            _id: user.id,
            fullName: user.fullName
        }
    })


}
async function logoutUser(req, res) {
    const user = req.body

    res.json({
        message: "user logged out successfully"
    })


}

module.exports = {
    registerUser,
    loginUser,
    logoutUser

}