const fs = require('fs');
const path = require('path');

function read(filename) {
	const data = fs.readFileSync(path.resolve('db', filename + '.json'), 'utf-8');
	return JSON.parse(data);
}

function write(data, filename) {
	fs.writeFileSync(
		path.resolve(path.resolve('db', data + '.json')),
		JSON.stringify(filename, null, 4),
	);

	return true;
}

module.exports = { write, read };
