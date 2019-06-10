const { buildSchema } = require('graphql');
const userFacade = require('./facades/userFacade');
const { ApolloServer, gql } = require("apollo-server");
const LRU = require("lru-cache");

const connect = require("./dbConnect").connect;



const typeDefs = `
	type Mutation {
		addNewUser(firstName: String!, lastName: String!, userName: String!, email: String!, password: String!): User
		addLocationBlog(info: String!, pos: PosInput!, author: String!): Blog
		likeLocationBlog(userName: String!, blogId: String!): Blog
		logUserIn(userName: String!, password: String!): User
	},
	type Query {
		user(userName: String!): User
		blogs: [Blog]
		users: [User]
		nearbyUsers(pos: PosInput!, dist: Float!): [User]
		blogByPos(pos: PosInput!): Blog
	},
	type User {
		_id: String
		firstName: String
		lastName: String
		userName: String
		email: String
		password: String
		job: [Job]
		created: String
		lastUpdated: String
	},
	type Job {
		type: String
		company: String
		companyUrl: String
	},
	type Blog {
		_id: String
		info: String
		img: String
		pos: Position
		author: User
		likedBy: [User]
		created: String
		lastUpdated: String
	},
	type Position {
		longitude: Float!
		latitude: Float!
	},
	input PosInput {
		longitude: Float!
		latitude: Float!
	}
`;

const cache = LRU({ max: 50, maxAge: 1000 * 60 * 60 });

// Provide resolver functions for your schema fields
const resolvers = {
    Query: {
        users: async () => {
            return await userFacade.getAllUsers();
        },
        user: async (root, { userName }) => {
            return await userFacade.findByUserName(userName);
        },
        nearbyUsers: async (root, { pos, distance }) => {
            return await userFacade.findNearbyUsers(pos, distance);
        },
        blogs: async () => {
            return await blogFacade.getAllBlogs();
        },
        blogByPos: async (root, { pos }) => {
            return await blogFacade.findByPos(pos);
        }
    },
    Mutation: {
        addNewUser: async (root, { firstName, lastName, userName, email, password }) => {
            let user = { firstName: firstName, lastName: lastName, email: email, userName: userName, password: password };
            user = await userFacade.addUser(user);
            cache.set(user._id, user);
            return user;
        },
        addLocationBlog: async (root, { info, pos, authorName }) => {
            let author = userFacade.findByUserName(authorName);
            let blog = { info: info, pos: pos, author: author };
            blog = blogFacade.addLocationBlog(blog);
            cache.set(blog._id, blog);
            return blog;
        },
        likeLocationBlog: async (root, { userName, blogId }) => {
            let user = await userFacade.findByUserName(userName);
            let blog = await blogFacade.likeLocationBlog(user, blogId)
            cache.set(user._id, user);
            cache.set(blog._id, blog);
            return blog;
        }
    }
};

/* Used if you do not use apollo
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
*/

const server = new ApolloServer({
    typeDefs,
    resolvers
});

//module.exports = {schema, root};


connect(require("./settings").DEV_DB_URI);
//require("./database/dbInit").dbInit();

server.listen().then(({ url }) => {
    console.log(`Server ready at ${url}`);
});