# drf-auth

Библиотека является оберткой над `communicate-api` для расширения ее функционала. `drf-auth` представляет
собой прослойку, позволяющую производить аутенфикацию пользователя по токену, в связке с `django-rest-framework` и
`django-rest-auth`.

`django-rest-auth` необязательна, главное чтобы присутсвовали эндпоинты для указанных ниже методов, но вся логика
использования основывается на данной библиотеке.

## Использование

### v1.1.*

#### Session
При создании объекта `drf-auth`, будет создана сессия `axios`, которая будет сохранена в поле `session` объекта
`drf-auth`. После этого `session` будет обладать всеми стандартными методами предоставляемыми объектом `axios`.

#### Login
Метод `login`используется для входа пользователя. Это асинхронная функция, которая на вход принимает два
аргумента: `username` и `password`. В случае успешного запроса, фукнция установит заголовок с токеном и сохранит его
в `localStorage`, и возвращает объект с токеном. В случае неудачи будет вызвана ошибка.

Метод `login` делает `post` запрос по урлу `<baseURL>/<authPath>/login/`;

#### Logout
Метод `logout` используется для выхода пользователя. Это асинхронная функция без аргументов. В случае успешного запроса
возвращает объект с ответом сервера. В случае неудачи будет вызвана ошибка. Вне зависимости от ответа сервера удаляет
токены из заголовков и из `localStorage`.

Метод `logout` делает `post` запрос по урлу `<baseURL>/<authPath>/logout/`;

#### Password
Поле `password` содержащее объект класса `Password` для работы с паролем пользователя

#### password.reset

Метод `reset` производит сброс пароля по указанному `email`. Принимает один аргумент - `email`.
В случае успеха возвращает сообщение сервера, в случае провала вызывается ошибка.

Метод `reset` делает `post` запрос по урлу `<baseURL>/<authPath>/password/reset/`;

#### password.change

Метод `change` производит смену пароля. Для смена пароля пользователь должен быть аутенфицирован. Метод принимает
два аргумента, новый пароль и подтверждение нового пароля. В случае успеха возвращает сообщение сервера,
в случае провала вызывается ошибка.

Метод `change` делает `post` запрос по урлу `<baseURL>/<authPath>/password/change/`;

#### password.confirm

Метод `confirm` используется для установки нового пароля для аккуанта, который произвел сбро пароля по почте.
Метод принимает четыре аргумента: uid, token, новый пароль и подтверждение нового пароля. Uid и token должны быть
отправлены на почту по которой был произведен сброс ([docs](https://django-rest-auth.readthedocs.io/en/latest/api_endpoints.html)).
В случае успеха возвращается ответ сервера, в случае провала вызывается ошибка.

Метод `confirm` делает `post` запрос по урлу `<baseURL>/<authPath>/password/reset/confirm/`;

#### Настройка объекта `drf-auth`

Для передачи настроек для `axios`, при создании объекта `drf-auth` в конструктор класса необходимо
передать объект со свойством `axiosConfig`, которое содержит настройки для сессии `axios`. Список настроек можно
посмотреть в документации `axios`.

Для определения `authPath` на которым располагаются методы для `login`, `logout` и т.д., необходмо передать в конструктор
класса объект со свойством `authPath`, со значением пути по которому будут обращаться методы. По умолчанию используется
значение `rest-auth`.

Пример: url запроса для метода `login` будет иметь вид `<authPath>/login/`.
