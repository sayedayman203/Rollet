const User = require("../models/user.model");
const { nextUser } = require("../services/setting.service");
const { createToken } = require("../helpers/jwt");

const createUser = (
  firstName,
  lastName,
  userName,
  password,
  isAdmin = false
) => {
  return new Promise(async (resolve, reject) => {
    try {
      const userId = await nextUser();

      // create new user
      const newUser = new User({
        userId,
        firstName,
        lastName,
        userName,
        password,
        role: isAdmin ? "admin" : "user",
      });

      // save user
      await newUser.save();

      const token = createToken({ id: newUser._id });

      resolve({ user: newUser, token });
    } catch (err) {
      err.status = 400;
      reject(err);
    }
  });
};

const login = (userName, password, role, rememberMe) => {
  const credintialError = new Error("INCORECT_CREDINTIAL");

  return new Promise(async (resolve, reject) => {
    try {
      const user = await User.findOne({ userName, role });
      if (!user) throw credintialError;

      const isValid = await user.isValidPass(password);
      if (!isValid) throw credintialError;

      if (user.status === "deactive") throw new Error("SUSPENDED");

      const token = createToken({ id: user._id }, rememberMe);
      resolve({
        token,
        user,
      });
    } catch (err) {
      err.status = 400;
      reject(err);
    }
  });
};

const getUsers = ({ userName = "", page, limit }) => {
  if (!page || page < 1) page = 1;
  if (!limit || limit < 1) limit = 10;
  const skip = page * limit - limit;
  const query = {
    userName: {
      $regex: new RegExp(userName, "ig"),
    },
    role: "user",
    status: {
      $in: ["active", "deactive"],
    },
  };
  return new Promise(async (resolve, reject) => {
    try {
      const count = await User.countDocuments(query);
      const pages = Math.ceil(count / limit);
      let pagination = {
        total: count,
        pages,
        page,
        limit,
        hasNext: page < pages ? true : false,
        next: page < pages ? page + 1 : null,
        hasPrev: page > 1 ? true : false,
        prev: page > 1 ? page - 1 : null,
      };
      if (pagination.page > pagination.pages)
        return resolve({
          users: [],
          pagination,
        });

      const users = await User.find(query)
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: "desc" });

      resolve({ users, pagination });
    } catch (err) {
      err.status = 400;
      reject(err);
    }
  });
};

const getUserByUserId = (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await User.findOne({ userId });
      if (!user) throw new Error("USER_NOTFOUNT");

      resolve(user);
    } catch (err) {
      err.status = 404;
      reject(err);
    }
  });
};

const getUserByUserName = (userName) => {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await User.findOne({ userName });
      if (!user) throw new Error("USER_NOTFOUNT");

      resolve(user);
    } catch (err) {
      err.status = 404;
      reject(err);
    }
  });
};

const updateUser = (userName, updates = {}) => {
  const { firstName, lastName } = updates;

  return new Promise(async (resolve, reject) => {
    try {
      let updated = {};

      if (firstName) updated.firstName = firstName;
      if (lastName) updated.lastName = lastName;

      let user = await User.findOneAndUpdate({ userName }, updated, {
        new: true,
      });

      resolve(user);
    } catch (err) {
      err.status = 400;
      reject(err);
    }
  });
};

const changeStatus = (userName, status) => {
  return new Promise(async (resolve, reject) => {
    try {
      let user = await User.findOneAndUpdate(
        { userName },
        { status },
        {
          new: true,
        }
      );

      resolve(user);
    } catch (err) {
      err.status = 400;
      reject(err);
    }
  });
};

const changePassword = (userName, { oldPassword, newPassword }) => {
  return new Promise(async (resolve, reject) => {
    try {
      let user = await getUserByUserName(userName);

      const isValid = await user.isValidPass(oldPassword);
      if (!isValid) throw new Error("INCORECT_PASSWORD");

      user.password = newPassword;
      await user.save();

      resolve(user);
    } catch (err) {
      err.status = 400;
      reject(err);
    }
  });
};

module.exports = {
  createUser,
  login,
  getUsers,
  getUserByUserId,
  getUserByUserName,
  updateUser,
  changeStatus,
  changePassword,
};
