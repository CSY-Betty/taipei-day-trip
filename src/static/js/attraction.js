import { fetchData, fetchUserData } from './fetchAPI.js';
// 返回初始畫面
let titleButton = document.getElementById('title');
titleButton.addEventListener('click', function () {
	window.location.href = `/`;
});

// 取得景點id
const currentUrl = window.location.pathname;
const attractionId = currentUrl.match(/\/attraction\/(\d+)/)[1];

function getAttractionData() {
	return fetchData(`/api/attraction/${attractionId}`, 'GET', {
		'Content-Type': 'application/json',
	});
}

function createImageGallery(data) {
	const images = data.data.images;
	const imageSlide = document.getElementById('imageSlide');
	const slideDot = document.getElementById('slideDot');
	const firstNode = imageSlide.firstChild;

	images.forEach((imageUrl) => {
		const image = document.createElement('img');
		image.className = 'slide__item fades';
		image.src = imageUrl;
		imageSlide.insertBefore(image, firstNode);
	});

	for (let i = 0; i < images.length; i++) {
		const dot = document.createElement('div');
		dot.className = 'dot';
		slideDot.appendChild(dot);
	}
}

function createAttractionInfo(data) {
	const attractionData = data.data;
	const { name, category, mrt, description, address, transport } =
		attractionData;

	// 景點標題區塊
	const menu = document.getElementById('menu');

	const title = document.createElement('span');
	title.textContent = name;
	title.classList.add('menu__title', 'h3-bold');

	menu.appendChild(title);

	// 將description顯示在最前面
	menu.insertBefore(title, menu.firstChild);

	const subTitle = document.createElement('span');
	subTitle.classList.add('menu__subtitle', 'body-med');

	const tagNode = document.createTextNode(`${category} at ${mrt}`);

	subTitle.appendChild(tagNode);
	menu.insertBefore(subTitle, title.nextSibling);

	// 景點描述區塊
	const descriptionContainer = document.getElementById('description');

	const introduce = document.createElement('span');
	introduce.textContent = description;
	introduce.classList.add('description__introduce', 'content-reg');

	descriptionContainer.insertBefore(
		introduce,
		descriptionContainer.firstChild
	);

	const addressContainer = document.createElement('span');
	addressContainer.textContent = address;
	addressContainer.classList.add('description__address', 'content-reg');

	descriptionContainer.insertBefore(
		addressContainer,
		descriptionContainer.childNodes[3]
	);

	const transportContainer = document.createElement('span');
	transportContainer.textContent = transport;
	transportContainer.classList.add('description__transport', 'content-reg');

	descriptionContainer.insertBefore(
		transportContainer,
		descriptionContainer.childNodes[6]
	);
}

// 預定按鈕
const timeMorning = document.getElementById('timeMorning');
const timeAfternoon = document.getElementById('timeAfternoon');
timeAfternoon.addEventListener('click', function () {
	priceFee = document.getElementById('priceFee');
	priceFee.textContent = '新台幣 2500元';
});

timeMorning.addEventListener('click', function () {
	priceFee = document.getElementById('priceFee');
	priceFee.textContent = '新台幣 2000元';
});

document.addEventListener('DOMContentLoaded', function () {
	getAttractionData().then((attractionData) => {
		createAttractionInfo(attractionData);
		createImageGallery(attractionData);

		let slideIndex = 1;

		showSlide(slideIndex);

		let prev = document.getElementById('prev');
		prev.addEventListener('click', divideSlides, false);

		let next = document.getElementById('next');
		next.addEventListener('click', plusSlides, false);

		const selectdot = document.querySelectorAll('.dot');
		for (let i = 0; i < selectdot.length; i++) {
			selectdot[i].addEventListener('click', function (e) {
				showSlide((slideIndex = i + 1));
			});
		}

		function plusSlides() {
			showSlide((slideIndex += 1));
		}

		function divideSlides() {
			showSlide((slideIndex -= 1));
		}

		function showSlide(num) {
			let slides = document.getElementsByClassName('slide__item');
			let dots = document.getElementsByClassName('dot');

			if (num > slides.length) {
				slideIndex = 1;
			}

			if (num < 1) {
				slideIndex = slides.length;
			}

			for (let i = 0; i < slides.length; i++) {
				slides[i].style.display = 'none';
			}

			for (let i = 0; i < dots.length; i++) {
				dots[i].className = dots[i].className.replace('active', '');
			}
			slides[slideIndex - 1].style.display = 'block';
			dots[slideIndex - 1].className += ' active';
		}
	});
});

let orderCheck = document.getElementById('orderCheck');
let loginDialog = document.getElementById('loginDialog');
orderCheck.addEventListener('click', function () {
	const token = localStorage.getItem('token');
	let dateSelect = document.getElementById('dateSelect');
	let selectedTime;
	let priceText = priceFee.textContent;
	let bookingPrice = parseInt(priceText.replace(/\D/g, ''), 10);
	if (timeMorning.checked) {
		selectedTime = 'morning';
	} else if (timeAfternoon.checked) {
		selectedTime = 'afternoon';
	}
	let imageSlide = document.getElementById('imageSlide');
	let firstImage = imageSlide.querySelector('img').getAttribute('src');

	let attractionName = menu.querySelector('.menu__title').textContent;
	let attractionAddress = description.querySelector(
		'.description__address'
	).textContent;

	let bookingData = {
		attractionId: attractionId,
		attractionName: attractionName,
		attractionAddress: attractionAddress,
		date: dateSelect.value,
		time: selectedTime,
		price: bookingPrice,
		attractionImage: firstImage,
	};
	if (token) {
		fetchUserData(
			'/api/booking',
			'POST',
			{
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
			JSON.stringify(bookingData)
		)
			.then(() => {
				window.location.href = '/booking';
			})
			.catch((error) => {
				console.log('錯誤: ', error);
			});
	} else {
		loginDialog.showModal();
	}
});
