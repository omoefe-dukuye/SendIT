import 'babel-polyfill';
import express from 'express';
import bodyParser from 'body-parser';
import router from './routes/index';

const app = express();

const PORT = process.env.PORT || 3000;

// parse incoming requests with middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('ui'));
// use express router middleware
app.use(router);

app.get('/api/v1', (req, res) => {
  const welcome = '<h1>Welcome!!! <br> This is the SendIT API Version 1.0</h1> <h2>navigate to https://the-sendit-app.herokuapp.com/ to see the ui templates</h2>';
  res.status(200).send(welcome);
});

app.all('*', (request, response) => {
  response.status(404).send('<h2>Look what the cat dragged in! <br> please enter a valid route</h2>');
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server started on port ${PORT}`);
});

export default app;
