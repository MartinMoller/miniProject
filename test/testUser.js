var connect = require("../dbConnect.js").connect;
var disconnect = require("../dbConnect.js").disconnect;
const expect = require("chai").expect;
const assert = require("chai").assert;
const userFacade = require("../facades/userFacade");

describe("Test user facade", function () {
    before(function () {
        connect(require("../settings").TEST_DB_URI);
    });
    beforeEach(function () {
        userFacade.deleteAll();
    });

    it("Creates a user", function (done) {
        var user = {
            firstName: "Allan", lastName: "Andersen", userName: "admin", password: "1234", email: "a@a.dk",
            job: [{ type: "t1", company: "c1", companyUrl: "url" }, { type: "t1", company: "c1", companyUrl: "url" }]
        }
        userFacade.addUser(user);
        assert(!user.isNew);
        done();
    });

    it("Gets all users", async function () {
        var user1 = {
            firstName: "Allan", lastName: "Andersen", userName: "admin1", password: "1234", email: "a1@a.dk",
            job: [{ type: "t1", company: "c1", companyUrl: "url" }, { type: "t1", company: "c1", companyUrl: "url" }]
        }
        var user2 = {
            firstName: "Allan", lastName: "Andersen", userName: "admin2", password: "1234", email: "a2@a.dk",
            job: [{ type: "t1", company: "c1", companyUrl: "url" }, { type: "t1", company: "c1", companyUrl: "url" }]
        }
        var user3 = {
            firstName: "Allan", lastName: "Andersen", userName: "admin3", password: "1234", email: "a3@a.dk",
            job: [{ type: "t1", company: "c1", companyUrl: "url" }, { type: "t1", company: "c1", companyUrl: "url" }]
        }
        await userFacade.addUser(user1);
        await userFacade.addUser(user2);
        await userFacade.addUser(user3);

        let users = await userFacade.getAllUsers();

        expect(users).to.be.an("array");
        expect(users.length).to.equal(3);
        expect(users[0].userName).to.equal("admin1");

    });

    it("Gets user by username", async function () {
        var user1 = {
            firstName: "Allan", lastName: "Andersen", userName: "admin1", password: "1234", email: "a1@a.dk",
            job: [{ type: "t1", company: "c1", companyUrl: "url" }, { type: "t1", company: "c1", companyUrl: "url" }]
        }
        await userFacade.addUser(user1);
        let userFromDb = await userFacade.findByUserName("admin1");

        expect(userFromDb.userName).to.equal(user1.userName);
    })

    after(function () {
        disconnect();

        console.log('DB CLOSED')

    });
});