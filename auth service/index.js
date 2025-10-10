const express=require("express")
const router=express.Router();
const controller=require("./controller")

router.post("/signin",controller.signin)
router.post("/signup",controller.signup)
router.delete("/deletecontact",controller.deleteaccount)

module.exports=router;