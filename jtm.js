import ioa from 'ioa';
import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:8600';

await ioa.loadApp("./main");
