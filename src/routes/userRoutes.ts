import { Router } from "express";

import { createUser,getUser, updateUser } from "../controllers/userController";

const router:Router=Router();

router.post('/create',createUser);
router.get('/getUser',getUser);
router.put('/updateUser',updateUser);

export default router;