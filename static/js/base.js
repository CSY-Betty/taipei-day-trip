import { setupLoginDialogHandlers } from './loginLogout.js';
import { handleAuthentication } from './authentication.js';

const token = localStorage.getItem('token');

document.getElementById('title').addEventListener('click', () => {
	window.location.href = '/';
});

document.getElementById('bookingButton').addEventListener('click', () => {
	if (token !== null && token !== undefined) {
		window.location.href = '/booking';
	} else {
		loginDialog.showModal();
	}
});

setupLoginDialogHandlers();
// handleAuthentication(token);

const userData = handleAuthentication(token);

export { userData };
