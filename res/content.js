(function() {
	'use strict';

	const MINLENGTH = 20

	var replacements = 0

	// ————————————————————————————————————————————————————————————————————————————————
	// ————————————————————————————————————————————————————————————————————————————————
	// Language detector
	// https://developer.chrome.com/extensions/i18n
	function isThisTextRu(text) {
		chrome.i18n.detectLanguage(text, function(result) {
			if (result.isReliable && result.languages[0].language === 'ru' && result.languages[0].percentage > 40) {
				return true
			}
		})
	}

	// ————————————————————————————————————————————————————————————————————————————————
	// ВИПРАВЛЕННЯ КОНТЕНТУ
	// ————————————————————————————————————————————————————————————————————————————————

	// Усунення неприйнятномовних блоків
	function hide() {
		Array.from(document.querySelectorAll('a, span:not(.blockingnotice), p, blockquote')).forEach((el) => {
			if (el.innerText.length >= MINLENGTH) {
				chrome.i18n.detectLanguage(el.innerText, function(result) {
					if (
						(result.isReliable && result.languages[0].language === 'ru' && result.languages[0].percentage > 40)
						|| 
						(!result.isReliable && result.languages.length && result.languages[0].language === 'ru' && result.languages[0].percentage > 90)
					) {
						var html = el.innerHTML
						el.setAttribute('data-blockedhtml', html)
						el.innerHTML = '<span class="blockingnotice">[Усунено]</span>'

						replacements++
					}
				})
			}
		})
	}


	// ————————————————————————————————————————————————————————————————————————————————
	// ПОЧАТКОВА ПОСЛІДОВНІСТЬ ДІЙ
	// ————————————————————————————————————————————————————————————————————————————————
	chrome.storage.local.get('status', function(data) {
		if (!!data.status) {
			// Усунення неприйнятномовних блоків
			hide()
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
