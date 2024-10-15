import React, { useState, useEffect } from 'react'

import PersonForm from './components/PersonForm'
import Filter from './components/Filter'
import phoneService from './services/phoone'

import axios from 'axios'



const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [Message, setMessage] = useState('')

  const hook = () => {
    console.log('effect')
    axios
      .get('http://localhost:3001/api/persons')
      .then(response => {
        console.log('promise fulfilled')
        setPersons(response.data)
      })
  }
  
  useEffect(hook, [])
  
  const addPerson = (event) => {
    event.preventDefault()

    const existingPerson = persons.find(person => person.name === newName)

    if (existingPerson) {
      const confirmUpdate = window.confirm(`${newName} is already added to phonebook. Do you want to replace the old number?`)

      if (confirmUpdate) {
        const updatedPerson = { ...existingPerson, number: newNumber }

        phoneService
          .update(existingPerson.id, updatedPerson)
          .then(response => {
            setPersons(persons.map(person => person.id !== existingPerson.id ? person : response.data))
            setNewName('')
            setNewNumber('')
            setMessage(`Updated ${newName}'s phone number`)
            setTimeout(() => setMessage(null), 5000)
          })
          .catch(error => {
            console.error('Error updating person:', error)
            setMessage(`Error updating ${newName}'s phone number`)
            setTimeout(() => setMessage(null), 5000)
          })
          
      }
    } else {
      const personObject = {
        name: newName,
        number: newNumber,
        id: String(persons.length + 2)
      }

      phoneService
        .create(personObject)
        .then(response => {
          setPersons(persons.concat(response.data))
          setNewName('')
          setNewNumber('')
          setMessage(`Added ${newName}`)
          setTimeout(() => setMessage(null), 5000)
        })
        .catch(error => {
          console.error('Error adding person:', error)
          setMessage(`Error adding ${newName}`)
          setTimeout(() => setMessage(null), 5000)
        })
    }
  }
  const deletePerson = (id) => {
    const personToDelete = persons.find(person => person.id === id);
    if (window.confirm(`Delete ${personToDelete.name}?`)) {
      phoneService.remove(id)
        .then(() => {
          setPersons(persons.filter(person => person.id !== id));
          setMessage(`${personToDelete.name} was successfully deleted`);
          setTimeout(() => setMessage(null), 5000);
        })
    }
  }
  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }
  const Persons = ({ persons, deletePerson }) => {
    return (
      <div>
        {persons.map(person => (
          <div key={person.id}>
            {person.name} {person.number}
            <button onClick={() => deletePerson(person.id)}>Delete</button>
          </div>
        ))}
      </div>
    )
  }
  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }
  const Notification = ({ message }) => {
    if (message === null) {
      return null
    }
  
    return (
      <div className='message'>
        {message}
      </div>
    )
  }
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value)
  }

  const filteredPersons = persons.filter(person =>
    person.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div>
      <h2>Phonebook</h2>

      <Filter value={searchTerm} onChange={handleSearchChange}/>

      <h3>Add a new</h3>
      <Notification message={Message} />
      <PersonForm 
        newNumber={newNumber}
        handleNumberChange={handleNumberChange}
        newName={newName}
        handleNameChange={handleNameChange}
        onSubmit={addPerson}
      />

      <h3>Numbers</h3>

      <Persons persons={filteredPersons} deletePerson={deletePerson} />
    </div>
  )
}

export default App