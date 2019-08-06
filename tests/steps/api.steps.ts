const { ProtractorApiResource } = require('protractor-api-resource');
const { Given, When, Then, Before } = require('cucumber');
const { protractor, browser, $ } = require('protractor');

const chai = require('chai');
chai.should();
chai.use(require('chai-as-promised'));
chai.use(require('chai-things'));
chai.use(require('chai-each'));
const expect = chai.expect;

let apiClient, firstPost, getFirstIds, testData;
Given('the API client is opened', () => {
	firstPost = { userId: 1 };
	getFirstIds = { id: 1, ...firstPost };
	testData = { title: 'foo', body: 'bar' };

	apiClient = new ProtractorApiResource('https://jsonplaceholder.typicode.com/');
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
		...getFirstIds,
		title: 'sunt aut facere repellat provident occaecati excepturi optio reprehenderit',
		body: 'quia et suscipit\nsuscipit recusandae consequuntur expedita et cum\nreprehenderit molestiae ut ut quas totam\nnostrum rerum est autem sunt rem eveniet architecto'
	};

	apiClient
		.getFirstPost(firstPost).toJSON()
		.should.eventually
		.eql(expectedResponse);
});

Then('the GET method gets all posts', () => {
	const apiBody = apiClient.getAllPosts({});
	apiBody.toJSON()
		.should.eventually
		.be.an('array')
		.that.has.a.lengthOf(100);

	// apiBody.toJSON()
	// 	.should.eventually
	// 	.have.all.keys(['id', 'userId', 'title', 'body']);

	apiBody.toJSON()
		.then(body => {
			expect(body).to.have.all.keys(['id', 'userId', 'title', 'body']);
		});
});

Then('the POST method inserts a post', () => {
	const payLoad = { ...firstPost, ...testData };
	const expectedResponse = { id: 101, ...payLoad };

	apiClient
		.createPost({}, payLoad).toJSON()
		.should.eventually
		.eql(expectedResponse);
});

Then('the PUT method updates the first post', () => {
	const payLoad = { ...getFirstIds, ...testData };
	const expectedResponse = { ...payLoad };

	apiClient
		.updatePost(firstPost, payLoad).toJSON()
		.should.eventually
		.eql(expectedResponse);
});

Then('the PATCH method updates the first post', () => {
	const payLoad = { ...testData };
	const expectedResponse = { ...getFirstIds, ...payLoad };

	apiClient
		.patchPost(firstPost, payLoad).toJSON()
		.should.eventually
		.eql(expectedResponse);
});

Then('the DELETE method deletes the first post', () => {
	apiClient
		.deletePost(firstPost).toJSON()
		.should.eventually
		.be.an('object')
		.that.is.empty;
});
