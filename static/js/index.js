import { renderAttractions, renderMrtList } from './div-builder.js';
import { fetchData } from './fetchAPI.js';

let nextPage = null;
let isLoading = false;
let searchQuery = '';

function fetchAttractionData(searchQuery = null, nextPage = null) {
	let url = '/api/attractions';
	if (searchQuery !== null) {
		url += `?keyword=${searchQuery}`;
	}

	if (nextPage !== null) {
		url += searchQuery ? `&page=${nextPage}` : `?page=${nextPage}`;
	}

	return fetchData(
		url,
		'GET',
		{
			'Content-Type': 'application/json',
		},
		null
	);
}

function fetchMrtData() {
	return fetchData(
		'/api/mrts',
		'GET',
		{
			'Content-Type': 'application/json',
		},
		null
	);
}

async function searchByKeyword(searchQuery) {
	const attractionData = await fetchAttractionData(searchQuery);

	nextPage = attractionData.nextPage;
	renderAttractions(attractionData);
}

// 關鍵字查詢
function handleSearchButton() {
	document
		.getElementById('searchButton')
		.addEventListener('click', function () {
			searchQuery = document.getElementById('searchBox').value;
			clearCurrentContent();
			searchByKeyword(searchQuery);
		});
}

handleSearchButton();

// list_bar搜尋
function handleMrtButton() {
	let mrtButtons = document.querySelectorAll('.mrt_button');
	mrtButtons.forEach((button) => {
		button.addEventListener('click', function () {
			const buttonText = this.textContent;

			let searchQuery = buttonText;
			clearCurrentContent();
			searchByKeyword(searchQuery);

			let searchBox = document.getElementById('searchBox');
			searchBox.value = buttonText;
		});
	});
}

// list_bar左右捲動
function mrtScrollList(direction) {
	const mrtsContainer = document.getElementById('mrts_container');
	const currentScrollLeft = mrtsContainer.scrollLeft;
	const scrollAmount = mrtsContainer.clientWidth - 20;
	let newScrollLeft;

	if (direction === 'left') {
		newScrollLeft = currentScrollLeft - scrollAmount;
	} else if (direction === 'right') {
		newScrollLeft = currentScrollLeft + scrollAmount;
	}
	mrtsContainer.scroll({ top: 0, left: newScrollLeft, behavior: 'smooth' });
}

function setupListBarScroll() {
	let leftBtn = document.getElementById('left_btn');
	let rightBtn = document.getElementById('right_btn');

	leftBtn.addEventListener('click', () => mrtScrollList('left'));
	rightBtn.addEventListener('click', () => mrtScrollList('right'));
}

function initListBar() {
	fetchMrtData().then((MrtData) => {
		renderMrtList(MrtData);
		handleMrtButton();
	});
	setupListBarScroll();
}

initListBar();

// 景點載入
async function loadAttractionData() {
	const attractionData = await fetchAttractionData();

	nextPage = attractionData.nextPage;
	searchQuery = null;
	renderAttractions(attractionData);
}

loadAttractionData();

// 清空現有頁面
function clearCurrentContent() {
	const attractionWrappers = document.querySelectorAll('.attraction_wrapper');

	const attractionNoData = document.querySelectorAll('.attraction_nodata');

	attractionWrappers.forEach((element) => {
		element.remove();
	});
	attractionNoData.forEach((element) => {
		element.remove();
	});
}

// 滾動加載監聽
async function handleScrollAndLoadMore(searchQuery) {
	if (nextPage === null || isLoading) {
		return; // 停止加載
	}

	// 整個畫面的高度
	const scrollHeight = document.documentElement.scrollHeight;
	const scrollTop = window.scrollY;
	const clientHeight = window.innerHeight;
	const scrollThreshold = 100;

	// 當滾動到接近頁面底部時，觸發加載
	if (scrollHeight - scrollTop - clientHeight < scrollThreshold) {
		isLoading = true;
		const attractionData = await fetchAttractionData(searchQuery, nextPage);
		renderAttractions(attractionData);

		nextPage = attractionData.nextPage;

		if (nextPage === null) {
			window.removeEventListener('scroll', handleScrollAndLoadMore);
		}

		isLoading = false;
	}
}

window.addEventListener('scroll', function () {
	handleScrollAndLoadMore(searchQuery);
});

function handleAttractionClick() {
	let attraction = document.getElementById('attractions');
	attraction.addEventListener('click', function (event) {
		let attractionWrapper = event.target.closest('.attraction_wrapper');
		if (attractionWrapper) {
			let attractionId = attractionWrapper.getAttribute('attractionId');

			const attractionLink = `/attraction/${attractionId}`;

			window.location.href = attractionLink;
		}
	});
}

handleAttractionClick();
