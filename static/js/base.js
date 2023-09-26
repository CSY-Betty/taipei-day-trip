let titleButton = document.getElementById("title");
titleButton.addEventListener("click", function(){
	window.location.href = '/';
});


let bookingButton = document.getElementById('bookingButton')
let token = localStorage.getItem("token");
bookingButton.addEventListener("click", function() {
	if (token) {
		window.location.href = '/booking';
	}
	else {
		loginDialog.showModal();
	}
})