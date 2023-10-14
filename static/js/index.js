import * as divBuilder from './div-builder.js';
import { fetchData } from './fetchAPI.js';

let nextPage = null;
let isLoading = false;
let searchQuery = '';

// 點擊list
function mrtButtonHandler() {
	let mrtButtons = document.querySelectorAll('.mrt_button');
	mrtButtons.forEach((button) => {
		button.addEventListener('click', function () {
			const buttonText = this.textContent;

			let searchQuery = buttonText;
			clearCurrentContent();
			searchByKeyword(searchQuery);

			// 更換搜尋欄顯示文字
			let searchBox = document.getElementById('searchBox');
			searchBox.value = '';
			searchBox.setAttribute('placeholder', buttonText);
		});
	});
}

function loadAttractionData() {
	fetchData(
		'/api/attractions',
		'GET',
		{
			'Content-Type': 'application/json',
		},
		null
	).then((attractionData) => {
		nextPage = attractionData.nextPage;
		searchQuery = null;
		divBuilder.renderAttractions(attractionData);
	});
}

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

// 景點查詢按鈕
const searchButton = document.getElementById('searchButton');
searchButton.addEventListener('click', function () {
	searchQuery = document.getElementById('searchBox').value;
	clearCurrentContent();
	searchByKeyword(searchQuery);
});

// 關鍵字查詢
function searchByKeyword(searchQuery) {
	fetchData(`/api/attractions?keyword=${searchQuery}`, 'GET', {
		'Content-Type': 'application/json',
	}).then((data) => {
		const attractionData = data.data;
		if (attractionData.length === 0) {
			divBuilder.renderAttractions(data);
		} else {
			nextPage = data.nextPage;
			divBuilder.renderAttractions(data);
		}
	});
}

// 滾動加載監聽
window.addEventListener('scroll', function (e) {
	loadMore(searchQuery);
});

function loadMore(searchQuery) {
	if (nextPage === null || isLoading) {
		return; // 停止加載
	}

	// 整個畫面的高度
	const scrollHeight = document.documentElement.scrollHeight;
	const scrollTop = window.scrollY;
	const clientHeight = window.innerHeight;
	const scrollThreshold = 100; // 設置滾動閾值，用於觸發加載

	// 當滾動到接近頁面底部時，觸發加載
	if (scrollHeight - scrollTop - clientHeight < scrollThreshold) {
		isLoading = true;

		const searchurl =
			searchQuery !== null
				? `/api/attractions?keyword=${searchQuery}&page=${nextPage}`
				: `/api/attractions?page=${nextPage}`;

		fetchData(
			searchurl,
			'GET',
			{
				'Content-Type': 'application/json',
			},
			null
		).then(function (responseData) {
			divBuilder.renderAttractions(responseData);

			nextPage = responseData.nextPage;

			if (nextPage === null) {
				window.removeEventListener('scroll', loadMore);
			}

			isLoading = false;
		});
	}
}

// 清空搜尋框
function resetSearchBox() {
	const searchBox = document.getElementById('searchBox');
	searchBox.value = '';
	searchBox.setAttribute('placeholder', '輸入景點名稱查詢');
}

// listBar左右滾動
function listBarScroll() {
	let leftBtn = document.getElementById('left_btn');
	let rightBtn = document.getElementById('right_btn');

	leftBtn.addEventListener('click', () => scroll('left'));
	rightBtn.addEventListener('click', () => scroll('right'));
}

function scroll(direction) {
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

loadAttractionData();

fetchData(
	'/api/mrts',
	'GET',
	{
		'Content-Type': 'application/json',
	},
	null
).then((MrtData) => {
	divBuilder.renderMrtList(MrtData);
	mrtButtonHandler();
});

// list_bar左右捲動
listBarScroll();

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
