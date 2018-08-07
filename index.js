const https = require('https');
const url = require('url');
const aws4  = require('aws4');

exports.handler = (event, context) => {
  if (!event.url) {
    return context.fail('missing url property');
  }
  
  const urlParts = url.parse(event.url);

  const options = {
    host: urlParts.host,
    path: urlParts.pathname,
    method: event.method || 'POST'
  };
  aws4.sign(options);
  console.log('making signed request to: ', event.url);

  const req = https.request(options, (res) => {
    res.setEncoding('utf8');
    
    let responseString = '';
    res.on('data', (data) => {
      responseString += data;
    });
    
    res.on('end', () => {
      if (res.statusCode >= 400) {
        console.error(`got failure response with status code=${res.statusCode}: `, responseString);
        context.fail(responseString);
      } else {
        context.succeed();
      }
    });
  });

  req.on('error', function(err) {
    console.error('the request failed: ', err.toString());
    context.fail(err);
  });

  req.end();
};
