var LocationBlog = require("../models/LocationBlog.js");


async function addLocationBlog(blog) {
    return await LocationBlog.create(blog);
}

async function likeLocationBlog(user, blog) {
    return await LocationBlog.findByIdAndUpdate(blog._id,
        { $push: { likedBy: user._id } }).populate("likedBy").populate("author");
}

async function findById(blogId) {
    return await LocationBlog.findOne({ _id: blogId }).populate("likedBy").populate("author");
}

module.exports = {
    addLocationBlog,
    likeLocationBlog,
    findById
}