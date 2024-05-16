const jwta=require("jsonwebtoken");
const keyA=require("../config");
function Admin(req,res,next){
    const token=req.headers.authorization;
    const words=token.split(" ");
    const jwtToken=words[1];
    try{
        const decodeValue=jwta.verify(jwtToken,keyA);
        if(decodeValue.username){
            next();
        }
        else{
            res.status(403).json({msg:"You are not authenticated"});
        }
    }
    catch{
        res.send("Incorrect Inputs");
    }

    module.exports=Admin;

}