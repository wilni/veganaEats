
const ExpressErrors = require('./ExpressError');

const isLoggedIn = function(req, res, next) {
    console.log("req . USER IS:",req.user)
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl; // you are setting the return to property from passport to original URL that was trying to be reached, this can be accessed in req or next route
        req.flash('error', 'Must be admin!');
        return res.redirect('/admin');
    }
    next();
};




module.exports = isLoggedIn;