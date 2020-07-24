import React from 'react';

const Notification = ({ message, isSucces }) => {

  const genericStyle = {
    background: 'lightgrey',
    fontSize: '20px',
    borderStyle: 'solid',
    borderRadius: '5px',
    padding: '10px',
    marginBottom: '10px'
  };

  const successStyle = {
    color: 'green',
    ...genericStyle
  };

  const failureStyle = {
    color: 'red',
    ...genericStyle
  };
  
  return (
    <div style={isSucces ? successStyle : failureStyle}>
      { message }
    </div>
  );
};

export default Notification;