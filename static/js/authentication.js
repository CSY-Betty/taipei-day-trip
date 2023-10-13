import { fetchData } from "./fetchData.js";

function checkAuthentication(token) {
	return fetchData(
		"/api/user/auth",
		"POST",
		{
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		},
		null
	);
}

function renderAuthentication(isAuthenticated) {
	if (isAuthenticated) {
		loginRegisterButton.style.display = "none";
		logoutButton.style.display = "block";
	} else {
		loginRegisterButton.style.display = "block";
		logoutButton.style.display = "none";
	}
}

export function handleAuthentication(token) {
	if (token !== null && token !== undefined) {
		checkAuthentication(token).then((isAuthenticated) => {
			renderAuthentication(isAuthenticated);
		});
	}
}
