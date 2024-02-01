import passport from "passport";
import passportlocal from "passport-local";
import UserModel from "../models/user.js";
import GitHubStrategy from "passport-github2"
import { createHash, isValidPassword} from "../dirname.js";


const localStrategy = passportlocal.Strategy

const initializePassport =()=>{

  passport.use('github', new GitHubStrategy(
    { 
        clientID: "Iv1.e4da1811720c0779",
        clientSecret: "b23f11925db43edb0b5d58db11562d8066825752",
        callbackUrl: "http://localhost:8080/api/sessions/githubcallback"
    },
    async (accessToken, refreshToken, profile, done) => {
        console.log("Profile obtenido del usuario de GitHub: ");
        console.log(profile);
        try {
            const user = await UserModel.findOne({ email: profile._json.email });
            if (!user) {
                console.warn("User doesn't exists with username: " + profile._json.email);
                let newUser = {
                    first_name: profile._json.name,
                    last_name: '',
                    age: 28,
                    email: profile._json.email,
                    password: '',
                    loggedBy: "GitHub"
                }
                const result = await UserModel.create(newUser);
                return done(null, result)
            } else {
                return done(null, user)
            }
        } catch (error) {
            return done(error)
        }
    })
  );

  passport.use("register", new localStrategy(
    {passReqToCallback: true, usernameField: "email"},
    
    async (req, username, password, done) =>{
      const {first_name, last_name, email,age} = req.body;
      try{
        const exist = await UserModel.findOne({email});
        if(exist){
          console.log("El user ya existe!!");
          done(null,false)
        }

        const user={
          first_name,
          last_name,
          email,
          age,
          password:createHash(password)
        }
        const result = await UserModel.create(user);
        return done (null, result)
      }catch(error){
        return done("Error registrando al usuario " + error);
      }
    }
  ))


  passport.use("login", new localStrategy(
    {passReqToCallback: true, usernameField: "email"},

    async(req, username, password, done)=>{
      try{
        const user = await UserModel.findOne({email:username});
        if (!user) {
          console.warn("User doesn't exists with username: " + username);
          return done(null, false);
        }
        if (!isValidPassword(user, password)) {
            console.warn("Invalid credentials for user: " + username);
            return done(null, false);
        }
        return done(null, user);

      }catch{
        return done(error);
      }
    }

  ));

  //Funciones de Serializacion y Desserializacion
  passport.serializeUser((user, done) => {
    done(null, user._id)
  })

  passport.deserializeUser(async (id, done) => {
    try {
        let user = await UserModel.findById(id);
        done(null, user)
    } catch (error) {
        console.error("Error deserializando el usuario: " + error);
    }
  })
}

export default initializePassport;