const jwt = require('jsonwebtoken');

const authMiddleware = (allowedrole=[]) => {return (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {   
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        if(allowedrole.length && !allowedrole.includes(req.user.role)){
            return res.status(403).json({message:"Acces Denied"});
        }
        next(); 
    }
    catch(err){
        console.error(err);
        res.status(401).json({message:"Token is not valid"});
    }
}};
module.exports=authMiddleware;