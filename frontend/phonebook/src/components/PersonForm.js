import React from 'react';

const PersonForm = ({ onSubmit, nameChangeHandler, numberChangeHandler, newName, newNumber }) => {
  return (
    <>
      <form onSubmit={onSubmit}>
        <div>
          name: <input onChange={nameChangeHandler} value={newName}/> <br/>
          number: <input onChange={numberChangeHandler} value={newNumber}/>
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
    </>
  );
};

export default PersonForm;