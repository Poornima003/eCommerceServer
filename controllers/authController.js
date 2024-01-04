const { hashPassword, comparePassword } = require("../helpers/authHelper");
const userModel = require("../models/userModel");
const orderModel = require("../models/orderModel")
const JWT = require('jsonwebtoken')

exports.registerController = async (req, res) => {
    try {
        const { name, email, password, phone, address, answer } = req.body

        //validation
        if (!name || !email || !password || !phone || !address || !answer) {
            return res.send({ message: 'This field is required' })
        }

        //check user
        const existingUser = await userModel.findOne({ email })

        //existing user
        if (existingUser) {
            return res.status(200).send({
                success: false,
                message: 'Already registered..Please login',
            })
        }

        //register user
        const hashedPassword = await hashPassword(password)
        //save
        const user = await new userModel({ name, email, phone, address, password: hashedPassword, answer }).save()
        res.status(201).send({
            success: true,
            message: 'User registered successfully..',
            user
        })


    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in register",
            error
        })
    }
}

//post login

exports.loginController = async (req, res) => {
    try {
        const { email, password } = req.body
        //validation
        if (!email || !password) {
            return res.status(404).send({
                success: false,
                message: 'invalid email or password'
            })
        }
        //check user
        const user = await userModel.findOne({ email })
        if (!user) {
            return res.status(404).send({
                success: false,
                message: 'Email not registered'
            })
        }
        const match = await comparePassword(password, user.password)
        if (!match) {
            return res.status(200).send({
                success: false,
                message: 'Invalid Password'
            })
        }
        //token
        const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' })
        res.status(200).send({
            success: true,
            message: 'Login successfull',
            user: {
                name: user.name,
                email: user.email,
                phone: user.phone,
                address: user.address,
                role: user.role
            },

            token,
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in login',
            error
        })
    }
}

//forgotPasswordController 

exports.forgotPasswordController = async (req, res) => {
    try {
        const { email, answer, newPassword } = req.body
        if (!email) {
            res.status(400).send({
                message: 'Email is required'
            })
        }
        if (!answer) {
            res.status(400).send({
                message: 'Answer is required'
            })
        }
        if (!newPassword) {
            res.status(400).send({
                message: 'New password is required'
            })
        }
        //check
        const user = await userModel.findOne({ email, answer })
        //validate
        if (!user) {
            return res.status(404).send({
                success: false,
                message: 'Wrong email or Answer'
            })
        }
        const hashed = await hashPassword(newPassword)
        await userModel.findByIdAndUpdate(user._id, { password: hashed })
        res.status(200).send({
            success: true,
            message: 'Password reset Successfull',
        })

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Something went wrong',
            error
        })
    }
}

//test controller
exports.testController = async (req, res) => {
    res.send("Protected route");
}

//update profile
exports.updateProfileController = async (req, res) => {
    try {
        const { name, email, password, address, phone } = req.body
        const user = await userModel.findById(req.user._id)
        //password
        if (password && password.length < 6) {
            return res.json({ error: 'Password is required and should be 6 characters long' })
        }
        const hashedPassword = password ? await hashPassword(password) : undefined
        const updatedUser = await userModel.findByIdAndUpdate(req.user._id, {
            name: name || user.name,
            password: hashedPassword || user.password,
            phone: phone || user.phone,
            address: address || user.address
        }, { new: true })
        res.status(200).send({
            success: true,
            message: 'Profile updated successfully',
            updatedUser
        })
    } catch (error) {
        console.log(error);
        res.status(400).send({
            success: false,
            message: 'Error while update profile',
            error
        })
    }
}

//orders
exports.getOrdersController = async (req, res) => {
    try {
        const orders = await orderModel.find({ buyer: req.user._id }).populate("products", "-photo").populate("buyer", "name")
        res.json(orders)
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Something went wrong',
            error
        })
    }
}

//orders
exports.getAllOrdersController = async (req, res) => {
    try {
        const orders = await orderModel.find({}).populate("products", "-photo").populate("buyer", "name").sort({ createdAt: "-1" })
        res.json(orders)
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Something went wrong',
            error
        })
    }
}

//order status
exports.orderStatusController = async (req, res) => {
    try {
        const { orderId } = req.params
        const { status } = req.body
        const orders = await orderModel.findByIdAndUpdate(orderId, { status }, { new: true })
        res.json(orders)

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error while updating order',
            error
        })
    }
}
