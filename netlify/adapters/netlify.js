import { streamToString } from 'hono/utils/stream';

export const handle = (app) => {
  return async (event, context) => {
    const url = new URL(event.rawUrl);
    const method = event.httpMethod;
    const headers = event.headers;
    
    const body = event.body
      ? event.isBase64Encoded
        ? Buffer.from(event.body, 'base64').toString()
        : event.body
      : undefined;

    const req = new Request(url, {
      method,
      headers,
      body
    });

    const res = await app.fetch(req);
    const contentType = res.headers.get('content-type');
    
    let resBody;
    if (contentType?.includes('application/json')) {
      resBody = await res.json();
    } else {
      resBody = await streamToString(res.body);
    }

    const statusCode = res.status;
    const responseHeaders = {};
    
    res.headers.forEach((value, key) => {
      responseHeaders[key] = value;
    });

    return {
      statusCode,
      headers: responseHeaders,
      body: typeof resBody === 'string' ? resBody : JSON.stringify(resBody),
      isBase64Encoded: false
    };
  };
};
