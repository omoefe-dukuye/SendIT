import express from 'express';
import bodyParser from 'body-parser';
import router from './routes/index';

const app = express();

const PORT = process.env.PORT || 3000;

// parse incoming requests with middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// use express router middleware
app.use(router);


app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server started on port ${PORT}`);
});

export default app;
