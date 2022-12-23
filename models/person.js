const mongoose = require('mongoose')
mongoose.set('strictQuery', true) // to suppress annoying warning
const url = process.env.MONGODB_URL

console.log('connecting to', url)

mongoose.connect(url)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch(err => {
    console.log('error connecting to MongoDB:', err.message)
  })

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true
  },
  number: {
    type: String,
    minLength: 8,
    required: true,
    validate: {
      validator: (v) => {
        // check validity with regex
        return /^(?:\d{2}-\d{6,}|\d{3}-\d{5,}|\d{8,})?$/.test(v)
      },
      message: 'Malformatted phone number'
    }
  }
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)