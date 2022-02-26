const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// const ingredientSchema = new Schema ({
//     type: {
//     name: String,
//     amount: String,
//     Unit: String,
//     }
// })


const RecipeSchema = new Schema({
    title: {
        type: String,
        reuired: true,
        unique: true
    },
    ingredients: {
            name: [String],
            amount: [String],
            unit: [String]
        },
    origin: {
        type: String,
    },
    dishType: {
        type: String,
        enum: ['breakfast', 'entree', 'snack', 'soup', 'drink', 'dessert']
    },
    image:
    {
        type: String,
        default: "https://www.femalefirst.co.uk/image-library/land/1000/v/vegan-food-jaywing-pr.jpg"
    },
    duration: {
        type: Number,
        min: 0,
    },
});

module.exports = mongoose.model('Recipe', RecipeSchema);