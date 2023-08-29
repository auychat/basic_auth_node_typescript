import express from "express";
import authentication from "./authentication";
import users from "./users";

// Create an instance of an Express router
const router = express.Router();

export default(): express.Router => {
    // Configure authentication routes using the authentication module
    authentication(router)

    // Configure user-related routes using the users module
    users(router);

    // Return the configured router
    return router;
};