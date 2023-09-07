function fetchAndDisplayAttractions(searchQuery) {
    clearCurrentContent();

    fetch(`/api/attractions?keyword=${searchQuery}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    })
    .then(response => response.json())
    .then(function(responseData) {
        const attractionList = responseData.data;
        if (attractionList.length === 0) {
            createNoData();
        } else {
            nextPage = responseData.nextPage;
            createAttraction(attractionList);
        }
    });
}


// 建立list_bar
function createMrtList(data){
	let container = document.getElementById("mrts_container");

	data.forEach((mrt_name) => {
		let div =document.createElement("button");
		div.textContent = mrt_name;
		container.appendChild(div);
		div.classList.add("mrt_button")
	});
}


// 網頁開啟時，載入list_bar
fetch(`/api/mrts`, {
    method: "GET",
    headers: {
        "Content-Type": "application/json",
    },
})
.then(respose => respose.json())
.then(function(responseData) {
    const mrt_list = responseData.data;

	const filteredMrtList = mrt_list.filter(item => item !== null);

	createMrtList(filteredMrtList)

	mrtButtons = document.querySelectorAll(".mrt_button");

	mrtButtons.forEach(button => {
		button.addEventListener("click", function () {
			const buttonText = this.textContent;
			
			searchQuery = buttonText;
			fetchAndDisplayAttractions(searchQuery);
			
		})
	});
});


// list_bar左右捲動
const leftBtn = document.getElementById("left_btn")
const rightBtn = document.getElementById("right_btn")

leftBtn.addEventListener("click", scrollLeft);
rightBtn.addEventListener("click", scrollRight);

function scrollLeft() {
    mrtsContainer = document.getElementById("mrts_container");
    const currentScrollLeft = mrtsContainer.scrollLeft;
    const scrollAmount = 700;
    const newScrollLeft = currentScrollLeft - scrollAmount;
    mrtsContainer.scroll({top: 0, left: newScrollLeft, behavior: "smooth"});
}

function scrollRight() {
    mrtsContainer = document.getElementById("mrts_container");
    const currentScrollLeft = mrtsContainer.scrollLeft;
    const scrollAmount = 700;
    const newScrollLeft = currentScrollLeft + scrollAmount;
    mrtsContainer.scroll({top: 0, left: newScrollLeft, behavior: "smooth"});
}


// 關鍵字查詢無資料
function createNoData(){
	let container = document.getElementById("attractions");
	attractionNoData = document.createElement("div");
	attractionNoData.classList.add("attraction_nodata");
	attractionNoData.textContent = "查無相關景點"

	container.appendChild(attractionNoData);
}

// 建立attractions
function createAttraction(data) {
	let container = document.getElementById("attractions");

	data.forEach((item) => {
		let attraction_name = item.name
		let attraction_category = item.category
		let attraction_mrt = item.mrt
		let attraction_image = item.images[0]

		// 創建包裝每個景點的<div>
		let attractionContainer = document.createElement("div");
		attractionContainer.classList.add("attraction_wrapper"); // 添加額外的class

	
		// 創建圖片元素
		let img = document.createElement("img");
		img.src = attraction_image;

		// 創建景點名稱元素
		let nameDiv = document.createElement("div");
		nameDiv.textContent = attraction_name;
		nameDiv.classList.add("attraction_name")

		// 創建捷運名稱元素
		let attractionMrtDiv = document.createElement("div");
		attractionMrtDiv.textContent = attraction_mrt;

		// 創建特徵元素
		let categoryDiv = document.createElement("div");
		categoryDiv.textContent = attraction_category;

		// 創建描述容器
		let describeContainer = document.createElement("div");
		describeContainer.classList.add("describe");

		// 將捷運名稱和特徵添加到描述容器
		describeContainer.appendChild(attractionMrtDiv);
		describeContainer.appendChild(categoryDiv);

		// 創建圖片容器
		let infoContainer = document.createElement("div");
		infoContainer.classList.add("img_container");

		// 將圖片和景點名稱添加到圖片容器
		infoContainer.appendChild(img);
		infoContainer.appendChild(nameDiv);

		// 將圖片容器和描述容器添加到attractions_wrapper中
		attractionContainer.appendChild(infoContainer);
		attractionContainer.appendChild(describeContainer);

		// 將attractions_wrapper添加到attractions中
		container.appendChild(attractionContainer);

	})
}

let nextPage = null; 
let isLoading = false;
let searchQuery = '';


// 網頁開啟時，載入初始景點
function loadInitialData() {
	fetch(`/api/attractions`, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
		},
	})
	.then(respose => respose.json())
	.then(function(responseData) {
		const application_list = responseData.data;
		nextPage = responseData.nextPage;
		searchQuery = null;
		createAttraction(application_list)
	})
}


// 清空現有頁面
function clearCurrentContent() {
	const attractionContent = document.getElementById("attractions")
 
	while (attractionContent.firstChild) {
		attractionContent.removeChild(attractionContent.firstChild);
	}
}


// 景點查詢
searchButton = document.getElementById("searchButton");
searchButton.addEventListener("click", function(){
	searchQuery = document.getElementById("searchBox").value;
	fetchAndDisplayAttractions(searchQuery);
});


// 滾動加載監聽
window.addEventListener("scroll", function(e) {
	loadMore(searchQuery)
	}
)

function loadMore(searchQuery){
    if (nextPage === null  || isLoading) {
        return; // 停止加載
    }
    const scrollHeight = document.documentElement.scrollHeight;
    const scrollTop = window.scrollY;
    const clientHeight = window.innerHeight;
    const scrollThreshold = 100; // 設置滾動閾值，用於觸發加載

    // 當滾動到接近頁面底部時，觸發加載
    if (scrollHeight - scrollTop - clientHeight < scrollThreshold) {
		isLoading = true;

		const searchurl = searchQuery !== null
  		? `/api/attractions?keyword=${searchQuery}&page=${nextPage}`
  		: `/api/attractions?page=${nextPage}`;

        fetch(searchurl, {
            method: "GET",
            headers: {	
                "Content-Type": "application/json",
            },
        })
        .then(response => response.json())
        .then(function (responseData) {
            const attractionList = responseData.data;
			
			createAttraction(attractionList);

			nextPage = responseData.nextPage;

			if (nextPage === null) {
				window.removeEventListener("scroll", loadMore);
			}

			isLoading = false;
        	
		});
    }
}

loadInitialData()
