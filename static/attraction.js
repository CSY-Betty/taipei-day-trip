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
	const infoContainer = document.getElementById("infoContainer");
	

	const attractionData = data.data;
	const attractionName = attractionData.name;
	const attractionCategory = attractionData.category;
	const attractionMrt = attractionData.mrt;
	const attractionDescript = attractionData.description;
	const attractionAddress= attractionData.address;
	const attractionTrans = attractionData.transport;
	const attractionImages = attractionData.images;

	// 景點圖片區塊
	const imageSlider = document.getElementById("imageSlider");

	// 製作所有圖片
	attractionImages.forEach(imageUrl => {
		const slideItem = document.createElement("div");
		slideItem.classList.add("slide_item", "fades")

		const image = document.createElement("img");
		image.src = imageUrl;

		slideItem.appendChild(image);
		imageSlider.appendChild(slideItem);
	});

	const slideDot = document.getElementById("slideDot");
	const dotNum = attractionImages.length

	
	for (let i = 0; i < dotNum; i++) {
		const dot = document.createElement("div");
		dot.classList.add("dot");
		slideDot.appendChild(dot);

		if (dotNum > 10) {
			dot.style.margin = "8px";
		}
	}

	// 景點標題區塊
	const mainContainer = document.getElementById("mainContainer");

	const title = document.createElement("span");
	title.textContent = attractionName;
	title.classList.add("attraction-title", "h3-bold");

	mainContainer.appendChild(title);

	// 將description顯示在最前面
	mainContainer.insertBefore(title, mainContainer.firstChild);


	const mainContainerTag =document.getElementById("mainContainerTag");
	const category = document.createElement("p");
	category.textContent = attractionCategory;
	category.classList.add("attraction-category");

	const mrt = document.createElement("p");
	mrt.textContent = attractionMrt;
	mrt.classList.add("attraction-mrt");

	mainContainerTag.appendChild(category);
	mainContainerTag.insertBefore(category, mainContainerTag.firstChild);
	mainContainerTag.appendChild(mrt);


	// 景點描述區塊
	const describeContainer = document.getElementById("describeContainer");

	const description = document.createElement("span");
	description.textContent = attractionDescript;
	description.classList.add("attraction-describe-infor", "content-reg")

	describeContainer.appendChild(description);


	const addressContainer = document.getElementById("attractionAddress");

	const address = document.createElement("span");
	address.textContent = attractionAddress;
	address.classList.add("attraction-describe-address", "content-reg")

	addressContainer.appendChild(address);

	const attractionTransport = document.getElementById("attractionTransport");

	const transport = document.createElement("span");
	transport.textContent = attractionTrans;
	transport.classList.add("attraction-describe-trans", "content-reg")

	attractionTransport.appendChild(transport);

	// 將description顯示在最前面
	describeContainer.insertBefore(description, describeContainer.firstChild);
}

// 預定按鈕
let morning = document.getElementById("morning");
let afternoon = document.getElementById("afternoon");
afternoon.addEventListener("click", function() {
	iconUp = document.querySelector(".time-icon-up");
	iconDown = document.querySelector(".time-icon-down");

	iconUp.style.backgroundImage = "url(../static/icon/unselect-btn.png)";
	iconDown.style.backgroundImage = "url(../static//icon/select-btn.png)";

	guidanceFee = document.getElementById("guidanceFee")
	guidanceFee.textContent = '新台幣 2500元';
})

morning.addEventListener("click", function() {
	iconUp = document.querySelector(".time-icon-up");
	iconDown = document.querySelector(".time-icon-down");

	iconUp.style.backgroundImage = "url(../static/icon/select-btn.png)";
	iconDown.style.backgroundImage = "url(../static//icon/unselect-btn.png)";

	guidanceFee = document.getElementById("guidanceFee")
	guidanceFee.textContent = '新台幣 2000元';
})

document.addEventListener("DOMContentLoaded", function() {
    getAttractionData().then(attractionData => {
        createAttractionInfo(attractionData);
    });
});


window.addEventListener("load", function() {
	let slideIndex = 1;

	showSlide(slideIndex);

	let prev = document.getElementById("imgLeft");
	prev.addEventListener("click", divideSlides, false);

	let next = document.getElementById("imgRight");
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
		let slides = document.getElementsByClassName("slide_item");
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

