const express=require("express")
const router=express.Router();
const controller=require("./controller")

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.post("/signin",controller.signin)
router.post("/signup",controller.signup)
router.delete("/deletecontact",controller.deleteaccount)

module.exports=router;