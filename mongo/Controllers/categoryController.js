const CategoryModel = require('../Models/categoryModel');
const Product = require('../Models/productModel');
const { toSlug } = require('../utils/slugify');
const RoomModel = require('../Models/roomModel');


const getMenu = async (req , res) => {
    try {
    // Lấy tất cả category cha
    const parents = await CategoryModel.find({ parentId: null , status: "active" }).select('_id name slug').lean();

    // Lấy tất cả category con
    const children = await CategoryModel.find({ parentId: { $ne: null } }).select('name slug parentId').lean();

    // Lấy tất cả room
    const rooms = await RoomModel.find().select('name slug').lean();

    // Gom con vào đúng cha
    const menu = parents.map(parent => {
        const childOfParent = children
            .filter(c => String(c.parentId) === String(parent._id))
            .map(c => ({ name: c.name, slug: c.slug }));

        // Không gán rooms nếu slug là 'whats-new'
        const roomsForParent = (parent.slug === 'whats-new' || parent.slug === 'explore' || parent.slug === 'gifts')
            ? [] // ← bỏ qua room
            : rooms
            .map(r => ({ name: r.name, slug: r.slug }));

        // Trả về object
        return {
            parent: { name: parent.name, slug: parent.slug },
            children: childOfParent,
            ...(roomsForParent.length > 0 && { rooms: roomsForParent }) 
        };
    });


    res.json(menu);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
}

const getAllCategorys = async (req , res) => {
    try {
        const categories = await CategoryModel.find({ status: "active"});
        res.status(200).json({
            success: true,
            categories
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            error : 'Internal server error'
        })
    }
}



const getByCategoryID = async (req , res) => {
    try {
        const category_id = req.params.id;
        const categories = await CategoryModel.findById({ _id:category_id , status: "active"});
        if(!categories) return res.status(404).json({ success: false , errer: "Category not found or hidden"});
        res.status(200).json({
            success: true,
            categories
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            error : 'Internal server error'
        })
    }
}

const addCategory = async (req , res) => {
    try {
        const { name , parentId } = req.body;
        const slug = toSlug(name);
        if(!name || !slug ) return res.status(400).json({ error: "name and slug requied"})

            // Check trùng name
        const nameExists = await CategoryModel.findOne({ name });
        if (nameExists) return res.status(400).json({ error: "Category name already exists" });



        const newCategory = await Category.create({ name , slug , parentId: parentId || null })
        res.status(200).json({
            success: true,
            categories : newCategory
            
        })
    } catch (error) {
        res.status(500).json({
            error : 'Internal server error'
        })
    }
}

const updateCategory = async (req , res) => {
    try {
        const { name ,slug } = req.body;
        const category_id = req.params.id;
        const category = await CategoryModel.findOne({ _id:category_id , status: "active"});
        if(!category) return res.status(400).json({ error: "name and slug requied"})

        // Kiểm tra trùng name
        if (name) {
            const nameExists = await CategoryModel.findOne({ name, _id: { $ne: category_id } });
            if (nameExists) return res.status(400).json({ error: "Category name already exists" });
            category.name = name;
        }

        // Kiểm tra trùng slug
        if (slug) {
            const slugExists = await CategoryModel.findOne({ slug, _id: { $ne: category_id } });
            if (slugExists) return res.status(400).json({ error: "Category slug already exists" });
            category.slug = slug;
        }

        await category.save();
        res.status(200).json({
            success: true,
            categories : updateCategory
        })
    } catch (error) {
        res.status(500).json({
            error : 'Internal server error'
        })
    }
}

const toggleCategoryStatus  = async (req , res) => {
    try {
        const category_id = req.params.id;

        const category = await CategoryModel.findById(category_id);
        if(!category) return res.status(400).json({ error: " requied"})

        category.status = (category.status == "active") ? 'unactive' : 'active';

        await category.save();
        await Product.updateMany({ category: category_id }, { is_hidden: category.status === 'inactive' });
        res.status(200).json({
            success: true,
            categories : updateCategory
        })
    } catch (error) {
        res.status(500).json({
            error : 'Internal server error'
        })
    }
}




module.exports = {
    getMenu,
    getAllCategorys,
    getByCategoryID,
    addCategory,
    updateCategory,
    toggleCategoryStatus 
}