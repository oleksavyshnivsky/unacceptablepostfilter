// options.html також використовує common.js

// ————————————————————————————————————————————————————————————————————————————————
// ЗАБЛОКОВАНІ ВЕБСАЙТИ
// ————————————————————————————————————————————————————————————————————————————————

// Видалити сайт зі списку блокування
function unblock(website) {
	if (confirm('Ви дійсно хочете розблокувати цей сайт?')) {
		chrome.storage.sync.get('blockedwebsites', function(data) {
			blockedwebsites = data.blockedwebsites ? data.blockedwebsites : []
			if (website && blockedwebsites.includes(website)) {
				blockedwebsites.splice(blockedwebsites.indexOf(website), 1)
				// Збереження
				var jsonObj = {}
				jsonObj.blockedwebsites = blockedwebsites
				chrome.storage.sync.set(jsonObj, function() {
					console.log('Список заблокованих вебсайтів перезбережено.')
				})
				// Оновити показаний список
				showBlockedWebsites()
			}
		})
	}
}

// ————————————————————————————————————————————————————————————————————————————————
// Список заблокованих вебсайтів
function showBlockedWebsites() {
	chrome.storage.sync.get('blockedwebsites', function(data) {
		data.blockedwebsites = data.blockedwebsites ? data.blockedwebsites : []
		var html = ''
		data.blockedwebsites.forEach(function(el, i) {
			html += '<tr><td>' + el + '</td><td class="td-delete"><i data-deletesite="' + el + '">&times;</i></td></tr>'
		})
		document.getElementById('blockedwebsites-wrapper').innerHTML = '<table class="table"><tbody>' + html + '</tbody></table>'
	})
}

// ————————————————————————————————————————————————————————————————————————————————
// ПРАВИЛА ВИПРАВЛЕННЯ ПОСИЛАНЬ
// ————————————————————————————————————————————————————————————————————————————————
// Видалити сайт зі списку блокування
function removeRule(i) {
	if (confirm('Ви дійсно хочете видалити це правило?')) {
		chrome.storage.sync.get('linkrules', function(data) {
			var linkrules = data.linkrules ? data.linkrules : []
			if (linkrules[i]) {
				linkrules.splice(i, 1)
				// Збереження
				var jsonObj = {}
				jsonObj.linkrules = linkrules
				chrome.storage.sync.set(jsonObj, function() {
					console.log('Список правил перезбережено.')
				})
				// Оновити показаний список
				showLinkRules()
			}
		})
	}
}

// ————————————————————————————————————————————————————————————————————————————————
// Список заблокованих вебсайтів
function showLinkRules() {
	chrome.storage.sync.get('linkrules', function(data) {
		data.linkrules = data.linkrules ? data.linkrules : []
		var html = ''
		data.linkrules.forEach(function(el, i) {
			html += '<tr><td>'+el[0]+'</td><td>'+el[1]+'</td><td class="td-delete"><i data-deleterule="'+i+'">&times;</i></td></tr>'
		})
		document.getElementById('linkrules-wrapper').innerHTML = '<table class="table fixed"><tbody>' + html + '</tbody></table>'
	})
}

// ————————————————————————————————————————————————————————————————————————————————
// СТАРТОВІ ЗАВДАННЯ
// ————————————————————————————————————————————————————————————————————————————————
// Показати списки заблокованих сайтів і правил виправлення посилань
showBlockedWebsites()
showLinkRules()
// Оновлювати показ при поверненні на закладку
window.onfocus = function() {
	showBlockedWebsites()
	showLinkRules()
}

// Дії "Видалити"
document.onclick = function(e) {
	// Дія "Видалити правило"
	if (e.target.dataset.deleterule) removeRule(e.target.dataset.deleterule)
		// Дія "Видалити сайт"
	if (e.target.dataset.deletesite) unblock(e.target.dataset.deletesite)
}


