import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  authentication: {
    password: { type: String, required: true, select: false },
    salt: { type: String, select: false },
    sessionToken: { type: String, select: false },
  },
});

export const UserModel = mongoose.model("User", UserSchema);

// Get all users
export const getUsers = () => UserModel.find();

// Get user by email
export const getUserByEmail = (email: string) => UserModel.findOne({ email });

// Get user by session token
export const getUserBysessionToken = (sessionToken: string) =>
  UserModel.findOne({ "authentication.sessionToken": sessionToken });

// Get user by id
export const getUserById = (id: string) => UserModel.findById(id);

// Create user
export const createUser = (values: Record<string, any>) =>
  new UserModel(values).save().then((user) => user.toObject());

// Delete user
export const deleteUserById = (id: string) =>
  UserModel.findByIdAndDelete({ _id: id });

// Update user by id
export const updateUserById = (id: string, values: Record<string, any>) =>
  UserModel.findByIdAndUpdate(id, values);
