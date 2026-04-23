import express from 'express';
import * as fs from 'fs';
import path from 'path';
import { pathToFileURL } from 'url';
import { type KeyKind, reducePayload } from './reducePayload';

type LogConfig = {
  filterLogTypes?: Array<KeyKind>;
  ignoreNodeTypes?: Array<string>;
};

const colors = {
  reset: '\x1b[0m',
  cyan: '\x1b[36m',
  orange: '\x1b[38;5;208m',
  red: '\x1b[31m',
};

const app = express()
const port = 3000

app.use(express.json({ limit: '50mb' }));

app.get('/', async (req, res) => {
  const params = req.query;
  processWebhook(params, res, req);
});

app.post('/', async (req, res) => {
  const body = req.body;
  // console.log(JSON.stringify(req.headers, null, 2));
  processWebhook(body, res, req);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});

function pad2(value: number): string {
  return String(value).padStart(2, '0');
}

function getLocalDateStamp(date = new Date()): string {
  const year = date.getFullYear();
  const month = pad2(date.getMonth() + 1);
  const day = pad2(date.getDate());
  return `${year}-${month}-${day}`;
}

function getLocalTimestamp(date = new Date()): string {
  const year = date.getFullYear();
  const month = pad2(date.getMonth() + 1);
  const day = pad2(date.getDate());
  const hours = pad2(date.getHours());
  const minutes = pad2(date.getMinutes());
  const seconds = pad2(date.getSeconds());
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

function getLocalFilenameTimestamp(date = new Date()): string {
  const year = date.getFullYear();
  const month = pad2(date.getMonth() + 1);
  const day = pad2(date.getDate());
  const hours = pad2(date.getHours());
  const minutes = pad2(date.getMinutes());
  const seconds = pad2(date.getSeconds());
  const milliseconds = String(date.getMilliseconds()).padStart(3, '0');
  return `${year}-${month}-${day}T${hours}_${minutes}_${seconds}.${milliseconds}`;
}


async function processWebhook(content: any, res: any, req?: any) {
  const date = `${colors.cyan}${getLocalTimestamp()}${colors.reset}`;
  const contextValue = req?.headers?.['x-context'] || content?.type;
  const context = contextValue ? ` - ${colors.orange}${contextValue}${colors.reset}` : '';
  console.debug(`${date}${context}`);

  /* Extract filter configuration from headers or use defaults */
  let filterLogTypes: Array<KeyKind> = ['name', 'type'];
  let ignoreNodeTypes = ['flow.if', 'flow.switch'];

  try {
    if (req?.headers?.['x-keep-logs']) {
      filterLogTypes = req.headers['x-keep-logs'].split(',').map((s: string) => s.trim());
    }
    if (req?.headers?.['x-ignore-nodes']) {
      ignoreNodeTypes = req.headers['x-ignore-nodes'].split(',').map((s: string) => s.trim());
    }
  } catch (error) {
    console.warn(`${colors.orange}Failed to parse filter headers${colors.reset}`);
  }

  /* Print partial payload */
  // console.debug(JSON.stringify(content, null, 2).slice(0, 200));

  /* Save payload to file */
  try {
    saveToFile(content, `${getLocalFilenameTimestamp()}.json`, contextValue, { filterLogTypes, ignoreNodeTypes });
  } catch (error) {
    console.error(`${colors.red}${error}${colors.reset}`);
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

function saveToFile(content: any, filename: string, directory?: string, config?: LogConfig) {
  // Use current date for folder structure (format: YYYY-MM-DD)
  const today = getLocalDateStamp();
  const dateFolder = directory ? today : '';

  const dir = path.join(__dirname, '../data', directory ?? '', dateFolder);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  const fullPath = path.join(dir, filename.replace(/:/g, '_'));
  const fileUrl = pathToFileURL(fullPath).toString();
  console.debug(`Saving to file: ${fileUrl}\n`);

  if (content.output) {
    content.output = reducePayload(
      content.output,
      config?.filterLogTypes ?? [],
      config?.ignoreNodeTypes ?? []
    );
  }

  fs.writeFileSync(
    fullPath,
    JSON.stringify(content, null, 2)
  );
}