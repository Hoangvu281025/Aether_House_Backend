const Category = require('../Models/categoryModel');
const Product = require('../Models/productModel');

const getAllCategorys = async (req , res) => {
    try {
        const categories = await Category.find({ status: "active"});
        res.status(200).json({
            success: true,
            categories : categories
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
        const categories = await Category.findById({ _id:category_id , status: "active"});
        if(!categories) return res.status(404).json({ success: false , errer: "Category not found or hidden"});
        res.status(200).json({
            success: true,
            categories: categories
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            error : 'Internal server error'
        })
    }
}
//success
const addCategory = async (req , res) => {
    try {
        const { name ,slug } = req.body;
        if(!name || !slug ) return res.status(400).json({ error: "name and slug requied"})

            // Check trùng name
        const nameExists = await Category.findOne({ name });
        if (nameExists) return res.status(400).json({ error: "Category name already exists" });

            // Check trùng slug
        const slugExists = await Category.findOne({ slug });
        if (slugExists) return res.status(400).json({ error: "Category slug already exists" });


        const newCategory = await Category.create({ name ,slug })
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
        const category = await Category.findOne({ _id:category_id , status: "active"});
        if(!category) return res.status(400).json({ error: "name and slug requied"})

        // Kiểm tra trùng name
        if (name) {
            const nameExists = await Category.findOne({ name, _id: { $ne: category_id } });
            if (nameExists) return res.status(400).json({ error: "Category name already exists" });
            category.name = name;
        }

        // Kiểm tra trùng slug
        if (slug) {
            const slugExists = await Category.findOne({ slug, _id: { $ne: category_id } });
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

        const category = await Category.findById(category_id);
        if(!category) return res.status(400).json({ error: " requied"})

        category.status = (category.status == "active") ? 'inactive' : 'active';

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
    getAllCategorys,
    getByCategoryID,
    addCategory,
    updateCategory,
    toggleCategoryStatus 
}