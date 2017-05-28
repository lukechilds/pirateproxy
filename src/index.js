const http = require('http');
const got = require('got');
const replaceStream = require('replacestream');

const target = 'thepiratebay.org';

http.createServer((req, res) => {
	let stream = got.stream(target + req.url);

	const handleResponse = origRes => {
		res.statusCode = origRes.statusCode;
		Object.entries(origRes.headers).forEach(header => {
			if (header[0] !== 'content-encoding') {
				res.setHeader(header[0], header[1]);
			}
		});

		if (origRes.headers['content-type'].includes('text')) {
			stream = stream.pipe(replaceStream(target, req.headers.host));
		}

		stream.pipe(res);
	};

	stream
    .on('response', handleResponse)
    .on('error', handleResponse);
}).listen(3000);
