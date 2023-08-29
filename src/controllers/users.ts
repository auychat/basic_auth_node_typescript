import express from "express";
import { deleteUserById, getUserById, getUsers } from "../db/users";

// Get all users from the database
export const getAllUsers = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    // Get all users from the database
    const users = await getUsers();

    // Send a successful response with the users' data
    return res.status(200).json(users);
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};

// Delete a user from the database
export const deleteUser = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    // Get the user ID from the request parameters
    const { id } = req.params;

    // Delete the user from the database
    const deletedUser = await deleteUserById(id);

    // Send a successful response with the deleted user's data
    return res.json(deletedUser);
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};

// Update a user in the database
export const updateUser = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    // Get the user ID from the request parameters
    const { id } = req.params;

    // Get the username from the request body
    const { username } = req.body;

    // If the username is not provided, send a bad request response
    if (!username) {
      return res.sendStatus(400);
    }

    // Retrieve the user from the database based on the provided 'id'.
    const user = await getUserById(id);

    // Update the user's 'username' with the new value.
    user.username = username;

    // Save the updated user information back to the database
    await user.save();

    // Respond with a successful status code (200) and the updated user's information in JSON format.
    return res.status(200).json(user).end();
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};
