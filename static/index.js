// 建立list_bar

function createMrtList(data){
	let container = document.getElementById("mrts_container");

	data.forEach((mrt_name) => {
		let div =document.createElement("button");
		div.textContent = mrt_name;
		container.appendChild(div);
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
	createMrtList(mrt_list)
});


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

let next_page = 0;
let isLoading = false;
let searchQuery = '';

// 網頁開啟時，載入初始景點
function loadInitialData() {
	fetch(`/api/attractions?page=0`, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
		},
	})
	.then(respose => respose.json())
	.then(function(responseData) {
		const application_list = responseData.data;
		next_page = responseData.nextPage;
		createAttraction(application_list)
	});
}

loadInitialData()



// 景點查詢
document.getElementById("searchButton").addEventListener("click", function() {
		const searchQuery = document.getElementById("searchBox").value;

		clearCurrentContent();

		fetch(`/api/attractions?keyword=${searchQuery}`, {method: "GET", headers: {"Content-Type": "application/json",},})

		.then(response => response.json())
		.then(function(responseData) {
			const attractionList = responseData.data;
			createAttraction(attractionList);

			next_page = responseData.nextPage;
			isLoading = false;
		})
})

function clearCurrentContent() {
	const attractionContent = document.getElementById("attractions")
 
	while (attractionContent.firstChild) {
		attractionContent.removeChild(attractionContent.firstChild);
	}
}


// 滾動觸發
window.addEventListener("scroll", function() {
	loadMore(searchQuery)
});

function loadMore(searchQuery){
    if (next_page === null || isLoading) {
        return; // 停止加载
    }

    const scrollHeight = document.documentElement.scrollHeight;
    const scrollTop = window.scrollY;
    const clientHeight = window.innerHeight;
    const scrollThreshold = 100; // 设置一个滚动阈值，用于触发加载

    // 当滚动到接近页面底部时触发加载
    if (scrollHeight - scrollTop - clientHeight < scrollThreshold) {
        isLoading = true;

		const url = searchQuery ? `/api/attractions?page=${next_page}&keyword=${searchQuery}`
		: `/api/attractions?page=${next_page}`;

        fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        })
        .then(response => response.json())
        .then(function (responseData) {
            const attractionList = responseData.data;
            createAttraction(attractionList);

            // 增加页面号，以便下次加载下一页
            next_page = responseData.nextPage;

            // 如果 next_page 为 null，将不再加载
            if (next_page === null) {
                window.removeEventListener("scroll", loadMore); // 移除滚动监听
            }

            // 重置加载状态
            isLoading = false;
        });
    }
}
