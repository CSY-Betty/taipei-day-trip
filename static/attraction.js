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

	// 製作第一張圖片
	// const imageUrl = attractionImages[0]
	// const image = document.createElement("img");
	// image.src = imageUrl;
	// imageSlider.appendChild(image);

	// 製作所有圖片
	attractionImages.forEach(imageUrl => {
		const image = document.createElement("img");
		image.src = imageUrl;
		imageSlider.appendChild(image);
	});


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


let imagesCount;

document.addEventListener("DOMContentLoaded", function() {
    setTimeout(function() {
        imagesCount = document.querySelectorAll("#imageSlider img").length;;
    }, 1000); // 1秒后执行查询
});


let currentIndex = 0

fadeImage(currentIndex);

function fadeImage(index) {
    let imageElements = document.querySelectorAll("#imageSlider img");
    if (index >= 0 && index < imageElements.length) {
        imageElements[index].style.opacity = 1;
		console.log(imageElements[index])
        currentIndex = index;
        // imageElements[currentIndex].style.opacity = 1;
    }
}



let imgLeft = document.getElementById("imgLeft");
let imgRight = document.getElementById("imgRight");

imgLeft.addEventListener("click", function() {
	if (currentIndex > 0) {
		console.log("Left button clicked");
		fadeImage(currentIndex - 1);
	}
});
imgRight.addEventListener("click", function() {
    let imageElements = document.querySelectorAll("#imageSlider img");
    if (currentIndex < imageElements.length - 1) {
        console.log("Right button clicked");
        fadeImage(currentIndex + 1);
    }
});


let morning = document.getElementById("morning");
let afternoon = document.getElementById("afternoon");
afternoon.addEventListener("click", function() {
	iconUp = document.querySelector(".time-icon-up");
	iconDown = document.querySelector(".time-icon-down");

	iconUp.style.backgroundImage = "url(../static/icon/unselect-btn.png)";
	iconDown.style.backgroundImage = "url(../static//icon/select-btn.png)";

	guidanceFee = document.getElementById("guidanceFee")
	guidanceFee.textContent = '新台幣2500元';
})

morning.addEventListener("click", function() {
	iconUp = document.querySelector(".time-icon-up");
	iconDown = document.querySelector(".time-icon-down");

	iconUp.style.backgroundImage = "url(../static/icon/select-btn.png)";
	iconDown.style.backgroundImage = "url(../static//icon/unselect-btn.png)";

	guidanceFee = document.getElementById("guidanceFee")
	guidanceFee.textContent = '新台幣2000元';
})





document.addEventListener("DOMContentLoaded", function() {
    getAttractionData().then(attractionData => {
        createAttractionInfo(attractionData);
    });
});



// 圖片左右滑動
// function imageScroll() {
//     let imgLeft = document.getElementById("imgLeft");
//     let imgRight = document.getElementById("imgRight");

//     imgLeft.addEventListener("click", () => scroll('left'));
//     imgRight.addEventListener("click", () => scroll('right'));
// }

// function scroll(direction) {
// 	const imageSlider = document.getElementById("imageSlider");
//     const currentScrollLeft = imageSlider.scrollLeft;
//     const scrollAmount = imageSlider.clientWidth;
//     let newScrollLeft;

	

//     if (direction === 'left') {
//         newScrollLeft = currentScrollLeft - scrollAmount;
//     }
//     else if (direction === 'right') {
//         newScrollLeft = currentScrollLeft + scrollAmount;
//     }
//     imageSlider.scrollTo({
//         left: newScrollLeft,
//         behavior: "smooth"
//     });
// }

