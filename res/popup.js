// popup.html також використовує common.js

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
