import express from "express";
import { get, merge } from "lodash";

import { getUserBysessionToken } from "../db/users";

// Check if the user is authenticated
export const isOwner = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const { id } = req.params;

    // Get the current user id from the request object
    const currentUserId = get(req, "identity._id") as string;

    // If the current user id is not provided, send a forbidden response
    if (!currentUserId) {
      return res.sendStatus(403);
    }

    // If the current user id is not the same as the id provided in the request, send a forbidden response
    if (currentUserId.toString() !== id) {
      return res.sendStatus(403);
    }
    return next();
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};

// Check if the user is authenticated
export const isAuthenticated = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    // Get the session token from the request cookies
    const sessionToken = req.cookies["CHRDEV-AUTH"];

    // If the session token is not provided, send a forbidden response
    if (!sessionToken) {
      return res.sendStatus(403);
    }

    // Get the user by the session token
    const existingUser = await getUserBysessionToken(sessionToken);

    // If the user does not exist, send a forbidden response
    if (!existingUser) {
      return res.sendStatus(403);
    }

    // Merge the 'existingUser' information into the 'req' object as the 'identity' property.
    // This is done to make the user's information available for further processing.
    merge(req, { identity: existingUser });

    return next();
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};
