const express = require('express')
const app = express()
require('dotenv').config()
app.use(express.static('dist'))
app.use(express.json())
const PORT = process.env.PORT

const mongoose = require('mongoose')
const PersonPhonebook = require('./models/person')
const url = process.env.MONGODB_URI

mongoose.set('strictQuery',false)
mongoose.connect(url)

app.get('/api/persons', (req, res) => {
  PersonPhonebook.find({}).then(persons => {
    res.json(persons)
  })
})

app.post('/api/persons', (req, res) => {
  const body = req.body
  if (!body.name || !body.number) {
    return res.status(400).json({
      error: "name or number missing"
    })
  }
  const person = new PersonPhonebook ({
    name: body.name,
    number: body.number 
  })
  person.save().then(savedPerson => {
    res.json(savedPerson)
  })
})

app.put('/api/persons/:id', (req, res)  => {
  PersonPhonebook.findOneAndUpdate(
    { name: req.body.name }, 
    { number: req.body.number }, 
    { new: true })
    .then(updatedPerson => res.json(updatedPerson))
    .catch(error => next(error))
})

app.get('/api/persons/:id', (req, res, next) => {
  PersonPhonebook.findById(req.params.id)
    .then(person => {
      if (person) {
        res.json(person)
      } else {
        res.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (req, res, next) => {
  PersonPhonebook.findByIdAndDelete(req.params.id)
    .then(result => {
      res.status(204).end()
    })
    .catch(error => next(error))
})



const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } 

  next(error)
}
app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})