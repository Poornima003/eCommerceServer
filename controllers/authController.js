const userModel = require("../models/userModel");


exports.registerController = async(req,res) => {
    try {
        const {name,email,password,phone,address} =req.body
        //validation

        if(!name || !email || !password || !phone || !address){
            return res.send({error:'This field is required'})
        }
        //existing user
            const user = await userModel.findOne

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            message:"Error in register",
            error
        })
    }
}

