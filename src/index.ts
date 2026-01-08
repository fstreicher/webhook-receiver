import express from 'express';
import * as fs from 'fs';
import path from 'path';

const app = express()
const port = 3000

app.use(express.json({ limit: '50mb' }));

app.get('/', async (req, res) => {
  const params = req.query;
  processWebhook(params, res);
});

app.post('/', async (req, res) => {
  const body = req.body;
  // console.log(JSON.stringify(req.headers, null, 2));
  processWebhook(body, res);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});


async function processWebhook(content: any, res: any) {
  console.debug(new Date().toISOString());

  /* Print partial payload */
  // console.debug(JSON.stringify(content, null, 2).slice(0, 200));

  /* Save payload to file */
  try {
    saveToFile(content, `${new Date().toISOString()}.json`, content.type);
  } catch (error) {
    console.error(error);
  }


  /* Simulate a delay before returning a response */
  // const DELAY = 61_000; // ms
  // console.debug(`Waiting ${DELAY / 1000}s...`);
  // await new Promise(resolve => setTimeout(resolve, DELAY));
  // console.debug('Done waiting');

  /* Return a successful response */
  res.send('Hello World!');

  /* Simulate an error */
  // const errorMessage = '❌ Webhook failed';
  // res.status(400).send(errorMessage);

  /* randomly decide to return an error */
  // if (Math.random() < 0.5) {
  //   console.debug('RANDOM ERROR');
  //   res.status(400).send('random export error');
  // } else {
  //   console.debug('RANDOM SUCCESS');
  //   res.status(201).send('Hello World!');
  // }

}

function saveToFile(content: any, filename: string, directory?: string) {
  console.debug(`Saving to file ${filename} ${directory ? `(directory: ${directory})` : ''}`);
  // const dir = path.join('C:/Users', os.userInfo().username, 'Desktop', 'webhook', directory ?? '');
  const dir = path.join(__dirname, '../data', directory ?? '');
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(
    path.join(dir, filename.replace(/:/g, '_')),
    JSON.stringify(content, null, 2)
  );
}