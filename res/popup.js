// popup.html також використовує common.js

// ————————————————————————————————————————————————————————————————————————————————
// ————————————————————————————————————————————————————————————————————————————————
// Додати чинний вебсайт у список винятків
function include() {
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
function exclude() {
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
					console.log('Новий елемент збережено.')
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
document.getElementById('exception-include').addEventListener('click', include)
document.getElementById('exception-exclude').addEventListener('click', exclude)

