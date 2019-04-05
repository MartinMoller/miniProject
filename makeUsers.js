var connect = require("./dbConnect.js");
connect(require("./settings").DEV_DB_URI);

var User = require("./models/User.js");
var LocationBlog = require("./models/LocationBlog.js");
var Position = require("./models/Position.js");

function positionCreator(lon, lat, userId, dateInFuture) {
    var posDetail = { user: userId, loc: { coordinates: [lon, lat] } }
    if (dateInFuture) {
        posDetail.created = "2022-09-25T20:40:21.899Z"
    }
    return posDetail;
}
async function makeData() {
    console.log("Making users")
    try {
        var userInfos = [{
            firstName: "Allane", lastName: "Andersen", userName: "admin", password: "1234", email: "a@a.dk",
            job: [{ type: "t1", company: "c1", companyUrl: "url" }, { type: "t1", company: "c1", companyUrl: "url" }]
        },
        {
            firstName: "Olene", lastName: "Andersen", userName: "admin2", password: "1234", email: "b@a.dk",
            job: [{ type: "t1", company: "c1", companyUrl: "url" }, { type: "t1", company: "c1", companyUrl: "url" }]
        },
        {
            firstName: "Mortene", lastName: "Andersen", userName: "admin3", password: "1234", email: "c@a.dk",
            job: [{ type: "t1", company: "c1", companyUrl: "url" }, { type: "t1", company: "c1", companyUrl: "url" }]
        }];
        await User.deleteMany({});
        await Position.deleteMany({});
        await LocationBlog.deleteMany({})

        var users = await User.insertMany(userInfos);
        console.log(users);

        var positions = [positionCreator(12.549648284912108, 55.786081644399324, users[0]._id, true), positionCreator(12.561063766479492, 55.79235510128348, users[1]._id, true), positionCreator(12.56338119506836, 55.783958091676986, users[2]._id, true)]
        var blogs = [{ info: "Cool Place", pos: { longitude: 26, latitude: 57 }, author: users[0]._id },]

        Position.insertMany(positions);
        LocationBlog.insertMany(blogs);


    } catch (err) {
        console.log(err);
    }
}
makeData();
