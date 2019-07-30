const { ProtractorApiResource } = require('protractor-api-resource');
const { Given, When, Then, Before } = require('cucumber');
const { protractor, browser, $ } = require('protractor');
const { expect } = require('chai');

let apiClient;
Given('the API client is opened', () => {
	apiClient = new ProtractorApiResource('https://jsonplaceholder.typicode.com/');
});

// let basicAuthApiClient, tokenAuthApiClient;
// Given('authorization is entered', () => {
// 	basicAuthApiClient = apiClient.withBasicAuth('username', 'password');
// 	tokenAuthApiClient = apiClient.withTokenAuthentication('token');
// });

When('the enpoints are entered into the API', () => {
	apiClient.registerService({
		getFirstPost: {
			method: 'GET',
			path: '/posts/:postId:'
		},
		getAllPosts: {
			method: 'GET',
			path: '/posts'
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

Then('the GET method gets the first post', () => {
	const expectedResponse = {
		id: 1, userId: 1,
		title: 'sunt aut facere repellat provident occaecati excepturi optio reprehenderit',
		body: 'quia et suscipit\nsuscipit recusandae consequuntur expedita et cum\nreprehenderit molestiae ut ut quas totam\nnostrum rerum est autem sunt rem eveniet architecto'
	};

	apiClient.getFirstPost({ postId: 1 })
		.toJSON().then(actualResponse => {
			expect(actualResponse).to.eql(expectedResponse);
		});
});

Then('the GET method gets all posts', () => {
	const expectedKeys = ['id', 'userId', 'title', 'body'];

	apiClient.getAllPosts({})
		.toJSON().then(actualResponse => {
			expect(actualResponse).to.have.lengthOf(100);
			actualResponse.forEach(element => {
				expect(element).to.have.all.keys(expectedKeys);

				expect(element.id).to.be.a('number');
				expect(element.userId).to.be.a('number');
				expect(element.title).to.be.a('string');
				expect(element.body).to.be.a('string');
			});
		});
});

Then('the POST method inserts a post', () => {
	const payLoad = { userId: 1, title: 'foo', body: 'bar' };
	const expectedResponse = { id: 101, ...payLoad };

	apiClient.createPost({}, payLoad)
		.toJSON().then(actualResponse => {
			expect(actualResponse).to.eql(expectedResponse);
		});
});

Then('the PUT method updates a post', () => {
	const payLoad = { id: 1, userId: 1, title: 'foo', body: 'bar' };
	const expectedResponse = { ...payLoad };

	apiClient.updatePost({ postId: 1 }, payLoad)
		.toJSON().then(actualResponse => {
			expect(actualResponse).to.eql(expectedResponse);
		});
});

Then('the PATCH method updates a post', () => {
	const payLoad = { title: 'foo', body: 'bar' };
	const expectedResponse = { id: 1, userId: 1, ...payLoad };

	apiClient.patchPost({ postId: 1 }, payLoad)
		.toJSON().then(actualResponse => {
			expect(actualResponse).to.eql(expectedResponse);
		});
});

Then('the DELETE method deletes the first post', () => {
	apiClient.deletePost({ postId: 1 })
		.toJSON().then(actualResponse => {
			expect(actualResponse).to.be.empty;
		});
});
