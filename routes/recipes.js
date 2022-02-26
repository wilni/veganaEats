const express = require('express');
const router = express.Router();
const catchAsync = require('../utility/catchAsync');
const ExpressError = require('../utility/ExpressError');
const isLoggedIn = require('../utility/isLoggedIn');
const Recipe = require('../models/recipe');
const User = require('../models/user');


router.get('/', catchAsync(async(req, res, next) => {
    const recipes = await Recipe.find({});
    res.render('recipes/index', {recipes});
}));

router.get('/new/:num', isLoggedIn, catchAsync(async(req, res, next) => {
    const {num} = req.params;
    res.render('recipes/new', {num});
}));

router.get('/:id', catchAsync(async(req, res, next) => {
    const {id} = req.params;
    const recipe = await Recipe.findById(id);
        if(!recipe){
        req.flash('error', 'Reipe not found');
        return res.redirect('/recipes')
    }
    // console.log(recipe)
    res.render('recipes/show', {recipe});
    }));

router.get('/:id/edit', isLoggedIn, catchAsync(async(req, res, next) => {
        const {id} = req.params; 
        const recipe = await Recipe.findById(id);
        if(!recipe){
            req.flash('error', 'Reipe not found');
            return res.redirect('/recipes')
        }
        const num = recipe.ingredients.name.length;
        res.render('recipes/edit', {recipe, num});
}));

router.post('/', isLoggedIn, catchAsync(async(req, res, next) => {
    const recipe = await new Recipe(req.body);
    // res.send(recipe)
    // console.log(recipe.ingredients)
    await recipe.save();
    req.flash('success', 'New Recipe Created Sucessfully!')
    res.redirect(`/recipes/${recipe._id}`);
}));


router.put('/:id', isLoggedIn, catchAsync(async(req, res) => {
    const {id} = req.params; 
    const recipe = await Recipe.findByIdAndUpdate(id, req.body, {new: true});
    console.log(recipe);
    req.flash('success', 'Recipe Modified Sucessfully')
    res.redirect(`${id}`);
}))

router.delete('/:id', isLoggedIn, catchAsync(async (req, res, next) => {
    const {id} = req.params; 
    const recipe = await Recipe.findByIdAndDelete(id);
    req.flash('success', 'Recipe Deleted Sucessfully')
    res.redirect('/recipes');
}))

module.exports = router;