const token = localStorage.getItem("token");

function getBookingData() {
    return fetch(`/api/booking`, {method: "GET", headers: {"Content-Type": "application/json","Authorization": `Bearer ${token}`},})
    .then(response => response.json())
}

function getUserData() {
    return fetch(`/api/user/auth`, {method: "GET", headers: {"Content-Type": "application/json", "Authorization": `Bearer ${token}`}})
    .then(response => response.json())
}

function renderUserData(data){
    let subheadName = document.getElementById('subheadName');
    subheadName.textContent = data.data['name'];

    let inputName = document.getElementById('inputName');
    inputName.value = data.data['name'];

    let inputEmail = document.getElementById('inputEmail');
    inputEmail.value = data.data['email'];

    let inputPhone = document.getElementById('inputPhone');
    inputPhone.addEventListener('input', function() {
        let phoneNumber = this.value.replace(/[^\d-]/g, '');
        this.value = phoneNumber;
    })
}


function renderBookingData(data) {
    let bookingImage = document.getElementById('bookingImage')
    bookingImage.src = data.data['attraction']['image']

    let bookingTitle = document.getElementById('bookingTitle');
    bookingTitle.textContent = data.data['attraction']['name']

    let bookingDate = document.getElementById('bookingDate');
    bookingDate.textContent = data.data['date']

    let bookingTime = document.getElementById('bookingTime');
    if (data.data['time'] == 'morning') {
        bookingTime.textContent = "早上 9 點到下午 4 點"
    }
    else {
        bookingTime.textContent = "下午 2 點到晚上 9 點"
    }
        
    let bookingPrice = document.getElementById('bookingPrice');
    bookingPrice.textContent = data.data['price']

    let bookingAddress = document.getElementById('bookingAddress');
    bookingAddress.textContent = data.data['attraction']['address']

    let confirmPrice = document.getElementById('confirmPrice');
    confirmPrice.textContent = data.data['price']
}

function cancelbooking(data) {
    let bookingDelete = document.getElementById('bookingDelete');
    bookingDelete.addEventListener('click', function() {
        fetch(`/api/booking`, {method: 'DELETE', headers: {"Content-Type": "application/json", "Authorization": `Bearer ${token}`}, body: JSON.stringify(data.data['attraction']['id'])})
        .then(window.location.reload())
    })
}

function renderNoBooking() {
    let container_booking = document.querySelectorAll('.container_booking')
    container_booking.forEach(element => {
        element.style.display = 'None';
    })

    let container_nobooking = document.querySelector('.container_nobooking')
    container_nobooking.style.display = 'block';

    let hrTag = document.getElementsByTagName('hr');
    let hrArray = Array.from(hrTag)
    hrArray.forEach(hr => {
        hr.style.display = 'None';
    })

}

if (token) {
    getUserData().then(data => renderUserData(data));
    getBookingData().then(data => { 
        if (data) {
            renderBookingData(data); 
            cancelbooking(data);
        }
        else {
            renderNoBooking();
        }
    });
} else {
    window.location.href = '/';
}
