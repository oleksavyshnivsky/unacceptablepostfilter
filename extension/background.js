chrome.runtime.onInstalled.addListener(function() {
	// Статус:
	// 	1 — виконувати блокування
	// 	0 — ні
	chrome.storage.local.set({status: 1}, function() {
		console.log('Статус активності записаний')
	})

	// Налаштування
	// 	mode = 0 — блокувати всюди, крім сайтів-винятків
	// 	mode = 1 — блокувати лише на цільових сайтах
	chrome.storage.local.set({mode: 0}, function() {
		console.log('Режим записаний')
	})

	chrome.storage.sync.set({exceptions: ['www.google.com']}, function() {
		console.log('Список вебсайтів-винятків записаний')
	})

	chrome.storage.sync.set({targets: []}, function() {
		console.log('Список цільових вебсайтів записаний')
	})
})

// Зміна іконки (поки не використовується. TODO: Зробити іконки для варіантів "заміну увімкнено" і "заміну вимкнено")
chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
	if (msg.action === 'updateIcon') {
		if (msg.value) { 	// Заміну вимкнено
			chrome.browserAction.setIcon({path: '/assets/mixed16.png', tabId: sender.tab.id})
		} else {			// Заміну увімкнено
			chrome.browserAction.setIcon({path: '/assets/filtered16.png', tabId: sender.tab.id})
		}
	}
})
