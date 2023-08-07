const crypto = require("crypto");
const https = require("https");

function postRequest(data) {
  return new Promise((resolve, reject) => {
    const url = new URL("https://api-eu.pusher.com/apps/1431609/events");
    const options = {
      host: url.hostname,
      path: url.pathname + getQueryString(data),
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    };
    
    //create the request object with the callback with the result
    const req = https.request(options, (res) => {
      resolve(JSON.stringify(res.statusCode));
    });

    // handle the possible errors
    req.on('error', (e) => {
      reject(e.message);
    });
    
    //do the request
    req.write(JSON.stringify(data));

    //finish the request
    req.end();
  })
}

const getQueryString = (messageBody) => {
    const timestamp = (Date.now() / 1000) | 0;
    const body = JSON.stringify(messageBody);
    const body_md5 = getMD5(body);
    const method = "POST";
    const path = "/apps/1431609/events";
    let queryString = `auth_key=ae58f5c5e4c0cca87aa1&auth_timestamp=${timestamp}&auth_version=1.0&body_md5=${body_md5}`;

    const signData = [method, path, queryString].join("\n");
    queryString += "&auth_signature=" + sign(signData);

    return `?${queryString}`;
  };

  const sign = (string) => {
    return crypto
      .createHmac("sha256", "6f9edb82cf8105b0c3dc")
      .update(Buffer.from(string))
      .digest("hex");
  };

  function getMD5(body) {
    return crypto.createHash("md5").update(body, "utf8").digest("hex");
  }

exports.handler = async (event) => {
    console.log(event);
    const body = {
      data: Buffer.from(event.queryStringParameters.data, 'base64').toString(),
      name: event.queryStringParameters.event,
      channel: event.queryStringParameters.channel,
    };
    console.log(body);
    await postRequest(body);
  
    const response = {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': "*"
        },
        body: JSON.stringify('Hello from Lambda!'),
    };
    return response;
};
