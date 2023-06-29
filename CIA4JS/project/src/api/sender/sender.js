import axios from "axios";

const config = {
	onUploadProgress: function (progressEvent) {
		let percentCompleted = Math.round(
			(progressEvent.loaded * 100) / progressEvent.total
		);
		// // console.log(percentCompleted);
	},
};

function handleResponse(res) {
	if (!res.data) {
		return Promise.reject("Something went wrong");
	} else {
		return Promise.resolve(res.data);
	}
}

export function httpGet(route, payload) {
	const config = {
		method: 'get',
		url: route,
		headers: {
			'Token': 'ducduongn',
		}
	};
	// console.log(config);
	return axios(config).then(handleResponse);
}

export function github() {
	const config = {
		method: 'get',
		url: 'http://localhost:4001/api/user-info',
		headers: { }
	};
	return axios(config).then(handleResponse)
}

export function httpRequest(config) {
	return axios(config).then(handleResponse)
}

export function httpPost(route, payload) {
	let url = `${route}`;
	return axios.post(url, payload, config).then(handleResponse);
}

export function httpPut(route, payload) {
	let url = `${route}`;
	return axios.put(url, payload).then(handleResponse);
}
