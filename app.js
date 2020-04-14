import express from 'express';
import { json } from 'body-parser';
import jsontoxml from 'jsontoxml';
import fs from 'fs';
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

const getDurationInMilliseconds = (start) => {
  const NS_PER_SEC = 1e9;
  const NS_TO_MS = 1e6;
  const diff = process.hrtime(start);

  return (diff[0] * NS_PER_SEC + diff[1]) / NS_TO_MS;
};

app.use((req, res, next) => {
  const start = process.hrtime();

  res.on('finish', () => {
    const durationInMilliseconds = getDurationInMilliseconds(start);
    const logString = `${req.method} \t ${req.originalUrl} \t ${res.statusCode} \t ${Math.trunc(durationInMilliseconds.toLocaleString())}ms\n`;
    fs.appendFile('logs.txt', logString, (err) => {
      if (err) {
        res.send(err);
      }
    });
  });
  next();
});

app.post('/api/v1/on-covid-19', (req, res) => {
  const response = estimator(req.body);
  res.status(200).json(response);
});

app.post('/api/v1/on-covid-19/json', (req, res) => {
  const response = estimator(req.body);
  res.set('Content-Type', 'application/json');
  res.status(200).json(response);
});

app.post('/api/v1/on-covid-19/xml', (req, res) => {
  const jsonResponse = estimator(req.body);
  res.set('Content-Type', 'application/json');
  const xmlResponse = jsontoxml(jsonResponse, true);

  res.set('Content-Type', 'text/xml');
  res.status(200).send(xmlResponse);
});

// app.post('/api/v1/on-covid-19/:format', (req, res) => {
//   const response = estimator(req.body);
//   switch (req.params.format) {
//     case 'json':
//       res.status(200).json(response);
//       break;

//     case 'xml': {
//       const jsonResponse = estimator(req.body);
//       const xmlResponse = jsontoxml(jsonResponse, true);

//       res.set('Content-Type', 'text/xml');
//       res.status(200).send(xmlResponse);
//     }
//       break;

//     default:
//       res.status(404).json({
//         status: 'error',
//         error: 'Invalid Parameter. Use "json" or "xml" instead'
//       });
//       break;
//   }
// });

app.get('/api/v1/on-covid-19/logs', (req, res) => {
  fs.readFile('logs.txt', (err, data) => {
    res.set('Content-Type', 'text/plain');
    res.status(200).send(data);
  });
});

export default app;
