import test from 'ava';
import ky from '../source/index.js';
import {createHttpTestServer} from './helpers/create-http-test-server.js';

test('.json() respects `noContentValue` for 204 responses', async t => {
	const server = await createHttpTestServer();

	server.get('/', (_request, response) => {
		response.status(204).end();
	});

	const data = await ky(server.url, {noContentValue: null}).json();

	t.is(data, null);
	t.notThrows(() => {
		// Optional chaining should short-circuit when the value is null.
		const result = data?.content.posts.length;
		void result;
	});

	await server.close();
});

test('.json() respects `noContentValue` for empty bodies', async t => {
	const server = await createHttpTestServer();

	server.get('/', (_request, response) => {
		response.end();
	});

	const data = await ky.get(server.url, {noContentValue: null}).json();

	t.is(data, null);
	t.notThrows(() => {
		const result = data?.content.posts.length;
		void result;
	});

	await server.close();
});

