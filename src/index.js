const http = require('http');
const got = require('got');

const target = 'thepiratebay.org';

http.createServer((req, res) => {
	const copyData = origRes => {
		res.statusCode = origRes.statusCode;
		Object.entries(origRes.headers).forEach(header => {
			if (header[0] !== 'content-encoding') {
				res.setHeader(header[0], header[1]);
			}
		});
	};

	got.stream(target + req.url)
    .on('response', copyData)
    .on('error', copyData)
    .pipe(res);
}).listen(3000);
