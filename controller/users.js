const User = require('../model/user');

module.exports.user = {
    renderRegister: (req,res)=>{
        res.render('user/register');
    },
    register: async(req,res,next)=>{
        try{
            const {username, email, password} = req.body.user;
            const user = new User({username,email});
            const newUser = await User.register(user,password);
            req.login(newUser,err=>{
                if(err)return next(err);
                req.flash('success','Welcome to YelpCamp');
                res.redirect('/campgrounds')
            });
        }catch(err){
            req.flash('error',err.message);
            res.redirect('/register')
        }
    },
    renderLogin : (req, res)=>{
        if(req.isAuthenticated()){
            return res.redirect('/campgrounds')
        }
        res.render('user/login');
    },
    login : async(req,res)=>{
        req.flash('success','Welcome to yelpcamp');
        const redirectUrl = res.locals.returnTo || '/campgrounds';
        res.redirect(redirectUrl);
    },
    logout : (req,res)=>{
        req.logout((err)=>{
            if(err){return next(err)}
                req.flash('success', 'successfully logged out');
                res.redirect('/campgrounds');
        });
    },
}
