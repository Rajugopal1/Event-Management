const mongoose = require('mongoose');
const IMGSchema = new mongoose.Schema({
    image: {type: String}
})



module.exports = mongoose.model('media', IMGSchema)