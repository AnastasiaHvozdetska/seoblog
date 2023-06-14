const mongoose = require("mongoose")

const moviesSchema = new mongoose.Schema({
  //for each value in a movie you need minimum to specify the type: string number,float,array...
  title: {
    type: String,
    required: true,
  },
  year: {
    type: Number,
  },
})

module.exports = mongoose.model("Movies", moviesSchema)
