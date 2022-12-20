const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express()

app.use(express.json())
app.use(cors())

// serve the frontend
app.use(express.static('build'))

const PORT = process.env.PORT || 8080

const persons = 
[
  { 
    "id": 1,
    "name": "Arto Hellas", 
    "number": "040-123456"
  },
  { 
    "id": 2,
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
  },
  { 
    "id": 3,
    "name": "Dan Abramov", 
    "number": "12-43-234345"
  },
  { 
    "id": 4,
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
  }
]

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
  response.json(persons)
})

app.get('/info', (request, response) => {
  response.send(`
    <p>Phonebook has info for ${persons.length} people</p>
    <p>${Date()}</p>`
  )
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  
  // look for the person with given id
  const filtered = persons.filter(person => person.id === id)[0]

  // send status code 400 if no person is found
  if (!filtered) {
    return response.status(404).json({
      content: 'person not found'
    })
  }
  
  response.json(filtered)
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)

  // check if the person exists and delete the resource if so  
  const personToDelete = persons.findIndex(person => person.id === id)
  if (personToDelete !== -1) {
    persons.splice(personToDelete, 1)
  }
  console.log(`person with id ${id} deleted`)
  // return 204 regardless
  return response.status(204).end()
})

app.post('/api/persons', (request, response) => {
  const id = generateId()
  
  const { name, number } = request.body
  console.log(name, number)

  // check if the name or number is missing
  if (!name || !number) {
    return response.status(400).json({
      error: 'name or number is missing'
    })
  }

  // check if the name already exists
  if (persons.find(person => person.name === name)) {
    return response.status(400).json({
      error: 'name must be unique'
    })
  }

  // create the new person object and add it to the data structure
  const newPerson = { id, name, number }
  persons.push(newPerson)
  response.json(newPerson)
})

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`)
})
