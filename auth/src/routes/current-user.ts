import express from 'express';
import { currentUser } from '@dash007tickets/common';


const router = express.Router();

router.get('/api/users/currentuser', currentUser,  (req, res) => {

    res.send({currentUser: req.currentUser || null }); // it sends currentUser object to browser  and we receive it in index.js 

});

export { router as currentUserRouter };
