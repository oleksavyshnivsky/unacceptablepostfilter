chrome.runtime.onInstalled.addListener(function() {
	// Статус:
	// 	1 — виконувати блокування
	// 	0 — ні
	chrome.storage.local.set({status: 1}, function() {
		console.log('Статус активності виставлений')
	})

	chrome.storage.sync.set({exceptions: ['www.google.com']}, function() {
		console.log('Список вебсайтів-винятків записаний.')
	})
})

chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
	if (msg.action === 'updateIcon') {
		if (msg.value) {
			chrome.browserAction.setIcon({path: '/assets/mixed16.png', tabId: sender.tab.id})
		} else {
			chrome.browserAction.setIcon({path: '/assets/filtered16.png', tabId: sender.tab.id})
		}
	}
})
