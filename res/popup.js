// popup.html також використовує common.js

// ————————————————————————————————————————————————————————————————————————————————
// ————————————————————————————————————————————————————————————————————————————————
// Додати чинний вебсайт у список винятків
function includeException() {
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		var url = new URL(tabs[0].url)

		chrome.storage.sync.get('exceptions', function(data) {
			var exceptions = data.exceptions ? data.exceptions : []
			if (!exceptions.includes(url.hostname)) {
				exceptions.push(url.hostname)
				// Запис у сховище
				var jsonObj = {}
				jsonObj.exceptions = exceptions
				chrome.storage.sync.set(jsonObj, function() {
					console.log('Новий елемент збережено.')
				})
				// Оновлення інтерфейсу
				document.getElementById('exception-include').style.display = 'none'
				document.getElementById('exception-exclude').style.display = 'block'
			}
		})
	})	
}

// ————————————————————————————————————————————————————————————————————————————————
// ————————————————————————————————————————————————————————————————————————————————
// Видалити чинний вебсайт зі списку винятків
function excludeException() {
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		var url = new URL(tabs[0].url)

		chrome.storage.sync.get('exceptions', function(data) {
			var exceptions = data.exceptions ? data.exceptions : []
			if (exceptions.includes(url.hostname)) {
				exceptions.splice(exceptions.indexOf(url.hostname), 1)
				// Запис у сховище
				var jsonObj = {}
				jsonObj.exceptions = exceptions
				chrome.storage.sync.set(jsonObj, function() {
					console.log('Оновлений список збережено.')
				})
				// Оновлення інтерфейсу
				document.getElementById('exception-exclude').style.display = 'none'
				document.getElementById('exception-include').style.display = 'block'
			}
		})
	})	
}


// ————————————————————————————————————————————————————————————————————————————————
// ————————————————————————————————————————————————————————————————————————————————
// Додати чинний вебсайт у цільовий список
function includeTarget() {
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		var url = new URL(tabs[0].url)

		chrome.storage.sync.get('targets', function(data) {
			var targets = data.targets ? data.targets : []
			if (!targets.includes(url.hostname)) {
				targets.push(url.hostname)
				// Запис у сховище
				var jsonObj = {}
				jsonObj.targets = targets
				chrome.storage.sync.set(jsonObj, function() {
					console.log('Новий елемент збережено.')
				})
				// Оновлення інтерфейсу
				document.getElementById('target-include').style.display = 'none'
				document.getElementById('target-exclude').style.display = 'block'
			}
		})
	})	
}

// ————————————————————————————————————————————————————————————————————————————————
// ————————————————————————————————————————————————————————————————————————————————
// Видалити чинний вебсайт із цільового списку
function excludeTarget() {
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		var url = new URL(tabs[0].url)

		chrome.storage.sync.get('targets', function(data) {
			var targets = data.targets ? data.targets : []
			if (targets.includes(url.hostname)) {
				targets.splice(targets.indexOf(url.hostname), 1)
				// Запис у сховище
				var jsonObj = {}
				jsonObj.targets = targets
				chrome.storage.sync.set(jsonObj, function() {
					console.log('Оновлений список збережено.')
				})
				// Оновлення інтерфейсу
				document.getElementById('target-exclude').style.display = 'none'
				document.getElementById('target-include').style.display = 'block'
			}
		})
	})	
}


// ————————————————————————————————————————————————————————————————————————————————
// ————————————————————————————————————————————————————————————————————————————————
// Яку з кнопок "Додати цей вебсайт у список винятків" і "Видалити його звідти" показувати
chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
	var url = new URL(tabs[0].url)

	chrome.storage.sync.get('exceptions', function(data) {
		var exceptions = data.exceptions ? data.exceptions : []
		if (exceptions.includes(url.hostname)) {
			document.getElementById('exception-exclude').style.display = 'block'
		} else {
			document.getElementById('exception-include').style.display = 'block'
		}
	})

	// І так само для цільових сайтів
	chrome.storage.sync.get('targets', function(data) {
		var targets = data.targets ? data.targets : []
		if (targets.includes(url.hostname)) {
			document.getElementById('target-exclude').style.display = 'block'
		} else {
			document.getElementById('target-include').style.display = 'block'
		}
	})
})


// ————————————————————————————————————————————————————————————————————————————————
// ————————————————————————————————————————————————————————————————————————————————
// Зміна статусу активності
document.getElementById('status-switch').addEventListener('change', () => {
	document.getElementById('page-refresh-wrapper').style.display = 'block'
})

// Перезавантаження сторінки
document.getElementById('page-refresh').addEventListener('click', () => {
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		chrome.tabs.executeScript(
			tabs[0].id,
			{code: 'location.reload()'}
		)
	})
	window.close()

	// Рядок із AddBlock Plus
	// browser.tabs.reload(tab.id).then(window.close)
})

// Дії кнопок "Додати цей вебсайт у список винятків" і "Видалити його звідти"
document.getElementById('exception-include').addEventListener('click', includeException)
document.getElementById('exception-exclude').addEventListener('click', excludeException)
document.getElementById('target-include').addEventListener('click', includeTarget)
document.getElementById('target-exclude').addEventListener('click', excludeTarget)

