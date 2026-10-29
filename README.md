# Скуфуслуги

Мемный портал спокойной жизни. Самостоятельный статический сайт на HTML, CSS и JavaScript, без сборки и серверных зависимостей.

## Запуск

Из этой папки: `python -m http.server 4173 --directory dist --bind 127.0.0.1`

Открыть http://127.0.0.1:4173. Файлы в `dist` можно разместить на любом статическом хостинге.

## Возможности

- Поиск по услугам и ключевым словам, 6 категорий, 12 услуг.
- Личный кабинет с именем и выбором округа.
- Подача мемных заявлений и просмотр истории.
- Тест из пяти вопросов и скачивание персонального удостоверения в SVG.
- Новости, вопросы и ответы, помощник Палыч.
- Адаптивная вёрстка, клавиатурная навигация и диалоги.

Данные форм хранятся только в localStorage текущего браузера. Это развлекательный проект, не связанный с государственными органами. Серверная регистрация, настоящие документы и платежи не используются.

## Иллюстрация

`dist/assets/hero-skuf.png` создана встроенным ImageGen для этого проекта. Промпт: «A polished friendly 3D clay-render cutout of a contented slightly chubby middle-aged man with a receding hairline and moustache, wearing a white tank top, navy shorts, white socks and slippers, relaxing on a warm orange sofa with a tea mug and a sleeping cat. Soft studio lighting, tactile materials, transparent background, no text or logos.»
