const RouterA=require("express");
const routerA=RouterA();
const zodA=require("zod");
const admina=require("../Middlewares/adminMiddleware")
const adminSchema=zodA.object({
    username:zodA.coerce.string().email(),
    password:zodA.string().min(8)
})
routerA.post("/signup",(req,res)=>{
    const username=req.headers.username;
    const password=req.headers.password;
    const inputValidation=adminSchema.safeParse({username:username,password:password});
    if(!inputValidation.success){
        res.json({msg:"Inputs are not valid"});
    }
    //Create(Database)

    res.send("Admin Created successfully");
})

routerA.post("/signin",(req,res)=>{

})

routerA.put("/forgotPwd",(req,res)=>{
    
})

routerA.get("/products/outOfStock/*",(req,res)=>{

})

routerA.put("/orders/*",(req,res)=>{

})

routerA.get("/stats/*",(req,res)=>{

})

module.exports=routerA;