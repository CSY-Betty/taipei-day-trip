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