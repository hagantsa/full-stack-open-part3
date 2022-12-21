const mongoose = require('mongoose')

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

const getAllEntries = () => {
  Person
    .find({})
    .then(result => {
      result.forEach(person => {
        console.log(person.name, person.number)
      })
      mongoose.connection.close()
    })
}

const addPerson = (name, number) => {
  const person = new Person({
    name: name,
    number: number
  })

  person.save()
    .then(result => {
      console.log(`added ${name} number ${number} to phonebook`)
      mongoose.connection.close()
    })
    .catch(err => console.log(err))
}


if (process.argv.length < 3) {
  console.log('Please provide at least the password as an argument: node mongo.js <password>')
  process.exit(1)
}

const password = process.argv[2]
const url = `mongodb+srv://fullstack_pro:${password}@phonebook-thingy.q5kmktj.mongodb.net/phoneBookApp?retryWrites=true&w=majority`


if (process.argv.length == 3) {
  mongoose.connect(url)
  getAllEntries()
} else {

  if (process.argv.length == 4) {
    console.log('Please provide both a person name and number: node mongo.js <password> <name> <number>')
    process.exit(1)
  }
  
  if (process.argv.length > 5) {
    console.log('Please enclose names or numbers with whitespaces in quotes')
    process.exit(1)
  }
  
  const name = process.argv[3]
  const number = process.argv[4]
  mongoose.connect(url)

  addPerson(name, number)
}




