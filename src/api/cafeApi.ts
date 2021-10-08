import axios from 'axios';

const baseURL = 'https://rn-cafe-backend.herokuapp.com/api';

const cafeApi = axios.create({baseURL});

export default cafeApi;
