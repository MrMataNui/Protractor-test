const { ProtractorApiResource } = require('protractor-api-resource');
const { Given, When, Then, Before } = require('cucumber');
const { protractor, browser, $ } = require('protractor');

const chai = require('chai');
chai.should();
chai.use(require('chai-things'));
chai.use(require('chai-as-promised'));
const expect = chai.expect;

let apiClient, firstPost;
Given('the API client is opened', () => {
	apiClient = new ProtractorApiResource('https://jsonplaceholder.typicode.com/');
	firstPost = { userId: 1 };
});

/** Used to enter in authorization */
/*
let basicAuthApiClient, tokenAuthApiClient;
Given('authorization is entered', () => {
	basicAuthApiClient = apiClient.withBasicAuth('username', 'password');
	tokenAuthApiClient = apiClient.withTokenAuthentication('token');
});
*/
When('the enpoints are entered into the API', () => {
	apiClient.registerService({
		getFirstPost: {
			method: 'GET',
			path: '/posts/:userId:'
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
			path: '/posts/:userId:'
		},
		patchPost: {
			method: 'PATCH',
			path: '/posts/:userId:'
		},
		deletePost: {
			method: 'DELETE',
			path: '/posts/:userId:'
		}
	});
});

Then('the GET method gets the first post', () => {
	const expectedResponse = {
		id: 1, userId: 1,
		title: 'sunt aut facere repellat provident occaecati excepturi optio reprehenderit',
		body: 'quia et suscipit\nsuscipit recusandae consequuntur expedita et cum\nreprehenderit molestiae ut ut quas totam\nnostrum rerum est autem sunt rem eveniet architecto'
	};

	let apiBody = apiClient.getFirstPost(firstPost);
	apiBody.toJSON()
		.should.eventually
		.eql(expectedResponse);
});

Then('the GET method gets all posts', () => {
	const apiBody = apiClient.getAllPosts({});
	apiBody.toJSON()
		.should.eventually
		.be.an('array')
		.that.has.a.lengthOf(100);

	apiBody.toJSON()
		.should.eventually
		.all.have.property('id')
		.and.all.have.property('userId')
		.and.all.have.property('title')
		.and.all.have.property('body');
});

Then('the POST method inserts a post', () => {
	const payLoad = { userId: 1, title: 'foo', body: 'bar' };
	const expectedResponse = { id: 101, ...payLoad };

	let apiBody = apiClient.createPost({}, payLoad);
	apiBody.toJSON()
		.should.eventually
		.eql(expectedResponse);
});

Then('the PUT method updates a post', () => {
	const payLoad = { id: 1, userId: 1, title: 'foo', body: 'bar' };
	const expectedResponse = { ...payLoad };

	let apiBody = apiClient.updatePost(firstPost, payLoad);
	apiBody.toJSON()
		.should.eventually
		.eql(expectedResponse);
});

Then('the PATCH method updates a post', () => {
	const payLoad = { title: 'foo', body: 'bar' };
	const expectedResponse = { id: 1, userId: 1, ...payLoad };

	let apiBody = apiClient.patchPost(firstPost, payLoad);
	apiBody.toJSON()
		.should.eventually
		.eql(expectedResponse);
});

Then('the DELETE method deletes the first post', () => {
	let apiBody = apiClient.deletePost(firstPost);
	apiBody.toJSON()
		.should.eventually
		.be.an('object')
		.that.is.empty;
});
