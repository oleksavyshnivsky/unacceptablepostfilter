// options.html також використовує common.js

// ————————————————————————————————————————————————————————————————————————————————
// ВИНЯТКИ
// ————————————————————————————————————————————————————————————————————————————————
// Додати новий вебсайт у список винятків
function addException() {
	clearTimeout(timeout_id)
	var website = document.getElementById('newexception').value
	chrome.storage.sync.get('exceptions', function(data) {
		var exceptions = data.exceptions ? data.exceptions : []
		if (website && !exceptions.includes(website)) {
			exceptions.push(website)
			// Запис у сховище
			var jsonObj = {}
			jsonObj.exceptions = exceptions
			chrome.storage.sync.set(jsonObj, function() {
				console.log('Новий елемент збережено.')
			})
			// Повідомлення користувачеві
			document.getElementById('newexception').value = ''
			document.getElementById('form-newexception').previousElementSibling.classList.add('show', 'success')
			document.getElementById('form-newexception').previousElementSibling.innerText = chrome.i18n.getMessage('done')
			timeout_id = setTimeout(hideMsgbox, 2000)
			// Оновити показаний список
			showExceptions()
		} else {
			document.getElementById('form-newexception').previousElementSibling.classList.add('show', 'error')
			document.getElementById('form-newexception').previousElementSibling.innerText = chrome.i18n.getMessage('alreadyadded')
			timeout_id = setTimeout(hideMsgbox, 10000)
		}
	})
}

// ————————————————————————————————————————————————————————————————————————————————
// Видалити сайт зі списку винятків
function deleteException(website) {
	if (confirm(chrome.i18n.getMessage('confirm_exception_removal'))) {
		chrome.storage.sync.get('exceptions', function(data) {
			var exceptions = data.exceptions ? data.exceptions : []
			if (website && exceptions.includes(website)) {
				exceptions.splice(exceptions.indexOf(website), 1)
				// Збереження
				var jsonObj = {}
				jsonObj.exceptions = exceptions
				chrome.storage.sync.set(jsonObj, function() {
					console.log('Оновлений список винятків збережено.')
				})
				// Оновити показаний список
				showExceptions()
			}
		})
	}
}

// ————————————————————————————————————————————————————————————————————————————————
// Список винятків
function showExceptions() {
	chrome.storage.sync.get('exceptions', function(data) {
		data.exceptions = data.exceptions ? data.exceptions : []
		var html = ''
		data.exceptions.forEach(function(el, i) {
			html += '<tr><td>' + el + '</td><td class="td-delete"><i data-deleteexception="' + el + '">&times;</i></td></tr>'
		})
		document.getElementById('exceptions-wrapper').innerHTML = '<table class="table"><tbody>' + html + '</tbody></table>'
	})
}

// ————————————————————————————————————————————————————————————————————————————————
// ЦІЛЬОВІ САЙТИ
// ————————————————————————————————————————————————————————————————————————————————
// Додати новий вебсайт у цільовий список
function addTarget() {
	clearTimeout(timeout_id)
	var website = document.getElementById('newtarget').value
	chrome.storage.sync.get('targets', function(data) {
		var targets = data.targets ? data.targets : []
		if (website && !targets.includes(website)) {
			targets.push(website)
			// Запис у сховище
			var jsonObj = {}
			jsonObj.targets = targets
			chrome.storage.sync.set(jsonObj, function() {
				console.log('Новий елемент збережено.')
			})
			// Повідомлення користувачеві
			document.getElementById('newtarget').value = ''
			document.getElementById('form-newtarget').previousElementSibling.classList.add('show', 'success')
			document.getElementById('form-newtarget').previousElementSibling.innerText = chrome.i18n.getMessage('done')
			timeout_id = setTimeout(hideMsgbox, 2000)
			// Оновити показаний список
			showTargets()
		} else {
			document.getElementById('form-newtarget').previousElementSibling.classList.add('show', 'error')
			document.getElementById('form-newtarget').previousElementSibling.innerText = chrome.i18n.getMessage('already_added')
			timeout_id = setTimeout(hideMsgbox, 10000)
		}
	})
}

// ————————————————————————————————————————————————————————————————————————————————
// Видалити сайт зі списку цільових сайтів
function deleteTarget(website) {
	if (confirm(chrome.i18n.getMessage('confirm_target_removal'))) {
		chrome.storage.sync.get('targets', function(data) {
			var targets = data.targets ? data.targets : []
			if (website && targets.includes(website)) {
				targets.splice(targets.indexOf(website), 1)
				// Збереження
				var jsonObj = {}
				jsonObj.targets = targets
				chrome.storage.sync.set(jsonObj, function() {
					console.log('Оновлений список цільових сайтів збережено.')
				})
				// Оновити показаний список
				showTargets()
			}
		})
	}
}

// ————————————————————————————————————————————————————————————————————————————————
// Список винятків
function showTargets() {
	chrome.storage.sync.get('targets', function(data) {
		data.targets = data.targets ? data.targets : []
		var html = ''
		data.targets.forEach(function(el, i) {
			html += '<tr><td>' + el + '</td><td class="td-delete"><i data-deletetarget="' + el + '">&times;</i></td></tr>'
		})
		document.getElementById('targets-wrapper').innerHTML = '<table class="table"><tbody>' + html + '</tbody></table>'
	})
}

// ————————————————————————————————————————————————————————————————————————————————
// СТАРТОВІ ЗАВДАННЯ
// ————————————————————————————————————————————————————————————————————————————————
// Показати списки заблокованих сайтів і правил виправлення посилань
showExceptions()
showTargets()
// Оновлювати показ при поверненні на закладку
window.onfocus = function() {
	showExceptions()
	showTargets()
	chrome.storage.local.get('status', function(data) {
		document.getElementById('status-switch').checked = !!data.status
	})
	chrome.storage.local.get('mode', function(data) {
		document.getElementById('mode').value = data.mode ? data.mode : 0
	})
}

// Дія "Додати новий"
document.getElementById('form-newexception').onsubmit = function(e) {
	e.preventDefault()
	addException()
}
document.getElementById('form-newtarget').onsubmit = function(e) {
	e.preventDefault()
	addTarget()
}

// Ховати старі сповіщення при введенні нових даних
document.getElementById('newexception').onchange = hideMsgbox
document.getElementById('newtarget').onchange = hideMsgbox

// Дії "Видалити"
document.onclick = function(e) {
	// Дія "Видалити правило"
	if (e.target.dataset.deleteexception) deleteException(e.target.dataset.deleteexception)
		// Дія "Видалити сайт"
	if (e.target.dataset.deletetarget) deleteTarget(e.target.dataset.deletetarget)
}


