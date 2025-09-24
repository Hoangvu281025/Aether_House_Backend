const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const UserModel = require('../Models/userModel');

const RoleModel = require('../Models/roleModel');
// const cloudinary = require('../config/cloudinary');



const authController = {
    login: async(req,res) =>{
        try {
            const user = await UserModel.findOne({ email: req.body.email})
            if(!user) return res.status(404).json({message:"email is incorrect"})
            
            // Check trạng thái duyệt
            if (user.approvalStatus === "pending") return res.status(403).json({message:"Account not approved"});
            

            const valipass = await bcrypt.compare(
                req.body.password,
                user.password
            );
            if(!valipass) return res.status(404).json({message:'password is incorrect'})
            const role = await RoleModel.findById(user.role_id).select('name').lean();
            const roleName = role.name.toLowerCase()

            if(user && valipass){
                const accessToken = jwt.sign(
                    {
                        id: user._id,
                        role_id: user.role_id,
                        role_name : roleName
                    },
                    process.env.JWT_ACCESS_KEY,
                    {expiresIn: "10d"} //thời gian hết hạn
                )
                const {password , ...others} = user._doc;
                res.status(200).json({...others , accessToken})
            }
        } catch (error) {
            res.status(500).json({error: 'Internal server error'})
        }
    },
    registerUser: async (req, res) => {
        try {
            const {name , email , password }  = req.body;
            if(!name || !email || !password) return res.status(400).json({ error: 'name email password requied' });

            const checkName = await UserModel.findOne({ name });
            if(checkName) return res.status(400).json({ error: 'name already exists' });


            const checkEmail = await UserModel.findOne({ email });
            if(checkEmail) return res.status(400).json({ error: 'email already exists' });

            const userRole = await RoleModel.findOne({ name: 'user' });
            if (!userRole) {
                return res.status(500).json({ error: 'User role not found' });
            }
            const hashpass = await bcrypt.hash(password, 10);

            const Image_url = 'https://res.cloudinary.com/depbw3f5t/image/upload/v1757741610/AetherHouse/users/default/ovecwbz3xb68pltutyjt.jpg';   

            await UserModel.create({ 
                name ,
                email ,
                password: hashpass,
                avatar:{
                    url: Image_url,
                    public_id: null,
                    localPath: null,
                } ,
                role_id: userRole._id,
                approvalStatus: 'approved'
            });
            return res.status(200).json({ 
                success: true,
                message: 'account registration successfully' ,
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    },

    registerAdmin: async (req, res) => {
        try {
            const {name , email , password }  = req.body;
            if(!name || !email || !password) return res.status(400).json({ error: 'name email password requied' });
            const approvalStatus = 'pending'; // Mặc định trạng thái là 'pending'

            // const checkName = await UserModel.findOne({ name });
            // if(checkName) return res.status(400).json({ error: 'name already exists' });


            const checkEmail = await UserModel.findOne({ email });
            if(checkEmail) return res.status(400).json({ error: 'email already exists' });


            const userRole = await RoleModel.findOne({ name: 'admin' });
            const hashpass = await bcrypt.hash(password, 10);
            // const Image_url = 'https://res.cloudinary.com/depbw3f5t/image/upload/v1757743780/86d6847a8b6f618b418dad34b931b048_hxwffu.jpg'


            const avatarUrls = [
                "https://res.cloudinary.com/depbw3f5t/image/upload/v1757743780/86d6847a8b6f618b418dad34b931b048_hxwffu.jpg",
                "https://res.cloudinary.com/depbw3f5t/image/upload/v1757741610/AetherHouse/users/default/ovecwbz3xb68pltutyjt.jpg",
                "https://res.cloudinary.com/depbw3f5t/image/upload/v1758178941/56d6278d8053c7f46eb5a50dc7e98a89_qv0vk8.jpg",
            ];

            const RandomIndex = Math.floor(Math.random() * avatarUrls.length);
            const RandomAvatar = avatarUrls[RandomIndex];
            // const file = req.file;
            // if (!file) {
            //     return res.status(400).json({ error: 'Image file is required' });
            // }
            // const localPath = file.path;

            // const Uploadresults = await cloudinary.uploader.upload(localPath, { folder: 'AetherHouse/users/admin' });
            const newadmin = await UserModel.create({ 
                name ,
                email ,
                password: hashpass,
                avatar:{
                    url: RandomAvatar ,
                    public_id: null,
                    localPath: null,
                }, 
                role_id: userRole._id,
                approvalStatus
            });
            return res.status(200).json({ 
                success: true,
                message: 'user register successfully'
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
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
