import jwt from 'jsonwebtoken';

export const GenerateToken = async(data)=> {
    try {
        const token = jwt.sign(data, process.env.JWT_SECRET, { expiresIn: '1h' });
        return token;
    } catch (error) {
        console.log(error.message)
    }
   
};
export const VerifyToken = (req, res,next) =>{
    const token = req.headers['authorization'].split(' ')[1];
    if(!token){
        return res.status(401).json({msg: "Token is not provided"})
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
        if(err){
            return res.status(403).json({msg: "Token is not valid"})
        }
        req.payload = payload;
       return next();
    });
}