import React, { useState, useEffect } from 'react';

import Filter from './components/Filter';
import PersonForm from './components/PersonForm';
import Persons from './components/Persons';
import Notification from './components/Notification';

import phonebookService from './services/contacts';

const notificationDelay = 2000;

const App = () => {
  const [ persons, setPersons ] = useState([]);
  const [ newName, setNewName ] = useState('');
  const [ newNumber, setNewNumber ] = useState('');
  const [ filter, setFilter ] = useState('');
  const [ notification, setNotification ] = useState(null);

  useEffect(() => {
    phonebookService
      .getAll()
      .then(persons => setPersons(persons));
  }, []);
  
  const handleInputChange = (setNameOrNumber) => {
    return (event) => {
      setNameOrNumber(event.target.value);
    };
  };

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  }
  
  const handleDelete = (id) => {
    return () => {
      if((window.confirm(`Do you want to delete ${persons.filter(person => person.id === id)[0].name}?`)) === false) return;
      phonebookService
        .deleteContact(id)
        .then(_ => {
          setPersons(persons.filter(person => person.id !== id));
        });
    };
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    let newPerson = {
      name: newName,
      number: newNumber
    };

    if(persons.some((person) => person.name === newName)) {
      if(window.confirm(`Would you like to update ${persons.find(person => person.name === newName).name}?`)){
        let id = persons.find(person => person.name === newName).id;
        phonebookService
          .update(id, newPerson)
          .then((response) => {
            setNewName('');
            setNewNumber('');
            let newPersons = persons
                              .filter(person => person.id !== id)
                              .concat(response);
            setPersons(newPersons);
            setNotification({
              message: `Updated ${response.name}`,
              isSucces: true
            });
            setTimeout(() => {
              setNotification(null);
            }, notificationDelay);
          })
          .catch(error => {
            if(error.response.status === 404) {
              setNotification({
                message: `${newName} might have already been deleted. Update failed.`,
                isSucces: false
              });
            }
            setPersons(persons.filter(person => person.id !== id));
            setNewName('');
            setNewNumber('');
            setTimeout(() => {
              setNotification(null);
            }, notificationDelay);
          });
      }
      return;
    }
    
    
    phonebookService
      .create(newPerson)
      .then(response => {
        setPersons(persons.concat(response));
        setNewName('');
        setNewNumber('');
        setNotification({
          message: `Added ${response.name}`,
          isSucces: true
        });
            setTimeout(() => {
              setNotification(null);
            }, notificationDelay);
      });
  };

  let notificationComponent = null;

  if(notification) {
    notificationComponent = <Notification message={notification.message} isSucces={notification.isSucces}/>;
  }

  return (
    <div>
      <h2>Phonebook</h2>
      {notificationComponent}
      filter: <Filter onChange={handleFilterChange} value={filter}/>
      <h2>Add a new</h2>
      <PersonForm
        onSubmit={handleSubmit}
        nameChangeHandler={handleInputChange(setNewName)}
        numberChangeHandler={handleInputChange(setNewNumber)}
        newName={newName}
        newNumber={newNumber}
      />
      <h2>Numbers</h2>
      <Persons
        persons={persons.filter(person => person.name.includes(filter))}
        handleDelete={handleDelete}
      />
    </div>
  )
}

export default App