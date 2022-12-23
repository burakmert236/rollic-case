const User = require('../services/User');
const httpStatus = require('http-status');
const ObjectId = require('mongoose').Types.ObjectId;

const create = async (req, res) => {
    try {
        const name = req.body.name;
        const email = req.body.email;
        const password = req.body.password;

        // all fields are required to create a user
        if(!name || !email || !password) {
            return res.status(httpStatus.BAD_REQUEST).send({ error: "Bad request" })
        }

        // create user object
        const user = await User.create({ name, email, password });

        // return user object without password field
        return res.status(httpStatus.OK).send({
            id: user?._id,
            name: user?.name,
            email: user?.email
        });
    } catch(err) {
        // error code 11000 indicates duplicate key error for mongodb
        if(err?.code === 11000) {
            return res.status(httpStatus.FORBIDDEN).send({ error: "User with that email already exists" });
        }
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ error: "server error" });
    }
};

const updateOne = async (req, res) => {
    try {
        const userId = req.params.id;
        const name = req.body.name;
        const password = req.body.password;

        // userId is required to find the user
        // userId must be valid ObjectID
        // at least one of the name and password is required to perform an update
        if(!userId || !ObjectId.isValid(userId) || (!name && !password)) {
            return res.status(httpStatus.BAD_REQUEST).send({ error: "Bad request" })
        }

        // fetch user
        const user = await User.findOne({ filter: { _id: userId } });

        // return 404 if user does not exist
        if(!user) {
            return res.status(httpStatus.NOT_FOUND).send({ error: "User with that id does not exist" })
        }

        // update user fields
        if(name) user.name = name;
        if(password) user.password = password;

        // save user updates
        await user.save();

        // return saved user fields
        return res.status(httpStatus.OK).send({
            id: user?._id,
            name: user?.name,
            email: user?.email
        })
    } catch(err) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ message: "server error" });
    }
};

const deleteOne = async (req, res) => {
    try {
        const userId = req.params.id;

        // userId is required to find the user
        // userId must be valid ObjectID
        if(!userId || !ObjectId.isValid(userId)) {
            return res.status(httpStatus.BAD_REQUEST).send({ error: "Bad request" })
        }

        // delete user
        const result = await User.deleteOne({ filter: { _id: userId } });
        
        // check deleted object count
        if(result?.deletedCount === 0) {
            return res.status(httpStatus.NOT_FOUND).send({ error: "User with that id does not exist" })
        }

        // return success
        return res.status(httpStatus.OK).send();
    } catch(err) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ message: "server error" });
    }
};

const getById = async (req, res) => {
    try {
        const userId = req.params.id;

        // userId is required to find the user
        // userId must be valid ObjectID
        if(!userId || !ObjectId.isValid(userId)) {
            return res.status(httpStatus.BAD_REQUEST).send({ error: "Bad request" })
        }

        // find user with id
        const user = await User.findOne({ filter: { _id: userId }, select: '-password' });

        // return 404 if user does not exist
        if(!user) {
            return res.status(httpStatus.NOT_FOUND).send({ error: "User with that id does not exist" })
        }

        // return user object
        return res.status(httpStatus.OK).send({ 
            id: user?._id,
            name: user?.name,
            email: user?.email
         });
    } catch(err) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ message: "server error" });
    }
};

const getAll = async (req, res) => {
    try {
        // fetch all users
        const users = await User.find({ select: '-password' });

        // return 404 if no user exists
        if(users?.length === 0) {
            return res.status(httpStatus.NOT_FOUND).send({ error: "There is no user" })
        }

        // return users
        return res.status(httpStatus.OK).send(users?.map(user => ({
            id: user?._id,
            name: user?.name,
            email: user?.email
        })))
    } catch(err) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ message: "server error" });
    }
};

module.exports = {
    create, 
    updateOne,
    deleteOne,
    getById,
    getAll 
};