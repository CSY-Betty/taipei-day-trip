// 建立list_bar
export function createMrtList(data){
	let container = document.getElementById("mrts_container");

	const mrt_list = data.data;
	const filteredMrtList = mrt_list.filter(item => item !== null);

	filteredMrtList.forEach((mrt_name) => {
		let div =document.createElement("button");
		div.textContent = mrt_name;
		container.appendChild(div);
		div.classList.add("mrt_button", "body-med")
	});
}


// 建立attractions
export function createAttraction(data) {
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
		nameDiv.classList.add("attraction_name", "body-bold")

		// 創建捷運名稱元素
		let attractionMrtDiv = document.createElement("div");
		attractionMrtDiv.textContent = attraction_mrt;
		attractionMrtDiv.classList.add("attraction_mrt", "body-med");

		// 創建特徵元素
		let categoryDiv = document.createElement("div");
		categoryDiv.textContent = attraction_category;
		categoryDiv.classList.add("attraction_category", "body-med");

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

// 建立查無資料
export function createNoData(){
	let container = document.getElementById("attractions");
	let attractionNoData = document.createElement("div");
	attractionNoData.classList.add("attraction_nodata", "content-bold");
	attractionNoData.textContent = "查無相關景點"

	container.appendChild(attractionNoData);
}