import passport from "passport";
import bcrypt from "bcryptjs";
import { GraphQLLocalStrategy } from "graphql-passport";
import User from "../models/user.model.js";

export const configurePassport = async () => {
  passport.serializeUser((user, done) => {
    console.log("serialize user");
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    console.log("deserialize user");
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });
  passport.use(
    new GraphQLLocalStrategy(async (username, password, done) => {
      try {
        const user = await User.findOne({ username });
        if (!user) {
          throw new Error("Invalid username or password");
        }
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
          throw new Error("invalid password or password not matched");
        }
        return done(null, user, "login successfully");
      } catch (error) {
        return done(error);
      }
    })
  );
};
