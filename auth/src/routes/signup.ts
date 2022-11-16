import express, {Request, Response} from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';
import { User } from '../models/user';
import { validateRequest, BadRequestError } from '@dash007tickets/common';

const router = express.Router();

router.post('/api/users/signup', [
  body('email').isEmail().withMessage('Email must be valid'),//it is gonna make sure that the email has the email structure
  body('password').trim().isLength({ min:4, max:20 }).withMessage('Password must be between 4 and 20 characters')//it is gonna make sure there is no leading or A trailing  spaces
],
validateRequest,

async (req: Request, res: Response) => {

/*   const errors=validationResult(req);
  if (!errors.isEmpty()){
   throw new RequestValidationError(errors.array()); //it will be automatically picked up by error-handler middleware 
  }*/

const { email, password }= req.body;
const existingUser = await User.findOne({ email });
if (existingUser) {
  throw new BadRequestError('Email in use');

}

const user = User.build({ email, password });
await user.save();



const userJwt = jwt.sign({ //generate json web token
  id: user.id,
  email: user.email
}, process.env.JWT_KEY! ); //exclamation tells typescript we know 100% that jwt_key is defined


//store it on session object
req.session = { //cookie session library is gonna take it serialize and send it to browser
  jwt:userJwt //base 64 encode
};



res.status(201).send(user); //send user to browser


});

export { router as signupRouter }; //rename