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
