import mongoose from "mongoose";
import { Password } from '../services/password';
//interface to describe properties, attributes those are required to create user
interface UserAttributes {
    email: string;
    password: string;
}

//an interface that describes the properties a user model has it represents entire collection of data
//telling there is a build function on its model User 
interface UserModel extends mongoose.Model <UserDoc> {
  build(attrs: UserAttributes): UserDoc; //tell the typescript about the existence of build method and what properties it accepts
} 

//an interface that describes the properties a user document has. doc represents one single record
interface UserDoc extends mongoose.Document {
  email: string;
  password:string;
}

const userSchema = new mongoose.Schema({ 
  email: {
      type: String, 
      required:true
  },
  password: {
      type: String, 
      required:true
  }
}, 
{
toJSON: { //user document turn in to json object
    transform(doc, ret){
        ret.id=ret._id //rename. mongo saves id with underscore _id
        delete ret._id;//deletes one _ before id that is given back after signing up
        delete ret.password; //
        delete ret.__v;//deletes two _ _ before v v= versionKey
     
    }
  }
});

userSchema.pre('save', async function(done) { // pre saved hook
  if (this.isModified('password')) {
    const hashed = await Password.toHash(this.get('password')); //gets user password from document
    this.set('password', hashed); //update password
  }
  done();
});

//typescript does not know what does it mean to assign properties to its statics object statics.build. to do so we need to make interface
//Remember, the entire goal of this build function was to just allow TypeScript to do some validation or type checking on the property we were trying to create user
userSchema.statics.build = (attrs: UserAttributes) => { //apply interface to the build function. custom function build in to model

    return new User(attrs); //whenever we trying to create user directly there was no way for type checking of attrs so thats why build function

}//name and type -> UserDoc, UserModel
const User = mongoose.model <UserDoc, UserModel> ('User', userSchema); //model function returns a value of UserModel type and saves on User var

/* User.build({
    email:'test@test.de',
    password:'232322'
}) */

export { User };