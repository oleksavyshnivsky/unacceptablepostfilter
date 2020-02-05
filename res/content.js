(function() {
	'use strict';
	// Користувацькі дані
	// let blockedwebsites = []
	// let linkrules = []
	// chrome.storage.sync.get('blockedwebsites', function(data) {
	// 	blockedwebsites = data.blockedwebsites
	// })
	// chrome.storage.sync.get('linkrules', function(data) {
	// 	linkrules = data.linkrules
	// })
	var replacements = 0

	// ————————————————————————————————————————————————————————————————————————————————
	// ————————————————————————————————————————————————————————————————————————————————
	// Language detector
	// https://en.wikipedia.org/wiki/Wikipedia:Language_recognition_chart
	// http://www.pravapis.org/art_letter_frequency.asp
	// https://www.sttmedia.com/characterfrequency-russian
	function isThisTextRu(text) {
		var L = text.length
		var a = (text.match(/а|А/g)||[]).length
		var r = (text.match(/ы|Ы|э|Э|ъ|Ъ|ё|Ё/g)||[]).length
		return (r/L > 0.01 && a/L < 0.1)

		// return (
		// 	text.includes('ы')
		// 	|| text.includes('Ы')
		// 	|| text.includes('э')
		// 	|| text.includes('Э')
		// 	|| text.includes('ъ')
		// 	|| text.includes('Ъ')
		// )
	}

	// ————————————————————————————————————————————————————————————————————————————————
	// ВИПРАВЛЕННЯ КОНТЕНТУ
	// ————————————————————————————————————————————————————————————————————————————————

	// Виправлення посилань
	function correctLinks() {
		chrome.storage.sync.get('linkrules', function(data) {
			var linkrules = data.linkrules ? data.linkrules : []
			var regexes = []
			linkrules.forEach((rule) => {regexes.push(new RegExp(rule[0], 'gi'))})
			Array.from(document.getElementsByClassName('g')).forEach((el) => {
				// el.innerHTML = el.innerHTML.replace(/\/ru\//gi, '/en/')
				regexes.some((regex, i) => {
					if (regex.test(el.innerHTML)) {
						el.innerHTML = el.innerHTML.replace(regex, linkrules[i][1])
						replacements++
						return true
					}
				})
			})
		})
	}

	// ————————————————————————————————————————————————————————————————————————————————
	// Усунення заголовків
	function hideRuTitles() {
		Array.from(document.getElementsByTagName('h3')).forEach((el) => {
			if (isThisTextRu(el.innerText)) {
				var html = el.innerHTML
				el.setAttribute('data-blockedhtml', html)
				el.innerHTML = el.closest('a').href

				replacements++
			}
		})
	}

	// Усунення описів
	function hideRuDescriptions() {
		Array.from(document.getElementsByClassName('s')).forEach((el) => {
			if (isThisTextRu(el.innerText)) {
				var html = el.innerHTML
				el.setAttribute('data-blockedhtml', html)
				el.innerHTML = '<span class="ode-blocked">[Усунено]</span>'

				replacements++
			}
		})
	}

	// ————————————————————————————————————————————————————————————————————————————————
	// Усунення результатів із заблокованих сайтів

	// Варіант 1. Чітка відповідність
	function _hideBlockedWebsites() {
		chrome.storage.sync.get('blockedwebsites', function(data) {
			var blockedwebsites = data.blockedwebsites ? data.blockedwebsites : []
			var blockedN = 0
			Array.from(document.getElementsByClassName('g')).forEach((el) => {
				var url = el.getElementsByTagName('a')[0].href
				url = new URL(url)
				if (blockedwebsites.includes(url.hostname)) {
					blockedN++
					var html = el.innerHTML
					el.setAttribute('data-blockedhtml', html)
					el.innerHTML = '<span class="ode-blocked">[Усунено результат з ' + url.hostname + ']</span>'
					replacements++
				}
			})
		})
	}

	// Варіант 2. Регулярні вирази
	function hideBlockedWebsites() {
		chrome.storage.sync.get('blockedwebsites', function(data) {
			var blockedwebsites = data.blockedwebsites ? data.blockedwebsites : []
			var regexes = []
			blockedwebsites.forEach((el) => {regexes.push(new RegExp(el, 'gi'))})

			var blockedN = 0
			Array.from(document.getElementsByClassName('g')).forEach((el) => {
				var url = el.getElementsByTagName('a')[0].href
				url = new URL(url)

				for (var i = 0; i < regexes.length; i++) {
					if (regexes[i].test(url.hostname)) {
						blockedN++
						var html = el.innerHTML
						el.setAttribute('data-blockedhtml', html)
						el.innerHTML = '<span class="ode-blocked">[Усунено результат з ' + url.hostname + ']</span>'
						replacements++
						break
					}
				}
			})
		})
	}


	// ————————————————————————————————————————————————————————————————————————————————
	// ПОЧАТКОВА ПОСЛІДОВНІСТЬ ДІЙ
	// ————————————————————————————————————————————————————————————————————————————————
	chrome.storage.local.get('status', function(data) {
		if (!!data.status) {
			// Виправлення посилань
			correctLinks()
			// Усунення заголовків
			// hideRuTitles()
			// Усунення описів
			hideRuDescriptions()
			// Приховування результатів із заблокованих сайтів
			hideBlockedWebsites()
		}
	})


	// ————————————————————————————————————————————————————————————————————————————————
	// ДОПОМІЖНІ ФУНКЦІЇ
	// ————————————————————————————————————————————————————————————————————————————————

	// Найближчий батьківський елемент
	function closest (el, predicate) {
		do if (predicate(el)) return el;
		while (el = el && el.parentNode);
	}
})()
