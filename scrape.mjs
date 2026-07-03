import https from 'https';

const links = [
  'https://ibb.co/Tpjg3L8',
  'https://ibb.co/fYvfq1tM',
  'https://ibb.co/zhw533zr',
  'https://ibb.co/Y41yFqbD',
  'https://ibb.co/Z12kp71Z',
  'https://ibb.co/NnrXGJ3r',
  'https://ibb.co/sdvGLYT0',
  'https://ibb.co/Qvq8dRVJ',
  'https://ibb.co/YBz8VGZ0',
  'https://ibb.co/ST01dmK',
  'https://ibb.co/Z6BN94ym',
  'https://ibb.co/35hKHSRM',
  'https://ibb.co/6R1R78Rs',
  'https://ibb.co/ks52MbWv',
  'https://ibb.co/7NkJRThx',
  'https://ibb.co/HDbNQGZc',
  'https://ibb.co/3yfkXmvV',
  'https://ibb.co/wZD8qjyS'
];

async function fetchHtml(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

async function getDirectUrls() {
  const directUrls = [];
  for (const link of links) {
    try {
      const html = await fetchHtml(link);
      const match = html.match(/<meta property="og:image" content="([^"]+)"/);
      if (match && match[1]) {
        directUrls.push(match[1]);
      } else {
        console.error(`Could not find direct url for ${link}`);
      }
    } catch (e) {
      console.error(`Failed to fetch ${link}: ${e.message}`);
    }
  }
  console.log(JSON.stringify(directUrls, null, 2));
}

getDirectUrls();
