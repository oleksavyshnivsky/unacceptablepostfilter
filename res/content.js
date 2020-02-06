(function() {
	'use strict';

	const MINLENGTH = 20		// Мінімальна довжина текстівки для перевірки
	const MINPERCENTAGET = 90	// Мінімальний відсоток для блокування, якщо isReliable = true
	const MINPERCENTAGEF = 40	// Мінімальний відсоток для блокування, якщо isReliable = false

	// Які елементи потрібно перевіряти 
	//		без "a" — аби розуміти, куди ведуть посилання
	//		без "div" — надто загальне використання
	const SELECTORS = 'h1, h2, h3, h4, h5, h6, span, p, blockquote, td, li'

	// Позначка "[Усунено]"
	const BLOCKINGNOTICE = '<i class="blockingnotice">['+chrome.i18n.getMessage('blocked')+']</i>'
	

	var replacements = 0	// Кількість замін на сторінці

	// ————————————————————————————————————————————————————————————————————————————————
	// ВИПРАВЛЕННЯ КОНТЕНТУ
	// ————————————————————————————————————————————————————————————————————————————————

	// Усунення неприйнятномовних блоків
	function blockAll() {
		Array.from(document.querySelectorAll(SELECTORS)).forEach((el) => {
			if (el.innerText.length >= MINLENGTH) {
				// https://developer.chrome.com/extensions/i18n
				chrome.i18n.detectLanguage(el.innerText, function(result) {
					if (
						(result.isReliable && result.languages[0].language === 'ru' && result.languages[0].percentage >= MINPERCENTAGEF)
						|| 
						(!result.isReliable && result.languages.length && result.languages[0].language === 'ru' && result.languages[0].percentage >= MINPERCENTAGET)
					) {
						var html = el.innerHTML
						el.setAttribute('data-blockedhtml', html)
						el.innerHTML = BLOCKINGNOTICE

						replacements++
					}
				})
			}
		})
	}

	// Показ заблокованої текстівки
	function unblock(el) {
		el.innerHTML = '<a href="javascript:void(0)" class="blockagain">['
			+ chrome.i18n.getMessage('blockagain') + ']</a> '
			+ el.dataset.blockedhtml

		replacements--
	}

	// Повторне блокування текстівки
	function block(el) {
		el.innerHTML = BLOCKINGNOTICE

		replacements++
	}


	// ————————————————————————————————————————————————————————————————————————————————
	// ПОЧАТКОВА ПОСЛІДОВНІСТЬ ДІЙ
	// ————————————————————————————————————————————————————————————————————————————————
	// Якщо (Статус = Увімкнено) і (Цей вебсайт відсутній у списку винятків)
	chrome.storage.local.get('status', function(data) {
		if (!!data.status) { 
			chrome.storage.sync.get('exceptions', function(data) {
				if (!data.exceptions.includes(location.hostname)) {
					// Усунення неприйнятномовних блоків
					blockAll()

					// Розблокування окремих блоків
					document.ondblclick = function(e) {
						if (e.target.classList.contains('blockingnotice')) unblock(e.target.parentElement)
					}

					// Повторне блокування окремих блоків
					document.onclick = function(e) {
						if (e.target.classList.contains('blockagain')) block(e.target.parentElement)
					}
				}
			})
		}
	})	

	// ————————————————————————————————————————————————————————————————————————————————
	// ДОПОМІЖНІ ФУНКЦІЇ
	// ————————————————————————————————————————————————————————————————————————————————

})()
