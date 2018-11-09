import dataMain from '../data/data';
import dataTest from '../data/dummy';

const env = process.env.NODE_ENV;

let data;

if (env === 'test') {
  data = dataTest;
} else {
  data = dataMain;
}

const output = data;

export default output;
