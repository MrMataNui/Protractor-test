const chai = require('chai');
chai.should();
chai.use(require('chai-as-promised'));
chai.use(require('chai-things'));
chai.use(require('chai-each'));
chai.use(require('chai-interface'));
const expect = chai.expect;

import { ProtractorApiResource } from 'protractor-api-resource';
import { Given, When, Then } from 'cucumber';

interface FirstPost { userId: number; }
interface TestData { title: string; body: string; }

interface GetIds extends FirstPost { id: number; }
interface PostData extends FirstPost, TestData { }
interface ApiObject extends GetIds, TestData { }

let apiClient: ProtractorApiResource;
let firstPost: FirstPost;
let getFirstIds: GetIds;
let testData: TestData;

Given('the API client is opened', () => {
	firstPost = { userId: 1 };
	getFirstIds = { id: 1, ...firstPost };
	testData = { title: 'foo', body: 'bar' };

	apiClient = new ProtractorApiResource('https://jsonplaceholder.typicode.com/');
});

When('the enpoints are entered into the API', () => {
	apiClient.registerService({
		getAPost: { method: 'GET', path: '/posts/:userId:' },
		getAllPosts: { method: 'GET', path: '/posts' },
		createPost: { method: 'POST', path: '/posts' },
		updatePost: { method: 'PUT', path: '/posts/:userId:' },
		patchPost: { method: 'PATCH', path: '/posts/:userId:' },
		deletePost: { method: 'DELETE', path: '/posts/:userId:' }
	});
});

Then('the GET method gets the first post', () => {
	const expectedResponse: ApiObject = {
		...getFirstIds,
		title: 'sunt aut facere repellat provident occaecati excepturi optio reprehenderit',
		body: 'quia et suscipit\nsuscipit recusandae consequuntur expedita et cum\nreprehenderit molestiae ut ut quas totam\nnostrum rerum est autem sunt rem eveniet architecto'
	};

	apiClient
		.getAPost(firstPost).toJSON()
		.should.eventually
		.eql(expectedResponse);
});

Then('the GET method gets all posts', () => {
	apiClient
		.getAllPosts({}).toJSON()
		.should.eventually
		.be.an('array')
		.that.has.a.lengthOf(100);

	apiClient
		.getAllPosts({}).toJSON()
		.then(body => {
			body.forEach((element: ApiObject) => {
				expect(element).to.have
					.interface({
						userId: Number,
						title: String,
						body: String,
						id: Number
					});
			});
		});
});

Then('the POST method inserts a post', () => {
	const payLoad: PostData = { ...firstPost, ...testData };
	const expectedResponse: ApiObject = { id: 101, ...payLoad };

	apiClient
		.createPost({}, payLoad).toJSON()
		.should.eventually
		.eql(expectedResponse);
});

Then('the PUT method updates the first post', () => {
	const payLoad: ApiObject = { ...getFirstIds, ...testData };
	const expectedResponse: ApiObject = { ...payLoad };

	apiClient
		.updatePost(firstPost, payLoad).toJSON()
		.should.eventually
		.eql(expectedResponse);
});

Then('the PATCH method updates the first post', () => {
	const payLoad: TestData = { ...testData };
	const expectedResponse: ApiObject = { ...getFirstIds, ...payLoad };

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
