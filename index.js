const { response } = require('express')
const express = require('express')
const app = express()

app.use(express.json())

const PORT = 3001

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

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`)
})
