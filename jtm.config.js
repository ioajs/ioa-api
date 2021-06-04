import ioa from 'ioa';
import axios from 'axios';

await ioa.apps("./main");

axios.defaults.baseURL = 'http://localhost:8600';
