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
		<div class="attraction_nodata content-bold">查無相關景點</div>
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
