// api連接-取得MRT資料
export function getMRTData() {
    return fetch(`/api/mrts`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    })
    .then(respose => respose.json());
};


// api連接-取得Attraction資料
export function getAttractionData() {
	return fetch(`/api/attractions`, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
		},
	})
	.then(respose => respose.json());
}

// api連接-取得Keyword資料
export function getKeywordData(searchQuery) {
    return fetch(`/api/attractions?keyword=${searchQuery}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    })
    .then(response => response.json());
}

export function fetchData(url, method, headers, body) {
    return fetch(url, {method, headers, body})
        .then(response => {
            if (response.status === 200) {
                return response.json();
            } else if (response.status === 400) {
                return Promise.reject('電子郵件或密碼錯誤');
            } else {
                return Promise.reject('API 請求失敗');
            }
        })
        .catch(error => {
            console.error('發生錯誤:', error);
            return Promise.reject('API 請求失敗');
        });
}