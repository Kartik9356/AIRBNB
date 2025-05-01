// middleware for user authentaction 
const isAuthenticated =(req,res,next)=>{
    if(!req.isAuthenticated()){
      req.flash("error","Login first")
      return res.redirect("/user/login")
    }
    next()
  }

  

module.exports ={isAuthenticated}