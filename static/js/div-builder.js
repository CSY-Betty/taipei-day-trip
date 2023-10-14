// 建立list_bar
export function renderMrtList(data) {
	let container = document.getElementById('mrts_container');

	let mrtList = data.data.filter((item) => item !== null);

	mrtList.forEach((mrtName) => {
		const button = `
		<button class="mrt_button body-med">${mrtName}</button>
		`;
		container.insertAdjacentHTML('beforeend', button);
	});
}

// 建立attractions
export function createAttraction(data) {
	const container = document.getElementById('attractions');

	const attractionData = data.data;

	attractionData.forEach((item) => {
		let attraction_name = item.name;
		let attraction_category = item.category;
		let attraction_mrt = item.mrt;
		let attraction_image = item.images[0];
		let attraction_id = item.id;

		// 創建包裝每個景點的<div>
		let attractionContainer = document.createElement('div');
		attractionContainer.classList.add('attraction_wrapper');
		attractionContainer.setAttribute('attractionId', attraction_id);

		// 創建圖片元素
		let img = document.createElement('img');
		img.src = attraction_image;

		// 創建景點名稱元素
		let nameDiv = document.createElement('div');
		nameDiv.textContent = attraction_name;
		nameDiv.classList.add('attraction_name', 'body-bold');

		// 創建捷運名稱元素
		let attractionMrtDiv = document.createElement('div');
		attractionMrtDiv.textContent = attraction_mrt;
		attractionMrtDiv.classList.add('attraction_mrt', 'body-med');

		// 創建特徵元素
		let categoryDiv = document.createElement('div');
		categoryDiv.textContent = attraction_category;
		categoryDiv.classList.add('attraction_category', 'body-med');

		// 創建描述容器
		let describeContainer = document.createElement('div');
		describeContainer.classList.add('describe');

		// 將捷運名稱和特徵添加到描述容器
		describeContainer.appendChild(attractionMrtDiv);
		describeContainer.appendChild(categoryDiv);

		// 創建圖片容器
		let infoContainer = document.createElement('div');
		infoContainer.classList.add('img_container');

		// 將圖片和景點名稱添加到圖片容器
		infoContainer.appendChild(img);
		infoContainer.appendChild(nameDiv);

		// 將圖片容器和描述容器添加到attractions_wrapper中
		attractionContainer.appendChild(infoContainer);
		attractionContainer.appendChild(describeContainer);

		container.appendChild(attractionContainer);
	});
}

// 建立查無資料
export function createNoData() {
	let container = document.getElementById('attractions');
	let attractionNoData = document.createElement('div');
	attractionNoData.classList.add('attraction_nodata', 'content-bold');
	attractionNoData.textContent = '查無相關景點';

	container.appendChild(attractionNoData);
}

function renderAttraction(attraction, container) {
	const { id, name, mrt, category, images } = attraction;

	const attractionHtml = `
		<div class="attraction_wrapper" attractionid=${id}>
			<div class="img_container">
				<img src="${images[0]}">
				<div class="attraction_name body-bold">${name}</div>
			</div>
			<div class="describe">
				<div class="attraction_mrt body-med">${mrt}</div>
				<div class="attraction_category body-med">${category}</div>
			</div>
		</div>

	`;
	container.insertAdjacentHTML('beforeend', attractionHtml);
}

function renderNoData(container) {
	const noDataHtml = `
		<div class="attraction_nodata ccontent-bold">查無相關景點</div>
		`;
	container.insertAdjacentHTML('beforeend', noDataHtml);
}

export function renderAttractions(data) {
	const container = document.getElementById('attractions');
	const attractionData = data.data;

	if (attractionData.length > 0) {
		attractionData.forEach((item) => {
			renderAttraction(item, container);
		});
	} else {
		renderNoData(container);
	}
}
