const jwtu=require("jsonwebtoken");
const keyU=require("../config");
function User(req,res,next){
    const token=req.headers.authorization;
    const words=token.split(" ");
    const jwtToken=words[1];
    try{
        const decodeValue=jwtu.verify(jwtToken,keyU);
        if(decodeValue.username){
            req.username=decodeValue.username;
            next();
        }
        else{
            res.status(403).json({msg:"You are not authenticated"});
        }
    }
    catch{
        res.send("Incorrect Inputs");
    }

    module.exports=User;

}