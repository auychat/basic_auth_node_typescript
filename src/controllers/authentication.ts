import express from "express";
import { getUserByEmail, createUser } from "../db/users";
import { random, authentication } from "../helpers/helpers";

// REGISTER a new user
export const register = async (req: express.Request, res: express.Response) => {
  try {
    // Get the username, email and password from the request body
    const { username, email, password } = req.body;

    // Check if the username, email and password are provided
    if (!email || !password || !username) {
      return res.sendStatus(400); // Bad request if the username, email or password are not provided
    }

    // Check if the user already exists
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return res.sendStatus(400); // Bad request if the user already exists
    }

    // Generate a random salt for password hashing
    const salt = random();

    // Hash the password using the generated salt
    const hashedPassword = authentication(salt, password);

    // Create a new user in the database
    const user = await createUser({
      email,
      username,
      authentication: { salt, password: hashedPassword },
    });

    // Send a successful response with the created user's data
    return res.status(201).json(user).end();
  } catch (error) {
    console.log(error); // Log the error
    return res.sendStatus(400); // Bad request if an error occurs
  }
};

// LOGIN a user controller
export const login = async (req: express.Request, res: express.Response) => {
  try {
    // Get the email and password from the request body
    const { email, password } = req.body;

    if (!email || !password) {
      return res.sendStatus(400); // Bad request if the email or password are not provided
    }

    /* Get the user by email from the database
    and select the authentication object to get the salt and password
    for hashing the password from the request body
    and comparing it to the password in the database
    */
    const user = await getUserByEmail(email).select(
      "+authentication.salt +authentication.password"
    );
    if (!user) {
      return res.sendStatus(404); // Not found if the user does not exist
    }

    // Hash the password using the salt from the user's authentication object
    const expectedHash = authentication(user.authentication.salt, password);
    if (user.authentication.password !== expectedHash) {
      return res.sendStatus(403); // Unauthorized if the password is incorrect
    }

    // Generate a random salt for the session token
    const salt = random();

    // Generate a session token for the user using the generated salt and the user's id from the database as the payload for the token
    user.authentication.sessionToken = authentication(
      salt,
      user._id.toString()
    );

    // Save the user's session token to the database
    await user.save();

    // Send a successful response with the user's session token
    res.cookie("CHRDEV-AUTH", user.authentication.sessionToken, {
      domain: "localhost",
      path: "/",
    });

    // Send a successful response with the user's data
    return res.status(200).json(user).end();
  } catch (error) {
    console.log(error); // Log the error
    return res.sendStatus(400); // Bad request if an error occurs
  }
};
