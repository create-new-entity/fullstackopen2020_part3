import React from 'react';


const Filter = ({ onChange, value }) => {
  return <input onChange={onChange} value={value}/>;
};

export default Filter;