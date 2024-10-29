import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from'jsonwebtoken';
import { GenerateToken } from "../middlewares/token.js";
// import bcrypt from "bcrypt";
class userController{
  static async registerUser(req,res){
    try {
        const {name, email, password} = req.body;
        if(!name || !email || !password){
          return res.status(400).json({msg: "Please fill all fields"})
        }
        const existingUser = await User.findOne({email});
        if(existingUser){
          return res.status(400).json({msg: "User already exists"})
        }
        if(password.length < 8){
          return res.status(400).json({message: "Password should be at least 8 characters long"})
        }
        const hashPassword = await bcrypt.hash(password,10)
        const newUser = new User({name,email,password})
        await newUser.save()
        return res.status(200).json({msg: "User registered successfully", data: newUser})
    } catch (error) {
        return res.status(400).json({msg:error.msg})
    }
  }
  static async loginUser(req,res){
    try {
        const {email, password} = req.body;
        if(!email ||!password){
          return res.status(400).json({msg: "Please fill all fields"})
        }
        const user = await User.findOne({email});
        if(!user){
          return res.status(400).json({msg: "User not found"})
        }
        const isMatch = await bcrypt.compare(password,user.password);
        if(!isMatch){
          return res.status(400).json({msg: "Incorrect password"})
        }
        const payload = {
          user:{
            id: user.id,
            role: user.role
          }
        }
        const AccessToken = await GenerateToken(payload);
        return res.json({msg: "User logged in successfully", AccessToken})
    } catch (error) {
        return res.status(400).json({msg: error.msg})
    }
  }
  static async forgotPassword(req,res){
    try {
        const {email,newPassword} = req.body;
        if(!email && !newPassword){
          return res.status(400).json({msg: "Please fill all fields"})
        }
       const CheckEmail = await User.findOne({email})
       if(!CheckEmail){
         return res.status(400).json({msg: "User not found"})
       }
       const hashPassword = await bcrypt.hash(newPassword,10)
       const newData = {
        ...req.body,
         password: hashPassword
       };
       const user = await User.findByIdAndUpdate(
         CheckEmail._id,
        {$set:newData},
         {new: true}
       )
       if(!user){
         return res.status(400).json({msg: "User not found"})
       }
      //  const {password,...others }=  user._doc
        return res.status(200).json({msg: "Password reset successfully", user})
    } catch (error) {
        return res.status(400).json({msg: error.msg})
    }
  }
  static async getAllUsers(req,res){
    try {
      const users = await User.find();
      return res.status(200).json({msg: "All users", users})
    } catch (error) {
      return res.status(400).json({msg: error.msg})
    }
  }
  static async updatePassword(req, res){
    try {
      const {email,oldPassword,newPassword} = req.body;
      if(!email ||!oldPassword ||!newPassword){
        return res.status(400).json({msg: "Please fill all fields"})
      }
      const user = await User.findOne({email});
      if(!user){
        return res.status(400).json({msg: "User not found"})
      }
      const isMatch = await bcrypt.compare(oldPassword,user.password);
      if(!isMatch){
        return res.status(400).json({msg: "Incorrect password"})
      }
      const hashPassword = await bcrypt.hash(newPassword,10)
      const newData = {
       ...req.body,
       password: hashPassword
      };
      const updatedUser = await User.findByIdAndUpdate(
        user._id,
       {$set:newData},
         {new: true}
      )
      if(!updatedUser){
        return res.status(400).json({msg: "User not found"})
      }
      return res.status(200).json({msg: "Password updated successfully", user: updatedUser})
    } catch (error) {
      return res.status(400).json({msg:error.message})
    }
  }
}
export default userController;