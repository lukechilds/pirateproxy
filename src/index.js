const url = require('url');
const http = require('http');
const got = require('got');
const replaceStream = require('replacestream');

const host = process.env.PROXY_HOST || (process.env.NOW_URL && url.parse(process.env.NOW_URL).host);
const target = 'thepiratebay.org';

http.createServer((req, res) => {
	let stream = got.stream(target + req.url);

	const handleResponse = origRes => {
		res.statusCode = origRes.statusCode;
		origRes.headers = origRes.headers || {};
		Object.entries(origRes.headers).forEach(header => {
			if (header[0] !== 'content-encoding') {
				res.setHeader(header[0], header[1]);
			}
		});

		if (origRes.headers['content-type'] === 'text/html') {
			stream = stream.pipe(replaceStream(target, host || req.headers.host));
		}

		stream.pipe(res);
	};

	stream
    .on('response', handleResponse)
    .on('error', handleResponse);
}).listen(3000);
