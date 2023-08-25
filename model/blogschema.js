const mongoose = require('mongoose');
const BlogSchema = mongoose.Schema({
    image : {
        type : String,
        required : true
    },
    title : {
        type : String,
        required : true
    },
    description : {
        type : String,
        required : true
    }
})
const Blogrecord = mongoose.model('blog',BlogSchema);
module.exports = Blogrecord;