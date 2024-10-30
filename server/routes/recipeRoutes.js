const express = require("express");
const router = express.Router();

const {
	getRecipe,
	getRecipeById,
	createRecipe,
	updateRecipe,
	deleteRecipe,
} = require("../controllers/recipeController");

router.get("/Recipe", getRecipe);
router.get("/Recipe/:id", getRecipeById);
router.post("/Recipe", createRecipe);
router.put("/Recipe/:id", updateRecipe);
router.delete("/Recipe/:id", deleteRecipe);

module.exports = router;
