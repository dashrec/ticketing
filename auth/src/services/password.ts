import { scrypt, randomBytes } from 'crypto';
import { promisify } from 'util';

const scryptAsync = promisify(scrypt); //convert from callback implementation to promise base implementation

export class Password {
      static async toHash(password: string) { //static methods can be excessed without making instance of them like Password.toHash

      const salt = randomBytes(8).toString('hex'); //generate random string
      const buf = (await scryptAsync(password, salt, 64)) as Buffer; // actual hashing process. as buffer make type as buffer
      return `${buf.toString('hex')}.${salt}`;
  }

  static async compare(storedPassword: string, suppliedPassword: string) {
    const [hashedPassword, salt] = storedPassword.split('.');

    const buf = (await scryptAsync(suppliedPassword, salt, 64)) as Buffer; // actual hashing process. as buffer make type as buffer

    return buf.toString('hex')===hashedPassword;
  }
}
