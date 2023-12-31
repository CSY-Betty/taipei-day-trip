export function fetchUserData(url, method, headers, body) {
	return fetch(url, { method, headers, body })
		.then((response) => {
			if (response.status === 200) {
				return response.json();
			} else if (response.status === 400) {
				return Promise.reject('電子郵件或密碼錯誤');
			} else {
				return Promise.reject('API 請求失敗');
			}
		})
		.catch((error) => {
			console.error('發生錯誤:', error);
			return Promise.reject('API 請求失敗');
		});
}

export function fetchData(url, method, headers, body) {
	return fetch(url, { method, headers, body })
		.then((response) => {
			if (response.status === 200) {
				return response.json();
			} else if (response.status === 400) {
				return Promise.reject('連線異常');
			} else {
				return Promise.reject('API 請求失敗');
			}
		})
		.catch((error) => {
			console.error('發生錯誤:', error);
			return Promise.reject('API 請求失敗');
		});
}
