/**
	Спільні дії для popup.js і options.js
*/

var timeout_id
function hideMsgbox() {
	Array.from(document.getElementsByClassName('show')).forEach((el) => el.classList.remove('show', 'success', 'error'))
}

// Інтерфейс
Array.from(document.querySelectorAll('[data-i18n]')).forEach((el) => {
	el.innerText = chrome.i18n.getMessage(el.dataset.i18n)
})


// ————————————————————————————————————————————————————————————————————————————————
// СТАТУС УВІМКНЕНОСТІ
// ————————————————————————————————————————————————————————————————————————————————
function changeStatus() {
	var status = document.getElementById('status-switch').checked
	chrome.storage.local.set({status: status}, function() {
		console.log('Статус активності виставлений')
		// Оновлення іконки TODO
		// chrome.runtime.sendMessage({action: 'updateIcon', value: status})
		// Зміна підпису
		document.getElementById('status-switch').parentNode.title = chrome.i18m.getMessage(status?'status_off':'status_on')
	})
}

// ————————————————————————————————————————————————————————————————————————————————
// ВЕБСАЙТИ-ВИНЯТКИ
// ————————————————————————————————————————————————————————————————————————————————
// Додати новий вебсайт
function addException() {
	clearTimeout(timeout_id)
	var website = document.getElementById('newexception').value
	chrome.storage.sync.get('exceptions', function(data) {
		var exceptions = data.exceptions ? data.exceptions : []
		if (website && !exceptions.includes(website)) {
			exceptions.push(website)
			// Запис у сховище
			var jsonObj = {}
			jsonObj.blockedwebsites = blockedwebsites
			chrome.storage.sync.set(jsonObj, function() {
				console.log('Новий елемент збережено.')
			})
			// Повідомлення користувачеві
			document.getElementById('newexception').value = ''
			document.getElementById('form-newexception').previousElementSibling.classList.add('show', 'success')
			document.getElementById('form-newexception').previousElementSibling.innerText = chrome.i18m.getMessage('done')
			timeout_id = setTimeout(hideMsgbox, 2000)
			// Оновити показаний список
			showExceptions()
		} else {
			document.getElementById('form-newexception').previousElementSibling.classList.add('show', 'error')
			document.getElementById('form-newexception').previousElementSibling.innerText = chrome.i18m.getMessage('alreadyadded')
			timeout_id = setTimeout(hideMsgbox, 10000)
		}
	})
}

// Перекрити у файлі options.js
function showExceptions() {}

// ————————————————————————————————————————————————————————————————————————————————
// ————————————————————————————————————————————————————————————————————————————————
// СТАРТОВІ ЗАВДАННЯ
// Дія "Додати новий заблокований сайт"
document.getElementById('form-newexception').onsubmit = function(e) {
	e.preventDefault()
	addException()
}


// Ховати старі сповіщення при введенні нових даних
document.getElementById('newexception').onchange = hideMsgbox

// Статус увімкненості
chrome.storage.local.get('status', function(data) {
	document.getElementById('status-switch').checked = !!data.status
})

document.getElementById('status-switch').onchange = changeStatus
