const express = require('express')
const app = express()
const PORT = process.env.PORT || 3001
const morgan = require("morgan")
const cors = require("cors")

app.use(express.json())
app.use(cors())
app.use(morgan(function (tokens, req, res) {
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms',
    JSON.stringify(req.body)
  ].join(' ')
}))

let persons = [
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

const getCurrentDate = () => {
  return new Date
}

const generateId = () => {
  return Math.floor((Math.random() * 1e6) + 1);
}

app.get('/api/persons', (req, res) => {
  res.json(persons)
})

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  const person = persons.find(person => person.id === id)
  if (person) {
    res.json(person)
  } else {
    res.status(404).end()
  }
})

app.post('/api/persons', (req, res) => {
  
  const body = req.body

  if (!body.name || !body.number) {
    return res.status(400).json({
      error: "name or number missing"
    })
  }

  if (persons.map(person => person.name).includes(body.name)) {
    return res.status(400).json({
      error: "name must be unique"
    })
  }

  const person = {
    id: generateId(),
    name: body.name,
    number: body.number 
  }
  persons = persons.concat(person)
  res.json(person)
})

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  persons = persons.filter(person => person.id !== id)
  res.status(204).end()
})

app.get('/info', (req, res) => {
  const numOfPersons = persons.length
  res.send(`
  <p>Phonebook has info for ${numOfPersons} people</p>
  <p>${getCurrentDate()}</p>
  `)
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
