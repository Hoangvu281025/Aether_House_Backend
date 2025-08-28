const express = require('express');
const User = require('../Modules/UserModules');
const bcrypt = require('bcrypt');
const router = express.Router();
 
// lấy tất cả
router.get('/', async (req , res) => {
    try {
        const users = await User.find();
        res.status(201).json(users);
    } catch (err) {
        res.status(400).json({
            message:"Lấy dữ liệu ko thành công",
            error: err.message
        })
    }
})

//thêm mới user
router.post('/', async (req , res) => {
    try {
        const {username , password} = req.body;
        
        const checkUsername = await User.findOne({username});
        if (checkUsername) {
            return res.status(400).json({
                message: "Tài khoản đã tồn tại"
            });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            username,
            password: hashedPassword
        });
        await newUser.save();
        res.status(201).json({
            message:"đăng ký thành công"
        })
    } catch (error) {
        res.status(400).json({
            message:"đăng ký ko thành công"
        })
    }
})

//cập nhật user
router.put('/', (req , res) => {
    res.send('all user');
})

//xóa 1 user
router.delete('/', (req , res) => {
    res.send('all user');
})


module.exports = router