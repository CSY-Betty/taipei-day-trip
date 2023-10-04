let url = window.location.href;
let urlNumber = url.match(/number=(\d+)/)[1];
const token = localStorage.getItem("token");

function getOrderNumber() {
	return fetch(`/api/order/${urlNumber}`, {
		method: "GET",
		headers: {
			"Content-Type": "application/json","Authorization": `Bearer ${token}`
		},
	})
	.then(response => response.json());
};

function renderOrderNumber(data) {
    let orderNumber = document.getElementById('orderNumber')
    orderNumber.textContent = data
}

function cleanBooking(data){
    fetch(`/api/booking`, {method: 'DELETE', headers: {"Content-Type": "application/json", "Authorization": `Bearer ${token}`}, body: JSON.stringify(data.data.trip.attraction.id)})
}

getOrderNumber().then(data => {    
    renderOrderNumber(data.data.number);
    cleanBooking(data);
})