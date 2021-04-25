import ioa from 'ioa';
import axios from 'axios';

await ioa.loadApp("./main");

axios.defaults.baseURL = 'http://localhost:8600';
