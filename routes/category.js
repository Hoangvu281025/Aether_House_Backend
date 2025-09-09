var express = require('express');
var router = express.Router();
const CategoryControllers = require('../mongo/Controllers/categoryController')
/* GET users listing. */
router.get('/menu', CategoryControllers.getMenu);
router.get('/', CategoryControllers.getAllCategorys);
router.get('/:id', CategoryControllers.getByCategoryID);
router.post('/', CategoryControllers.addCategory);
router.put('/:id', CategoryControllers.updateCategory);
router.delete('/:id', CategoryControllers.toggleCategoryStatus);

module.exports = router;
