var User = require("../models/User.js");
var Position = require("../models/Position");

function positionCreator(lon, lat, userId, dateInFuture) {
    var posDetail = { user: userId, loc: { coordinates: [lon, lat] } }
    if (dateInFuture) {
        posDetail.created = "2022-09-25T20:40:21.899Z"
    }
    return posDetail;
}

async function addUser(user) {
    try {
        await User.create(user);
    }
    catch (err) {
        console.log("Der skete en fejl: " + err);
    }
}

async function getAllUsers() {
    return await User.find({});
}

async function deleteAll() {
    await User.deleteMany({});
}

async function findByUserName(username) {
    return await User.findOne({ userName: username });
}

async function login(body) {

    user = await User.findOne({ userName: body.userName }, function (err, u) {
        if (err || u == null) {
            throw new Error();
        }
        else {
            Position.findOneAndUpdate(
                { user: u._id },
                { $set: { loc: { type: "Point", coordinates: [body.longitude, body.latitude] }, created: Date.now() } },
                { upsert: true, new: true }, function (err, pos) {
                    if (err) {
                        throw new Error(err);
                    }
                    console.log(pos);
                });
        }
    })
    if (user.password != body.password) {
        return null;
    }
    return user;

}

async function findNearbyUsers(lon, lat, dist) {
    return Position.find({
        loc: {
            $near: {
                $geometry: { type: "Point", coordinates: [lon, lat] },
                $maxDistance: dist,
                $minDistance: 0
            }
        }
    }, {}).populate("user")
}

module.exports = {
    addUser,
    getAllUsers,
    findByUserName,
    deleteAll,
    login,
    findNearbyUsers

}