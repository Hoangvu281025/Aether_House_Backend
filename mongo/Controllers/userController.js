const bcrypt = require('bcrypt');
const UserModel = require('../Models/userModel');

const RoleModel = require('../Models/roleModel');
const cloudinary = require('../config/cloudinary');


const login = async (req, res) => {
    try {
        const users = await UserModel.find()
        .select('name email avatar roles approvalStatus createdAt')
        .populate('roles', 'name')
        .lean();

        const shaped = users.map(u => ({
        id: u._id,
        name: u.name,
        email: u.email,
        avatar: u.avatar ? {
            url: u.avatar.url,
            public_id: u.avatar.public_id
        } : null,
        role: u.roles, // { _id, name }
        approvalStatus: u.approvalStatus,
        createdAt: u.createdAt
        }));

        return res.json({ success: true, users: shaped });

    } catch (error) {
        return res.status(500).json({ error: 'Internal server error' });
    }
}
const registerUser = async (req, res) => {
    try {
        const {name , email , password }  = req.body;
        if(!name || !email ||!password) return res.status(400).json({ error: 'name email password requied' });
        const userRole = await RoleModel.findOne({ name: 'user' });
        const hashpass = await bcrypt.hash(password, 10);
        const file = req.file;
        if (!file) {
            return res.status(400).json({ error: 'Image file is required' });
        }
        const localPath = file.path;

        const Uploadresults = await cloudinary.uploader.upload(localPath, { folder: 'AetherHouse' });
        await UserModel.create({ 
            name ,
            email ,
            password: hashpass,
            avatar:{
                url: Uploadresults.secure_url,
                public_id: Uploadresults.public_id,
                localPath: localPath,
            } ,
            roles: userRole._id,
            approvalStatus: 'approved'
        });
        return res.status(200).json({ 
            success: true,
            message: 'account registration successfully' ,
        });
    } catch (error) {
        return res.status(500).json({ error: 'Internal server error' });
    }
}
const registerAdmin = async (req, res) => {
    try {
        const {name , email , password }  = req.body;
        if(!name || !email ||!password) return res.status(400).json({ error: 'name email password requied' });
        const userRole = await RoleModel.findOne({ name: 'user' });
        const hash = await bcrypt.hash(password, 10);
        const newUser = await UserModel.create({ 
            name ,
            email ,
            password,
            avatar:image, 
            roles: userRole._id,
        });
        return res.status(200).json({ 
            success: true,
            message: 'user add successfully' ,
            newUser
        });
    } catch (error) {
        return res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = {login, registerUser , registerAdmin}
