import axios from 'axios';

const endpointUrl = 'http://localhost:3001/api/persons';

const getAll = () => {
  return axios
          .get(endpointUrl)
          .then(response => response.data);
};

const create = (person) => {
  return axios
          .post(endpointUrl, person)
          .then(response => response.data);
};

const deleteContact = (id) => {
  return axios
          .delete(`${endpointUrl}/${id}`)
          .then(response => response.data);
};

const update = (id, updatedObj) => {
  return axios
          .put(`${endpointUrl}/${id}`, updatedObj)
          .then(response => response.data);
}

export default {
  getAll,
  create,
  deleteContact,
  update
};