import React from 'react';

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

export default Persons