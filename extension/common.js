/**
	Спільні дії для popup.js і options.js
*/

// Посилання на базу проблемних текстівок
// const wrongphraselisturl = 'http://ppdev.ga.home/wrongdetections'
const wrongphraselisturl = 'https://tymchasove.tk/wrongdetections'
const addwrongphraseurl = wrongphraselisturl + '/add'

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
	chrome.storage.local.set({mode: mode}, function() {
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
chrome.storage.local.get('mode', function(data) {
	var mode = parseInt(data.mode)
	document.getElementById('mode').value = mode
	Array.from(document.querySelectorAll('[data-exceptions]')).forEach((el) => {el.style.display = !mode?'block':'none'})
	Array.from(document.querySelectorAll('[data-targets]')).forEach((el) => {el.style.display = mode?'block':'none'})
	document.getElementById('mode').onchange = changeMode
})


// ————————————————————————————————————————————————————————————————————————————————
// ————————————————————————————————————————————————————————————————————————————————
// https://stackoverflow.com/questions/23822170/getting-unique-clientid-from-chrome-extension
// Ідентифікатор користувача — допоміжна функція
function getRandomToken() {
	// E.g. 8 * 32 = 256 bits token
	var randomPool = new Uint8Array(32)
	crypto.getRandomValues(randomPool)
	var hex = ''
	for (var i = 0; i < randomPool.length; ++i) hex += randomPool[i].toString(16)
	// E.g. db18458e2782b2b77e36769c569e263a53885a9944dd0a861e5064eac16f1a
	return hex
}

// Надсилання текстівки. для якої неправильно визначена мова
function submitNewWrongDetection(e, userid) {
	// Дані
	var phrase = document.getElementById('newphrase').value

	// Перевірка мови
	chrome.i18n.detectLanguage(phrase, function(result) {
		var xhr = new XMLHttpRequest()
		xhr.open('POST', addwrongphraseurl)
		xhr.onload = function() {
			if (xhr.status === 200) {
				try {
					var response = JSON.parse(xhr.responseText)
					if (response.success) {
						document.getElementById('newphrase').value = ''
						
						document.getElementById('form-add').previousElementSibling.classList.add('show', 'success')
						document.getElementById('form-add').previousElementSibling.innerText = chrome.i18n.getMessage('phrase_submitted')
					}
					if (response.error) {
						document.getElementById('form-add').previousElementSibling.classList.add('show', 'error')
						document.getElementById('form-add').previousElementSibling.innerText = chrome.i18n.getMessage(response.error)
					}
				} catch (e) {
					console.log('Щось пішло не так. ' + xhr.responseText)
				}
			} else if (xhr.status !== 200) {
				console.log('Запит провалився. Повернено статус ' + xhr.status)
			}
			document.getElementById('newphrase').disabled = false
			document.getElementById('submit-add').disabled = false
		}
		var formdata = new FormData()
		formdata.append('userid', userid)
		formdata.append('phrase', document.getElementById('newphrase').value)
		formdata.append('result', JSON.stringify(result))

		xhr.send(formdata)
	})
}

// Надсилання текстівки. для якої неправильно визначена мова
document.getElementById('form-add').addEventListener('submit', function(e) {
	e.preventDefault()
	document.getElementById('newphrase').disabled = true
	document.getElementById('submit-add').disabled = true

	// Ідентифікатор користувача
	chrome.storage.sync.get('userid', function(items) {
		var userid = items.userid
		if (userid) {
			submitNewWrongDetection(e, userid)
		} else {
			userid = getRandomToken()
			chrome.storage.sync.set({userid: userid}, function() {
				submitNewWrongDetection(e, userid)
			})
		}
	})
}, true)
