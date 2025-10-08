// const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const UserModel = require('../Models/userModel');

const RoleModel = require('../Models/roleModel');
// const cloudinary = require('../config/cloudinary');
const sendMail = require("../utils/sendMail");
// const adminNotifyEmail = "phamhoangvu7373@gmail.com";
const crypto = require("crypto");


const authController = {
   

    loginAdmin: async (req, res) => {
        try {
            const { email } = req.body;

            if (!email) return res.status(400).json({ message: "Email is required" });
            

            let user = await UserModel.findOne({ email }).populate('role_id', 'name');

            if (user && user.isActive === false) {
                return res.status(403).json({ message: "Your account has been disabled" });
            }
            

            if (!user) {
                const userRole = await RoleModel.findOne({ name: 'admin' });
                user = new UserModel({
                    email,
                    avatar: {
                        url:'https://res.cloudinary.com/depbw3f5t/image/upload/v1759648822/47b43a185143840ba5ca7160a073a361_qqhceb.jpg',
                        isDefault: true
                    },
                    role_id: userRole._id,
                    
                });
                await user.save();
            }
            
            const checkRole = user.role_id.name;
            if (checkRole === "user") return res.status(500).json({ message: "Role 'user' not configured" });

            
            const otp = crypto.randomInt(100000, 999999);
            user.otp = otp;
            user.otpExpires = Date.now() + 15 * 60 * 1000; // 15 phút
            await user.save();

           await sendMail({
                to: email,
                subject: "Mã xác thực tài khoản của bạn",
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 40px 20px; text-align: center; border: 1px solid #eee; border-radius: 10px;">
                        <div style="margin-bottom: 30px;">
                            <img src="https://res.cloudinary.com/depbw3f5t/image/upload/v1757224196/Untitled-1_nru9av.png" 
                                alt="Logo" 
                                style="max-width: 200px;">
                        </div>

                        <!-- Nội dung -->
                        <h2 style="color: #000; margin-bottom: 20px;">Your verification code</h2>
                        <h1 style="letter-spacing: 8px; font-size: 36px; margin: 20px 0; color: #333; font-weight: bold;">
                            ${otp}
                        </h1>
                        <p style="font-size: 14px; color: #555;">
                            This code can only be used once. It expires in 15 minutes.
                        </p>
                    </div>
                `
            });


            res.status(200).json({ message: "OTP has been sent to your email" });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Internal server error" });
        }
    },

    loginClient: async (req, res) => {
        try {
            const { email } = req.body;

            if (!email) {
                return res.status(400).json({ message: "Email is required" });
            }
           

            let user = await UserModel.findOne({ email }).populate('role_id', 'name');
            const userRole = await RoleModel.findOne({ name: 'user' });
            // Nếu chưa có thì tạo mới user (trạng thái pending hoặc user mặc định)
            if (!user) {
                user = new UserModel({
                    email,
                    avatar: {url:'https://res.cloudinary.com/depbw3f5t/image/upload/v1758463486/AetherHouse/users/admin/gjmevtpfkk800qemilaz.jpg'},
                    role_id: userRole._id,
                    
                });
                await user.save();
            }
            const checkRole = user.role_id.name;
            if (checkRole === "admin") return res.status(500).json({ message: "Role 'user' not configured" });
            // Tạo OTP ngẫu nhiên (6 số)
            const otp = crypto.randomInt(100000, 999999);

            // Lưu OTP tạm vào user (có thể kèm thời gian hết hạn 5 phút)
            user.otp = otp;
            user.otpExpires = Date.now() + 15 * 60 * 1000; // 15 phút
            await user.save();

           await sendMail({
                to: email,
                subject: "Mã xác thực tài khoản của bạn",
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 40px 20px; text-align: center; border: 1px solid #eee; border-radius: 10px;">
                        <div style="margin-bottom: 30px;">
                            <img src="https://res.cloudinary.com/depbw3f5t/image/upload/v1757224196/Untitled-1_nru9av.png" 
                                alt="Logo" 
                                style="max-width: 200px;">
                        </div>

                        <!-- Nội dung -->
                        <h2 style="color: #000; margin-bottom: 20px;">Your verification code</h2>
                        <h1 style="letter-spacing: 8px; font-size: 36px; margin: 20px 0; color: #333; font-weight: bold;">
                            ${otp}
                        </h1>
                        <p style="font-size: 14px; color: #555;">
                            This code can only be used once. It expires in 15 minutes.
                        </p>
                    </div>
                `
            });


            res.status(200).json({ message: "OTP has been sent to your email" });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Internal server error" });
        }
    },


    verifyOtp: async (req, res) => {
        try {
            const { email, otp } = req.body;
            const user = await UserModel.findOne({ email }).populate('role_id', 'name');

            if (!user) return res.status(404).json({ message: "User not found" });
            if (user.otp !== otp || user.otpExpires < Date.now()) {
                return res.status(400).json({ message: "Invalid or expired OTP" });
            }

            // OTP đúng thì tạo accessToken
            const role = await RoleModel.findById(user.role_id).select("name").lean();
            const accessToken = jwt.sign(
            { id: user._id, role_id: user.role_id, role_name: role.name.toLowerCase() },
            process.env.JWT_ACCESS_KEY,
            { expiresIn: "10d" }
            );

            user.token = accessToken;
            // Xóa OTP sau khi dùng
            user.otp = undefined;
            user.otpExpires = undefined;
            await user.save();

            res.status(200).json({ accessToken, user });
        } catch (error) {
            res.status(500).json({ error: "Internal server error" });
        }
    },

    logout: async (req, res) => {
        try {
            const userId = req.user.id;
            const user = await UserModel.findById(userId);
            if (!user) return res.status(404).json({ message: "User not found" });
            user.token = undefined;
            await user.save();
            res.status(200).json({ message: "Logged out successfully" });
        }
        catch (error) {
            res.status(500).json({ error: "Internal server error" });
        }
    },
}








module.exports = {authController}
