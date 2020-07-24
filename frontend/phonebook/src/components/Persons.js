import React from 'react';

import Person from './Person';

const Persons = ({ persons, handleDelete }) => {
  return persons.map((person, index) => <Person key={index} person={person} handleDelete={handleDelete}/>);
};

export default Persons;