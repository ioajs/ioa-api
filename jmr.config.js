'use strict';

const ioa = require('ioa');
const axios = require('axios');

ioa.app("./main");

axios.defaults.baseURL = 'http://localhost:8600';
