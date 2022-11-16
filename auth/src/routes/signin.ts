import express, { Request, Response } from "express";
import { body } from "express-validator";
import { validateRequest, BadRequestError } from '@dash007tickets/common';
import { User } from "../models/user";
import  { Password } from '../services/password';
import jwt from 'jsonwebtoken';


const router = express.Router();

router.post(
  "/api/users/signin",
  [
    body("email").isEmail().withMessage("Email must be valid"),
    body("password")
      .trim()
      .notEmpty()
      .withMessage("You must supply a password"),
  ],
  validateRequest,
  async (req: Request, res: Response) => { 

    const { email, password }= req.body; //pull the email and password out of the req body

    const existingUser = await User.findOne({email}); //find user with this email if it exists

    if(!existingUser) {
      throw new BadRequestError('Invalid credentials');
    }

    const passwordsMatch = await
    Password.compare(existingUser.password, password); //await because Password  compare method is async
    if(!passwordsMatch) {
      throw new BadRequestError('Invalid credentials');
    }

    
const userJwt = jwt.sign({ //generate json web token
  id: existingUser.id,
  email: existingUser.email
}, process.env.JWT_KEY! ); //exclamation tells typescript we know 100% that jwt_key is defined

//store it on session object
req.session = { //cookie session library is gonna take it serialize and send it to browser
  jwt:userJwt //base 64 encode
};

res.status(200).send(existingUser); //send user to browser

  }
);

export { router as signinRouter };
