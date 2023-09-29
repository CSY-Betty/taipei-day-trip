// 返回初始畫面
let titleButton = document.getElementById("title");
titleButton.addEventListener("click", function(){
	window.location.href = `/`
});


// 取得景點id
const currentUrl = window.location.pathname;
const attractionId = currentUrl.match(/\/attraction\/(\d+)/)[1];


function getAttractionData() {
	return fetch(`/api/attraction/${attractionId}`, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
		},
	})
	.then(response => response.json());
};


function createAttractionInfo(data) {
	
	const attractionData = data.data;
	const attractionName = attractionData.name;
	const attractionCategory = attractionData.category;
	const attractionMrt = attractionData.mrt;
	const attractionDescript = attractionData.description;
	const attractionAddress= attractionData.address;
	const attractionTrans = attractionData.transport;
	const attractionImages = attractionData.images;

	// 景點圖片區塊
	const imageSlide = document.getElementById("imageSlide");
	const firstNode = imageSlide.firstChild;

	// 製作所有圖片
	attractionImages.forEach(imageUrl => {
		const image = document.createElement("img");
		image.classList.add("slide__item", "fades")
		image.src = imageUrl;
		imageSlide.insertBefore(image, firstNode);
	});

	const slideDot = document.getElementById("slideDot");
	const dotNum = attractionImages.length

	
	for (let i = 0; i < dotNum; i++) {
		const dot = document.createElement("div");
		dot.classList.add("dot");
		slideDot.appendChild(dot);
	}

	// 景點標題區塊
	const menu = document.getElementById("menu");

	const title = document.createElement("span");
	title.textContent = attractionName;
	title.classList.add("menu__title", "h3-bold");

	menu.appendChild(title);

	// 將description顯示在最前面
	menu.insertBefore(title, menu.firstChild);

	const subTitle = document.createElement("span");
	subTitle.classList.add("menu__subtitle", "body-med");

	const tagNode = document.createTextNode(`${attractionCategory} at ${attractionMrt}`);

	subTitle.appendChild(tagNode);
	menu.insertBefore(subTitle, title.nextSibling);
	

	// 景點描述區塊
	const description = document.getElementById("description");

	const introduce = document.createElement("span");
	introduce.textContent = attractionDescript;
	introduce.classList.add("description__introduce", "content-reg")

	description.insertBefore(introduce, description.firstChild);


	const address = document.createElement("span");
	address.textContent = attractionAddress;
	address.classList.add("description__address", "content-reg")

	description.insertBefore(address, description.childNodes[3]);

	const transport = document.createElement("span");
	transport.textContent = attractionTrans;
	transport.classList.add("description__transport", "content-reg")

	description.insertBefore(transport, description.childNodes[6]);
}



// 預定按鈕
const timeMorning = document.getElementById("timeMorning");
const timeAfternoon = document.getElementById("timeAfternoon");
timeAfternoon.addEventListener("click", function() {
	priceFee = document.getElementById("priceFee")
	priceFee.textContent = '新台幣 2500元';
})

timeMorning.addEventListener("click", function() {
	priceFee = document.getElementById("priceFee")
	priceFee.textContent = '新台幣 2000元';
})

document.addEventListener("DOMContentLoaded", function() {
    getAttractionData().then(attractionData => {
        createAttractionInfo(attractionData);

		let slideIndex = 1;

		showSlide(slideIndex);

		let prev = document.getElementById("prev");
		prev.addEventListener("click", divideSlides, false);

		let next = document.getElementById("next");
		next.addEventListener("click", plusSlides, false);

		const selectdot = document.querySelectorAll(".dot");
		for (let i = 0; i <selectdot.length; i++) {
			selectdot[i].addEventListener("click", function(e) {
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
			let slides = document.getElementsByClassName("slide__item");
			let dots = document.getElementsByClassName("dot");
			
			if (num > slides.length) {
				slideIndex = 1;
			}

			if (num < 1) {
				slideIndex =slides.length;
			}

			for (let i = 0; i < slides.length; i++) {
				slides[i].style.display = "none";
			}

			for (let i = 0; i < dots.length; i++) {
				dots[i].className = dots[i].className.replace("active", "")
			}
			slides[slideIndex - 1].style.display = "block";
			dots[slideIndex - 1].className += " active";
		}
	});
});




let orderCheck = document.getElementById("orderCheck")
let loginDialog = document.getElementById("loginDialog")
orderCheck.addEventListener("click", function() {
	const token = localStorage.getItem("token");
	let dateSelect = document.getElementById("dateSelect")
	let selectedTime;
	let priceText = priceFee.textContent
	let bookingPrice = parseInt(priceText.replace(/\D/g, ''), 10);
	if (timeMorning.checked) {
		selectedTime = "morning"
	}
	else if (timeAfternoon.checked) {
		selectedTime = "afternoon"
	}

	firstImage = imageSlide.querySelector('img').getAttribute('src');

	attractionName = menu.querySelector('.menu__title').textContent;
	attractionAddress = description.querySelector('.description__address').textContent;

	bookingData = {
		attractionId: attractionId,
		attractionName: attractionName,
		attractionAddress: attractionAddress,
		date: dateSelect.value,
		time: selectedTime,
		price: bookingPrice,
		attractionImage: firstImage
	}
	if (token) {
		fetch(`/api/booking`, {method: "POST", headers:{"Content-Type": "application/json", "Authorization": `Bearer ${token}`}, body: JSON.stringify(bookingData)})
		.then(response => {
			if (response.status === 200) {
				window.location.href='/booking';
			}
		})
		.catch(error => {
			console.log("錯誤: ",error);
		})
	}
	else {
		loginDialog.showModal();
	}
})

