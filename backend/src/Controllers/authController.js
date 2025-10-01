// const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const UserModel = require('../Models/userModel');

const RoleModel = require('../Models/roleModel');
// const cloudinary = require('../config/cloudinary');
const sendMail = require("../utils/sendMail");
// const adminNotifyEmail = "phamhoangvu7373@gmail.com";
const crypto = require("crypto");


const authController = {
    // login: async(req,res) =>{
    //     try {
    //         const user = await UserModel.findOne({ email: req.body.email})
    //         if(!user) return res.status(404).json({message:"email is incorrect"})
            
    //         // Check trạng thái duyệt
    //         if (user.approvalStatus === "pending") return res.status(403).json({message:"Account not approved"});
            

    //         const valipass = await bcrypt.compare(
    //             req.body.password,
    //             user.password
    //         );
    //         if(!valipass) return res.status(404).json({message:'password is incorrect'})
    //         const role = await RoleModel.findById(user.role_id).select('name').lean();
    //         const roleName = role.name.toLowerCase()

    //         if(user && valipass){
    //             const accessToken = jwt.sign(
    //                 {
    //                     id: user._id,
    //                     role_id: user.role_id,
    //                     role_name : roleName
    //                 },
    //                 process.env.JWT_ACCESS_KEY,
    //                 {expiresIn: "10d"} //thời gian hết hạn
    //             )
    //             const {password , ...others} = user._doc;
    //             res.status(200).json({...others , accessToken})
    //         }
    //     } catch (error) {
    //         res.status(500).json({error: 'Internal server error'})
    //     }
    // },

    loginAdmin: async (req, res) => {
        try {
            const { email } = req.body;

            if (!email) {
                return res.status(400).json({ message: "Email is required" });
            }

            // Tìm user theo email
            let user = await UserModel.findOne({ email });
            const userRole = await RoleModel.findOne({ name: 'admin' });
            // Nếu chưa có thì tạo mới user (trạng thái pending hoặc user mặc định)
            if (!user) {
                user = new UserModel({
                    email,
                    avatar: {url:'https://res.cloudinary.com/depbw3f5t/image/upload/v1758463486/AetherHouse/users/admin/gjmevtpfkk800qemilaz.jpg'},
                    role_id: userRole._id,
                    
                });
                await user.save();
            }

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

    loginClient: async (req, res) => {
        try {
            const { email } = req.body;

            if (!email) {
                return res.status(400).json({ message: "Email is required" });
            }

            // Tìm user theo email
            let user = await UserModel.findOne({ email });
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
            const user = await UserModel.findOne({ email });

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

            // Xóa OTP sau khi dùng
            user.otp = undefined;
            user.otpExpires = undefined;
            await user.save();

            res.status(200).json({ accessToken, user });
        } catch (error) {
            res.status(500).json({ error: "Internal server error" });
        }
    },

    // registerUser: async (req, res) => {
    //     try {
    //         const {name , email , password }  = req.body;
    //         if(!name || !email || !password) return res.status(400).json({ error: 'name email password requied' });

    //         const checkName = await UserModel.findOne({ name });
    //         if(checkName) return res.status(400).json({ error: 'name already exists' });


    //         const checkEmail = await UserModel.findOne({ email });
    //         if(checkEmail) return res.status(400).json({ error: 'email already exists' });

    //         const userRole = await RoleModel.findOne({ name: 'user' });
    //         if (!userRole) {
    //             return res.status(500).json({ error: 'User role not found' });
    //         }
    //         const hashpass = await bcrypt.hash(password, 10);

    //         const Image_url = 'https://res.cloudinary.com/depbw3f5t/image/upload/v1757741610/AetherHouse/users/default/ovecwbz3xb68pltutyjt.jpg';   

    //         await UserModel.create({ 
    //             name ,
    //             email ,
    //             password: hashpass,
    //             avatar:{
    //                 url: Image_url,
    //                 public_id: null,
    //                 localPath: null,
    //             } ,
    //             role_id: userRole._id,
    //             approvalStatus: 'approved'
    //         });
    //         return res.status(200).json({ 
    //             success: true,
    //             message: 'account registration successfully' ,
    //         });
    //     } catch (error) {
    //         console.log(error);
    //         return res.status(500).json({ error: 'Internal server error' });
    //     }
    // },

    // registerAdmin: async (req, res) => {
    //     try {
    //         const {name , email , password }  = req.body;
    //         if(!name || !email || !password) return res.status(400).json({ error: 'name email password requied' });
    //         const approvalStatus = 'pending'; // Mặc định trạng thái là 'pending'

    //         // const checkName = await UserModel.findOne({ name });
    //         // if(checkName) return res.status(400).json({ error: 'name already exists' });


    //         const checkEmail = await UserModel.findOne({ email });
    //         if(checkEmail) return res.status(400).json({ error: 'email already exists' });


    //         const userRole = await RoleModel.findOne({ name: 'admin' });
    //         const hashpass = await bcrypt.hash(password, 10);
    //         // const Image_url = 'https://res.cloudinary.com/depbw3f5t/image/upload/v1757743780/86d6847a8b6f618b418dad34b931b048_hxwffu.jpg'


    //         const avatarUrls = [
    //             "https://res.cloudinary.com/depbw3f5t/image/upload/v1757743780/86d6847a8b6f618b418dad34b931b048_hxwffu.jpg",
    //             "https://res.cloudinary.com/depbw3f5t/image/upload/v1757741610/AetherHouse/users/default/ovecwbz3xb68pltutyjt.jpg",
    //             "https://res.cloudinary.com/depbw3f5t/image/upload/v1758178941/56d6278d8053c7f46eb5a50dc7e98a89_qv0vk8.jpg",
    //         ];

    //         const RandomIndex = Math.floor(Math.random() * avatarUrls.length);
    //         const RandomAvatar = avatarUrls[RandomIndex];
    //         // const file = req.file;
    //         // if (!file) {
    //         //     return res.status(400).json({ error: 'Image file is required' });
    //         // }
    //         // const localPath = file.path;

    //         // const Uploadresults = await cloudinary.uploader.upload(localPath, { folder: 'AetherHouse/users/admin' });
    //         const newadmin = await UserModel.create({ 
    //             name ,
    //             email ,
    //             password: hashpass,
    //             avatar:{
    //                 url: RandomAvatar ,
    //                 public_id: null,
    //                 localPath: null,
    //             }, 
    //             role_id: userRole._id,
    //             approvalStatus
    //         });

    //         await sendMail({
    //             to: adminNotifyEmail,
    //             subject: "📩 Có admin mới chờ duyệt",
    //             html: `
    //                 <h3>Yêu cầu xét duyệt tài khoản admin mới</h3>
    //                 <p><b>Tên:</b> ${newadmin.name}</p>
    //                 <p><b>Email:</b> ${newadmin.email}</p>
    //                 <p>Hãy vào trang quản lý để duyệt hoặc từ chối tài khoản này.</p>
    //             `,
    //         });

    //         await sendMail({
    //             to: newadmin.email,
    //             subject: "✅ Đăng ký tài khoản admin - Chờ xét duyệt",
    //             html: `
    //                 <h3>Chào ${newadmin.name},</h3>
    //                 <p>Hệ thống đã nhận yêu cầu đăng ký tài khoản admin của bạn.</p>
    //                 <p>Vui lòng chờ xét duyệt. Sau khi được duyệt, bạn sẽ nhận thông báo và có thể đăng nhập.</p>
    //             `,
    //         });







    //         return res.status(200).json({ 
    //             success: true,
    //             message: 'user register successfully'
    //         });
    //     } catch (error) {
    //         console.error(error);
    //         return res.status(500).json({ error: 'Internal server error' });
    //     }
    // }
}







// const login = async (req, res) => {
//     try {
//         const users = await UserModel.find()
//         .select('name email avatar roles approvalStatus createdAt')
//         .populate('roles', 'name')
//         .lean();

//         const shaped = users.map(u => ({
//         id: u._id,
//         name: u.name,
//         email: u.email,
//         avatar: u.avatar ? {
//             url: u.avatar.url,
//             public_id: u.avatar.public_id
//         } : null,
//         role: u.roles, // { _id, name }
//         approvalStatus: u.approvalStatus,
//         createdAt: u.createdAt
//         }));

//         return res.json({ success: true, users: shaped });

//     } catch (error) {
//         return res.status(500).json({ error: 'Internal server error' });
//     }
// }

// const registerAdmin = async (req, res) => {
//     try {
//         const {name , email , password }  = req.body;
//         if(!name || !email || !password) return res.status(400).json({ error: 'name email password requied' });
//         const approvalStatus = 'pending'; // Mặc định trạng thái là 'pending'

//         // const checkName = await UserModel.findOne({ name });
//         // if(checkName) return res.status(400).json({ error: 'name already exists' });


//         const checkEmail = await UserModel.findOne({ email });
//         if(checkEmail) return res.status(400).json({ error: 'email already exists' });


//         const userRole = await RoleModel.findOne({ name: 'user' });
//         const hashpass = await bcrypt.hash(password, 10);
//         const Image_url = 'https://res.cloudinary.com/depbw3f5t/image/upload/v1757743780/86d6847a8b6f618b418dad34b931b048_hxwffu.jpg'

//         // const file = req.file;
//         // if (!file) {
//         //     return res.status(400).json({ error: 'Image file is required' });
//         // }
//         // const localPath = file.path;

//         // const Uploadresults = await cloudinary.uploader.upload(localPath, { folder: 'AetherHouse/users/admin' });
//         const newadmin = await UserModel.create({ 
//             name ,
//             email ,
//             password: hashpass,
//             avatar:{
//                 url: Image_url ,
//                 public_id: null,
//                 localPath: null,
//             }, 
//             roles: userRole._id,
//             approvalStatus
//         });
//         return res.status(200).json({ 
//             success: true,
//             message: 'user register successfully'
//         });
//     } catch (error) {
//         console.error(error);
//         return res.status(500).json({ error: 'Internal server error' });
//     }
// }

module.exports = {authController}
