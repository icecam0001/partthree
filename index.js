require('dotenv').config()
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')
const mongoose = require('mongoose')

const PORT = process.env.PORT
const url = process.env.MONGODB_URI

mongoose.set('strictQuery', false)
mongoose.connect(url)

app.use(express.json())
app.use(morgan('tiny'))
app.use(cors())
app.use(express.static('frontend'))
app.use(express.static('dist'))

app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :post')
)

morgan.token('post', (req) => {
  return req.method === 'POST' ? JSON.stringify(req.body) : ' '
})

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
  const body = request.body

  if (Object.keys(body).length === 0) {
    return response.status(400).json({
      error: 'content missing'
    })
  }

  const person = new Person({
    name: body.name,
    number: body.number
  })

  person.save()
    .then(savedPerson => savedPerson.toJSON())
    .then(savedAndFormattedPerson => {
      console.log(`added ${person.name} number ${person.number} to phonebook`)
      response.json(savedAndFormattedPerson)
    })
    .catch(error => next(error))
})

app.get('/info', (request, response) => {
  const currentDate = new Date().toLocaleString()
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
  Person.countDocuments({})
    .then(count => {
      response.send(`
        <div>
            <p>Phonebook has info for ${count} people</p>
        </div>
        <div>
            <p>${currentDate} (${timeZone})</p>
        </div>`)
    })
    .catch(error => next(error))
})

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})