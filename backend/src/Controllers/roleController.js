const RoleModel = require('../Models/roleModel');


const getAllrole = async (req, res) => {
    try {
        const roles = await RoleModel.find({});
        return res.status(200).json({ 
            success: true,
            roles

         });
    } catch (error) {
        return res.status(500).json({ error: 'Internal server error' });
    }
}
const addrole = async (req, res) => {
    try {
        const name  = req.body.name;
        if(!name) return res.status(400).json({ error: 'Role name should not be empty' });
        const newRole = await RoleModel.create({ name });
        return res.status(200).json({ 
            success: true,
            message: 'role add successfully' ,
            newRole
        });
    } catch (error) {
        return res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = { getAllrole,addrole}
