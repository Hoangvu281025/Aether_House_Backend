const { toSlug } = require('../utils/slugify');
const RoomModel = require('../Models/roomModel');




const getAllRooms = async (req , res) => {
    try {
        const rooms = await RoomModel.find({ status: "active"});
        res.status(200).json({
            success: true,
            rooms
        })
    } catch (error) {
        res.status(500).json({
            error : 'Internal server error'
        })
    }
}
const addRoom = async (req , res) => {
    try {
        const { name } = req.body;
        const slug = toSlug(name);
        if(!name ) return res.status(400).json({ error: "name requied"})

            // Check trùng name
        const nameExists = await RoomModel.findOne({ name });
        if (nameExists) return res.status(400).json({ error: "Category name already exists" });


        await RoomModel.create({ name , slug })
        res.status(200).json({
            success: true,
            message: 'Room added successfully'
        })
    } catch (error) {
        res.status(500).json({
            error : 'Internal server error'
        })
    }
}





module.exports = {
    addRoom,
    getAllRooms
}