import { getBookingData, getUserData } from './booking.js';

/* 設定三個 tappay field container
 */

// 利用 TPDirect.setupSDK 設定參數
TPDirect.setupSDK(
	137041,
	'app_YpCfF6vfCOA8fNnCH0HKnSJlfGwctHbVTsMp8FdUkVADXMX6CgOkr1V1Hsos',
	'sandbox'
);

TPDirect.card.setup({
	fields: {
		number: {
			// css selector
			element: document.getElementById('card-number'),
			placeholder: '**** **** **** ****',
		},
		expirationDate: {
			// DOM object
			element: document.getElementById('card-expiration-date'),
			placeholder: 'MM / YY',
		},
		ccv: {
			element: document.getElementById('card-ccv'),
			placeholder: 'ccv',
		},
	},
	isMaskCreditCardNumber: true,
	maskCreditCardNumberRange: {
		beginIndex: 6,
		endIndex: 11,
	},
});

let submitButton = document.getElementById('submitButton');
// TPDirect.card.onUpdated 取得 TapPay Fields 狀態
TPDirect.card.onUpdate(function (update) {
	// --> you can call TPDirect.card.getPrime()
	if (update.canGetPrime) {
		// Enable submit Button to get prime.
		submitButton.removeAttribute('disabled');
	} else {
		// Disable submit Button to get prime.
		submitButton.setAttribute('disabled', true);
	}
});

// 利用 TPDirect.card.getPrime 來取得 prime 字串

// call TPDirect.card.getPrime when user submit form to get tappay prime
// $('form').on('submit', onSubmit)
submitButton.addEventListener('click', onSubmit);
const token = localStorage.getItem('token');
function onSubmit(event) {
	event.preventDefault();

	// 取得 TapPay Fields 的 status
	const tappayStatus = TPDirect.card.getTappayFieldsStatus();
	// console.log(tappayStatus);

	// 確認是否可以 getPrime
	if (tappayStatus.canGetPrime === false) {
		alert('can not get prime');
		return;
	}

	// Get prime
	TPDirect.card.getPrime(async (result) => {
		// if (result.status !== 0) {
		//     alert('get prime error ' + result.msg)
		//     return
		// }
		// alert('get prime 成功，prime: ' + result.card.prime);

		let order = await getBookingData();
		let contact = await getUserData();
		let primeData = {
			prime: result.card.prime,
			order: {
				price: order.data.price,
				trip: { attraction: order.data.attraction },
				date: order.data.time,
				time: order.data.date,
			},
			contact: {
				name: contact.data.name,
				email: contact.data.email,
				phone: inputPhone.value,
			},
		};

		// send prime to your server, to pay with Pay by Prime API .
		fetch(`/api/orders`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify(primeData),
		})
			.then((response) => response.json())
			.then((data) => {
				// console.log(data);
				window.location.href = `/thankyou?number=${data.data.number}`;
			});

		// Pay By Prime Docs: https://docs.tappaysdk.com/tutorial/zh/back.html#pay-by-prime-api
	});
}

// 使用 TPDirect.card.setup 設定外觀
// TPDirect.card.setup({
//     // Display ccv field
//     fields : {
//         number: {
//             // css selector
//             element: '#card-number',
//             placeholder: '**** **** **** ****'
//         },
//         expirationDate: {
//             // DOM object
//             element: document.getElementById('card-expiration-date'),
//             placeholder: 'MM / YY'
//         },
//         ccv: {
//             element: '#card-ccv',
//             placeholder: 'ccv'
//         }
//     },
//     styles: {
//         // Style all elements
//         'input': {
//             'color': 'gray'
//         },
//         // Styling ccv field
//         'input.ccv': {
//             // 'font-size': '16px'
//         },
//         // Styling expiration-date field
//         'input.expiration-date': {
//             // 'font-size': '16px'
//         },
//         // Styling card-number field
//         'input.card-number': {
//             // 'font-size': '16px'
//         },
//         // style focus state
//         ':focus': {
//             // 'color': 'black'
//         },
//         // style valid state
//         '.valid': {
//             'color': 'green'
//         },
//         // style invalid state
//         '.invalid': {
//             'color': 'red'
//         },
//         // Media queries
//         // Note that these apply to the iframe, not the root window.
//         '@media screen and (max-width: 400px)': {
//             'input': {
//                 'color': 'orange'
//             }
//         }
//     },
//     // 此設定會顯示卡號輸入正確後，會顯示前六後四碼信用卡卡號
//     isMaskCreditCardNumber: true,
//     maskCreditCardNumberRange: {
//         beginIndex: 6,
//         endIndex: 11
//     }
// })
