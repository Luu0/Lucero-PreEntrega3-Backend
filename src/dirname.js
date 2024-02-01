import {fileURLToPath} from "url";
import { dirname } from "path";
import bcyrpt from "bcrypt";

const _filename = fileURLToPath(import.meta.url);
export const __dirname = dirname(_filename);

export const createHash = (password) => {
  const saltRounds = 10; 
  const salt = bcyrpt.genSaltSync(saltRounds);
  return bcyrpt.hashSync(password, salt);
};

export const isValidPassword = (user, password)=>{
  return bcyrpt.compareSync(password, user.password);
}

