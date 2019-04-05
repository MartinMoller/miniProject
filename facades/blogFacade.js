var LocationBlog = require("../models/LocationBlog.js");


function addLocationBlog(blog) {
    LocationBlog.create(blog);
}

function likeLocationBlog(user, blog) {
    LocationBlog.update(
        { _id: blog._id },
        { $push: { likedBy: user._id } })
}

module.exports = {
    addLocationBlog,
    likeLocationBlog
}