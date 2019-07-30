const { ProtractorApiResource } = require('protractor-api-resource');
const { Given, When, Then, Before } = require('cucumber');
const { protractor, browser, $ } = require('protractor');
const { expect } = require('chai');

let apiClient;
Given('the API client is opened', () => {
	apiClient = new ProtractorApiResource('https://jsonplaceholder.typicode.com/');
	// basicAuthApiClient = apiClient.withBasicAuth('username', 'password');
	// tokenAuthApiClient = apiClient.withTokenAuthentication('token');
});

When('the enpoints are entered into the API', () => {
	apiClient.registerService({
		getPosts: {
			method: 'GET',
			path: '/posts/:postId:'
		},
		createPost: {
			method: 'POST',
			path: '/posts'
		},
		updatePost: {
			method: 'PUT',
			path: '/posts/:postId:'
		},
		patchPost: {
			method: 'PATCH',
			path: '/posts/:postId:'
		},
		deletePost: {
			method: 'DELETE',
			path: '/posts/:postId:'
		}
	});
});

Then('the GET method succeeds', () => {
	const expectedResponse = {
		id: 1,
		userId: 1,
		title: 'sunt aut facere repellat provident occaecati excepturi optio reprehenderit',
		body: 'quia et suscipit\nsuscipit recusandae consequuntur expedita et cum\nreprehenderit molestiae ut ut quas totam\nnostrum rerum est autem sunt rem eveniet architecto'
	};

	apiClient.getPosts({ postId: 1 })
		.toJSON().then(actualResponse => {
			expect(actualResponse).to.eql(expectedResponse);
		});
});

Then('the POST method succeeds', () => {
	const payLoad = { userId: 1, title: 'foo', body: 'bar' };
	const expectedResponse = { id: 101, ...payLoad };

	apiClient.createPost({}, payLoad)
		.toJSON().then(actualResponse => {
			expect(actualResponse).to.eql(expectedResponse);
		});
});

Then('the PUT method succeeds', () => {
	const payLoad = { id: 1, userId: 1, title: 'foo', body: 'bar' };
	const expectedResponse = { ...payLoad };

	apiClient.updatePost({ postId: 1 }, payLoad)
		.toJSON().then(actualResponse => {
			expect(actualResponse).to.eql(expectedResponse);
		});
});

Then('the PATCH method succeeds', () => {
	const payLoad = { title: 'foo', body: 'bar' };
	const expectedResponse = { id: 1, userId: 1, ...payLoad };

	apiClient.patchPost({ postId: 1 }, payLoad)
		.toJSON().then(actualResponse => {
			expect(actualResponse).to.eql(expectedResponse);
		});
});

Then('the DELETE method succeeds', () => {
	const expectedResponse = {};

	apiClient.deletePost({ postId: 1 })
		.toJSON().then(actualResponse => {
			expect(actualResponse).to.eql(expectedResponse);
		});
});
