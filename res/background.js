chrome.runtime.onInstalled.addListener(function() {
	// Статус:
	// 	1 — виконувати блокування
	// 	0 — ні
	chrome.storage.local.set({status: 1}, function() {
		console.log('Статус активності виставлений')
	})

	chrome.storage.sync.set({exceptwebsites: ['www.google.com']}, function() {
		console.log('Список вебсайтів-винятків записаний.')
	})

	chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
		chrome.declarativeContent.onPageChanged.addRules([{
			conditions: [
				new chrome.declarativeContent.PageStateMatcher({
					pageUrl: {hostEquals: 'www.google.com'},
				})
			],
			actions: [new chrome.declarativeContent.ShowPageAction()]
		}])
	})
})
