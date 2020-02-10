# Прибирання росмовних текстівок

## Цільова проблема

Надмірна різномовність статей, повідомлень тощо у певних місцях.

## Розв'язання

Розширення усуває російськомовні текстівки.

Правила усунення (див. content.js): 

- текстівка має бути в елементі <code>h1, h2, h3, h4, h5, h6, span, p, blockquote, td, li</code> (<code>a</code> і <code>dev</code> пропущені свідомо)
- мінімальна довжина текстівки — 20 символів
- <code>chrome.i18n.detectLanguage()</code> у списку мов на першому місці повертає <code>ru</code> (<code>result.languages[0].language === 'ru'</code>), а також виконується одна з наступних умов (надійність результату і відсоток головної мови повідомлення за версію <code>chrome.i18n.detectLanguage()</code>)
  - <code>result.isReliable === true && result.languages[0].percentage >= 40</code> 
  - <code>result.isReliable === false && result.languages[0].percentage >= 90</code>  

## Обмеження

<code>chrome.i18n.detectLanguage()</code> працює не ідеально. Подвійний клік на <code>[Усунено]</code> повертає заблокований текст.

Налаштування довжини текстівки і відсотків вибрані для аби було. 

Список елементів — які трапилися при тестуванні.


## Контакт

[Написати автору](mailto:oleksa.vyshnivsky+langfilter@gmail.com)



