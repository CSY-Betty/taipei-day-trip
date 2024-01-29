import { fetchData } from './fetchAPI.js';

let url = window.location.href;
let urlNumber = url.match(/number=(\d+)/)[1];
let token = localStorage.getItem('token');

function getOrderNumber() {
	return fetchData(`/api/order/${urlNumber}`, 'GET', {
		'Content-Type': 'application/json',
		Authorization: `Bearer ${token}`,
	});
}

function renderOrderNumber(data) {
	let orderNumber = document.getElementById('orderNumber');
	orderNumber.textContent = data;
}

function cleanBooking(data) {
	fetchData(
		'/api/booking',
		'DELETE',
		{
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`,
		},
		JSON.stringify(data.data.trip.attraction.id)
	);
}

getOrderNumber().then((data) => {
	renderOrderNumber(data.data.number);
	cleanBooking(data);
});
