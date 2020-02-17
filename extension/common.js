/**
	Спільні дії для popup.js і options.js
*/

// Ідентифікатор планового закриття сповіщення
var timeout_id

// Закриття сповіщення
function hideMsgbox() {
	Array.from(document.getElementsByClassName('show')).forEach((el) => el.classList.remove('show', 'success', 'error'))
}

// Мова інтерфейсу — виставлення текстівок при завантаженні popup/options
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
		document.getElementById('status-switch').parentNode.title = chrome.i18n.getMessage(status?'status_off':'status_on')
	})
}

// ————————————————————————————————————————————————————————————————————————————————
// РЕЖИМ ВИБОРУ САЙТІВ
// ————————————————————————————————————————————————————————————————————————————————
function changeMode() {
	var mode = parseInt(document.getElementById('mode').value)
	chrome.storage.sync.set({mode: mode}, function() {
		console.log('Режим виставлений')
		// Оновлення іконки TODO
		// chrome.runtime.sendMessage({action: 'updateIcon', value: status})
		// Блоки винятків і цілей
		Array.from(document.querySelectorAll('[data-exceptions]')).forEach((el) => {el.style.display = !mode?'block':'none'})
		Array.from(document.querySelectorAll('[data-targets]')).forEach((el) => {el.style.display = mode?'block':'none'})
	})
}

// ————————————————————————————————————————————————————————————————————————————————
// ————————————————————————————————————————————————————————————————————————————————
// СТАРТОВІ ЗАВДАННЯ
// Статус увімкненості
chrome.storage.local.get('status', function(data) {
	document.getElementById('status-switch').checked = !!data.status
	document.getElementById('status-switch').parentNode.title = chrome.i18n.getMessage(!!data.status?'status_off':'status_on')
	document.getElementById('status-switch').onchange = changeStatus
})

// Режим сайтів
chrome.storage.sync.get('mode', function(data) {
	var mode = parseInt(data.mode)
	document.getElementById('mode').value = mode
	Array.from(document.querySelectorAll('[data-exceptions]')).forEach((el) => {el.style.display = !mode?'block':'none'})
	Array.from(document.querySelectorAll('[data-targets]')).forEach((el) => {el.style.display = mode?'block':'none'})
	document.getElementById('mode').onchange = changeMode
})
