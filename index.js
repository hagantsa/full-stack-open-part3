require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')
const { response } = require('express')

const app = express()

app.use(express.json())
app.use(cors())

// serve the frontend
app.use(express.static('build'))

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

app.get('/api/persons/:id', (request, response, next) => {
  const id = request.params.id
  
  Person.findById(id).then(person => {
    if (person) {
      response.json(person)
    } else {
      response.status(404).end()
    }
  })
  .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  const id = request.params.id

  Person.findByIdAndRemove(id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {  
  const { name, number } = request.body
  
  // check if the name or number is missing
  if (!name || !number) {
    return response.status(400).json({
      error: 'name or number is missing'
    })
  }
  
  // Check if person already exists in db
  Person.exists({ name: name }).then(person => {
    // return 400 if person exists
    if (person) {
      return response.status(400).send({ error: 'Person already exists' })
    }

    // create the new person mongoose object
    const newPerson = new Person({ name, number })
  
    // save the new person to the db
    newPerson.save().then(savedPerson => {
      response.json(savedPerson)
    })
    .catch(error => {
      next(error)
    })
  })
})

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body
  const id = request.params.id
  
  // modify only the person's number when it's updated
  const modifiedNumber = body.number

  Person.findByIdAndUpdate(
    id, 
    { number: modifiedNumber },
    { new: true, runValidators: true, context: 'query' }
  )
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.log(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }

  // return 400 if the name/number is not formatted correctly
  if (error.name === 'ValidationError') {
    return response.status(400).send({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 8080
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`)
})
