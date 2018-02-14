var mongoose = require('mongoose')

var pathSchema = new mongoose.Schema({
  path_id: {
    type: Number
  },
  path_free: {
    type: Boolean
  },
  path_difficulty: {
    type: String
  },
  grips: {
    type: Array,
    grip_id: {
      type: Number
    },
    grip_data: {
      type: Number
    },
    grip_on: {
      type: Boolean
    }
  }
})

const Path = mongoose.model('climbing_paths', pathSchema)
module.exports = Path
