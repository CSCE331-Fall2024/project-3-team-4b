const express = require("express");
const router = express.Router();

const {
	getRecipe,
	getRecipeById,
	createRecipe,
	updateRecipe,
	deleteRecipe,
	getRecipesByMenuId,
	deleteRecipesByMenuId,
} = require("../controllers/recipeController");

router.get("/Recipe", getRecipe);
router.get("/Recipe/:id", getRecipeById);
router.post("/Recipe", createRecipe);
router.put("/Recipe/:id", updateRecipe);
router.delete("/Recipe/:id", deleteRecipe);
router.get("/Recipe/menu/:menu_id", getRecipesByMenuId);
router.delete("/Recipe/menu/:menu_id", deleteRecipesByMenuId);

module.exports = router;
