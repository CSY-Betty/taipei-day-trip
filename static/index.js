import * as divBuilder from './div-builder.js' 


let nextPage = null; 
let isLoading = false;
let searchQuery = '';



// api連接-取得MRT資料
function getMRTData() {
    return fetch(`/api/mrts`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    })
    .then(respose => respose.json());
};


// api連接-取得Attraction資料
function getAttractionData() {
	return fetch(`/api/attractions`, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
		},
	})
	.then(respose => respose.json());
}

// api連接-取得Keyword資料
function getKeywordData(searchQuery) {
    return fetch(`/api/attractions?keyword=${searchQuery}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    })
    .then(response => response.json());
}


// 監聽器-list_bar
function mrtButtonHandler() {
    let mrtButtons = document.querySelectorAll(".mrt_button");
    mrtButtons.forEach(button => {
        button.addEventListener("click", function () {
            const buttonText = this.textContent;
            
            let searchQuery = buttonText;
            clearCurrentContent();
            searchByKeyword(searchQuery);

            // 更換搜尋欄顯示文字
            let searchBox = document.getElementById("searchBox");
                searchBox.value = "";
            searchBox.setAttribute("placeholder", buttonText);			
        });
    });
};


function loadAttractionData() {
    getAttractionData().then(attractionData => {
        nextPage = attractionData.nextPage;
        searchQuery = null;
        divBuilder.createAttraction(attractionData)
    });
}


// 清空現有頁面
function clearCurrentContent() {
    const attractionWrappers = document.querySelectorAll(".attraction_wrapper");

	const attractionNoData = document.querySelectorAll(".attraction_nodata")
	
    attractionWrappers.forEach(element => {
        element.remove();
    });
	attractionNoData.forEach(element => {
        element.remove();
    });
}


// 景點查詢按鈕
const searchButton = document.getElementById("searchButton");
searchButton.addEventListener("click", function(){
	searchQuery = document.getElementById("searchBox").value;
    clearCurrentContent();
	searchByKeyword(searchQuery);
});



// 關鍵字查詢
function searchByKeyword(searchQuery) {
    getKeywordData(searchQuery).then(data => {
        const attractionData = data.data
        if (attractionData.length === 0) {
            divBuilder.createNoData();
        } else {
            nextPage = data.nextPage;
            divBuilder.createAttraction(data);
        }
    })
}


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
			
			divBuilder.createAttraction(responseData);

			nextPage = responseData.nextPage;

			if (nextPage === null) {
				window.removeEventListener("scroll", loadMore);
			}

			isLoading = false;
        	
		});
    }
}


// 返回初始畫面
let titleButton = document.getElementById("title");
titleButton.addEventListener("click", function(){
	clearCurrentContent();
	resetSearchBox();
	loadAttractionData();
});

// 清空搜尋框
function resetSearchBox() {
    const searchBox = document.getElementById("searchBox");
    searchBox.value = "";
    searchBox.setAttribute("placeholder", "輸入景點名稱查詢");
}

// listBar左右滾動
function listBarScroll() {
    let leftBtn = document.getElementById("left_btn")
    let rightBtn = document.getElementById("right_btn")

    leftBtn.addEventListener("click", () => scroll('left'));
    rightBtn.addEventListener("click", () => scroll('right'));
}

function scroll(direction) {
    const mrtsContainer = document.getElementById("mrts_container");
    const currentScrollLeft = mrtsContainer.scrollLeft;
    const scrollAmount = mrtsContainer.clientWidth - 20;
    let newScrollLeft;

    if (direction === 'left') {
        newScrollLeft = currentScrollLeft - scrollAmount;
    }
    else if (direction === 'right') {
        newScrollLeft = currentScrollLeft + scrollAmount;
    }
    mrtsContainer.scroll({top: 0, left: newScrollLeft, behavior: "smooth"});
}


loadAttractionData();
getMRTData().then(MrtData => {
    divBuilder.createMrtList(MrtData);
    mrtButtonHandler();
});

// list_bar左右捲動
listBarScroll();
