require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

const app = express()

app.use(express.json())
app.use(cors())

// serve the frontend
app.use(express.static('build'))


const generateId = () => {
  return Math.floor(Math.random() * 99999999)
}

// Custom morgan token for post requests
// Logs the request body only when a POST request is made
morgan.token('body', req => {
  if (req.method == 'POST') {
    return JSON.stringify(req.body)
  }
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

app.get('/info', (request, response) => {
  Person.find({}).then(persons => {
    response.send(`
    <p>Phonebook has info for ${persons.length} people</p>
    <p>${Date()}</p>`
    )
  })
})

app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id
  
  Person.findById(id).then(person => {
    if (person) {
      response.json(person)
    } else {
      response.status(404).end()
    }
  })
  .catch(err => {
    console.log(err)
    response.status(500).end()
  })
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  
  // check if the person exists and delete the resource if so  
  const personToDelete = persons.findIndex(person => person.id === id)
  if (personToDelete !== -1) {
    persons.splice(personToDelete, 1)
  }
  
  // return 204 regardless
  return response.status(204).end()
})

app.post('/api/persons', (request, response) => {  
  const { name, number } = request.body
  
  // check if the name or number is missing
  if (!name || !number) {
    return response.status(400).json({
      error: 'name or number is missing'
    })
  }
  
  // create the new person mongoose object
  const newPerson = new Person({ name, number })

  // save the new person to the db
  newPerson.save().then(savedPerson => {
    response.json(savedPerson)
  })
  .catch(err => {
    console.log('error', err)
    response.status(500).end()
  })
})

const PORT = process.env.PORT || 8080
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`)
})
