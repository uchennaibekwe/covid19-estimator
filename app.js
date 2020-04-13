import express from 'express';
import { json } from 'body-parser';
import jsontoxml from 'jsontoxml';
import { createServer } from 'http';
import estimator from './src/estimator';


const app = express();
app.use(json());

// CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

app.get('/', (req, res) => {
  res.status(200).json({
    status: 'success'
  });
});

app.post('/api/v1/on-covid-19', (req, res) => {
  const response = estimator(req.body);
  res.status(200).json(response);
});

app.post('/api/v1/on-covid-19/:format', (req, res) => {
  const response = estimator(req.body);
  switch (req.params.format) {
    case 'json':
      res.status(200).json(response);
      break;

    case 'xml': {
      const jsonResponse = estimator(req.body);
      const xmlResponse = jsontoxml(jsonResponse, true);

      res.set('Content-Type', 'text/xml');
      res.status(200).send(xmlResponse);
    }
      break;

    default:
      res.status(404).json({
        status: 'error',
        error: 'Invalid Parameter. Use "json" or "xml" instead'
      });
      break;
  }
});

const server = createServer(app);
server.listen(process.env.PORT || 3000);
console.log('started at 3000');
