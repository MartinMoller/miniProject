const { buildSchema } = require('graphql');
const userFacade = require('./facades/userFacade');

const schema = buildSchema(`
    type User {
        _id: String
        firstName: String
        lastName: String
        userName: String
        password: String
        job: [Job]
        email: String
        created: String
        lastUpdated: String
    },
    type Job {
        type: String
        company: String
        companyUrl: String
    },
    
    input UserInput {
		firstName: String
		lastName: String
		userName: String
		email: String
		password: String
	},

    type Mutation {
        addNewUser(user: UserInput): User
    },

    type Query {
        hello: String
        getUserByUsername(userName: String!): User
        getAllUsers: [User]
        findNearbyUsers(lon: Float!, lat: Float!, dist: Float!): [User]
    }
    
`);

const getAllUsers = async () => {return await userFacade.getAllUsers();};
const getUserByUserName = async (args) => {return await userFacade.findByUserName(args.userName);};
const findNearbyUsers = async (args) => {return await userFacade.findNearbyUsers(args.lon, args.lat, args.dist);};
const addNewUser = async (args) => {let user = { firstName: args.user.firstName, lastName: args.user.lastName, email: args.user.email, userName: args.user.userName, password: args.user.password }; return await userFacade.addUser(user);};

const root = {
    getAllUsers,
    getUserByUserName,
    findNearbyUsers,
    addNewUser
};

module.exports = {schema, root};


/*
    firstName: String,
    lastName: String,
    userName: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    job: [JobSchema],
    created: { type: Date, default: Date.now },
    lastUpdated: Date
*/