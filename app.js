const express = require('express');
const helmet = require("helmet");
const app = express(); 
const path = require('path');
const ejs = require('ejs');
const ejsMate = require('ejs-mate');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const catchAsync = require('./utility/catchAsync');
const ExpressError = require('./utility/ExpressError');
const isLoggedIn = require('./utility/isLoggedIn');
const Recipe = require('./models/recipe');
const session = require('express-session');
const flash = require('connect-flash');
const User = require('./models/user');
const passport = require('passport');
const LocalStrategy = require('passport-local');


const recipeRoutes = require('./routes/recipes');
const userRoutes = require('./routes/user');

mongoose.connect('mongodb://localhost:27017/veganaEats', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
});

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Database connected');
});


const sessionOptions = {
    name: 'SessionInfo',
    secret: 'topsecret',
    resave: false, 
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        // secure: true, // this is so cookies are only sent through https once deployed
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

app.use(session(sessionOptions))
app.use(flash());
app.use(
    helmet({
        contentSecurityPolicy: false,
    })
  );
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use( (req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})



app.get('/', (req, res) => {
    res.render('home2.ejs');
});

app.get('/about', (req, res) => {
    res.render('about');
});


//Route to register an admin

// app.get('/register', catchAsync(async(req, res, next) => {
//     const user = new User({email: 'andreaelena101@gmail.com',username: 'Andrea'});
//     const newUser = await User.register(user, 'Estevez101');
//     res.send(newUser);
// }));



app.use('/recipes', recipeRoutes);
app.use('/admin', userRoutes);

app.all('*', (req, res, next) => {
    next(new ExpressError('Page not found', 404));
})

app.use((err, req, res, next) => {
    const {status = 500} = err; 
    if(!err.message) err.message = 'something went wrong';
    res.status(status).render('error.ejs', {err});
});

app.listen(3000, () => {
    console.log('Port 3000 serving');
})