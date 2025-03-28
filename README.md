# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```

## Данные и типы данных, используемые в приложении

Товар

```
interface IProduct {
    id: string;
    description?: string;
    image: string;
    title: string;
    category: string;
    price: number | null;
}
```
Заказ

```
interface IOrder{
    items: string[];
    total: number;
    payment: string;
    address: string;
    email: string;
    phone: string;
    
}
```
Корзина

```
interface IBasket {
    id: string;
    title: string;
    price: number | null;
    count: number | null;
}
```

Интерфейс для модели данных товаров

```
interface IProductData {
    products: IProduct[];
    preview: string | null;
    getProduct(productId: string): IProduct;
    setProducts(products: IProduct[]): void;
    setPreview(product: IProduct): void;
}
```
Интерфейс для модели данных заказа

```
interface IOrderData {
    order: Partial<IOrder>;
    createOrderToPost(items: string[], total: number): IOrder;
    validatedOrder(): boolean;
    setOrderField(field: keyof IOrder, value: IOrder[keyof IOrder]): void;
    clearOrder(): void;
}
```
Интерфейс для модели данных корзины

```
export interface IBasketData {
    products: TBasketItem[]
    addProduct(product: TBasketItem): void;
    deleteProduct(product: TBasketItem): void;
    clearBusket(): void;
    getBusketItems(): number;
    getButtonText(product: TBasketItem): string;
    getTotalPrice(): number;
}
```

Данные о товаре, используемые в корзине

```
type IBasketItem = Pick<IProduct, 'id' | 'title' | 'price'>;
```
Данные о всей форме заказа

```
type TOrderForm = Pick<IOrder, 'payment' | 'address' | 'email' | 'phone'>
```

Данные о способе оплаты и доставки заказа

```
type TOrder = Pick<IOrder, 'payment' | 'address'>
```

Данные о контактах покупателя

```
export type TContacts = Pick<IOrder, 'email' | 'phone'>
```

## Архитектура приложения

При разработке приложения будет использован паттерн MVP. В связи с этим, код будет разделен на следующие слои:

- слой данных - отвечает за хранение и изменение данных
- слой представления - отвечает за взаимодействие с DOM-элементами и их отображение на странице
- презентер - отвечает за взаимодействие между слоем данных и слоем представления

### Базовый код

#### Класс **Api**
Класс Api предназначен для упрощения работы с HTTP-запросами к API. Он предоставляет методы для выполнения GET и POST запросов и обрабатывает ответы от сервера:

- **get()** - выполняет GET запрос по указанному URL и возвращает Promise с объектом при успешном запросе
- **post()** - принимает объект данных, который передается в теле запроса и выполняет POST запрос по переданному в параметрах URL. Метод, по умолчанию, выполняет POST запрос который можно переопределить, передав соответсвтвующий метод третьим параметром метода 

#### Класс **EventEmitter**
Брокер событий, который позволяет отправлять и подписываться на события, происходящие в системе. Класс используется в презентере для обработки событий и в слоях приложения для генерации событый. Основные методы класса, описанные интерфейсом "IEvents":

- **on()** - подписка на событие
- **emit()** - инициализация события 
- **trigger()** - возвращает функцию, при вызове которой инициализируется требуемое событие

#### Класс **Component<Т>**
Класс Component<Т> является абстрактным базовым компонентом, предназначенным для работы с DOM в приложении. Он предоставляет набор методов и инструментов, которые могут быть использованы в дочерних классах для управления элементами интерфейса. Основные цели данного класса:
- **Инкапсуляция логики работы с DOM**: Класс предоставляет методы для манипуляции с элементами DOM, такие как переключение классов, установка текста, управление состоянием блокировки, скрытие и показ элементов, а также установка изображений
- **Упрощение работы с элементами**
- **Поддержка наследования**: Как абстрактный класс, Component<Т> может быть расширен другими классами, которые будут наследовать его методы и свойства
-  **Работа с данными**: Метод render позволяет обновить состояние компонента, присваивая ему новые данные через объект data, и возвращает корневой DOM-элемент компонента
- **Управление состоянием видимости**

Методы класса для реализации перечисленных целей:
- **toggleClass()**
- **setText()**
- **setDisabled()**
- **setHidden()**
- **setVisible()**
- **setImage()**

### Слой данных

#### Класс **ProductModel**
Класс отвечает за хранение и логику работы с данными товаров. Конструктор класса принимает инстант брокера событий.\
В полях класса хранятся следующие данные:
- **_products: IProduct[]** - массив объектов товаров
- **_preview: string | null** - id товара, выбранного для просмотра в модальном окне
- **events: IEvents** - экземпляр класса `EventEmitter` для инициации событий при изменении данных.

Методы класса:
- **getProduct(productId: string): IProduct** - возвращает товар по его id
- **setProducts(products: IProduct[]): void** - заполняет массив товаров
- **setPreview(product: IProduct): void** - устанавливает статус выбранного товара
- А также **геттеры** для получения данных из полей класса

#### Класс **BasketModel**
Класс отвечает за хранение и логику работы с данными корзины.\
Конструктор класса принимает инстант брокера событий.\
В полях класса хранятся следующие данные:
- **_products: TBasketItem[] = []** - массив объектов товаров в корзине. Изначально пустой
- **events: IEvents** - экземпляр класса `EventEmitter` для инициации событий при изменении данных

Методы класса:
- **addProduct(product: TBasketItem): void** - добавляет товар в корзину
- **deleteProduct(product: TBasketItem): void** - удаляет товар из корзины
- **clearBusket(): void** - очищает корзину
- **getBusketItems(): number** - получает размер массива товаров, которые находятся в корзине
- **getButtonText(product: TBasketItem): string** - меняет статус кнопки, в зависимости от цены и от того, был ли уже добавлен товар в корзину
- **getTotalPrice(): number** - получает общую сумму товаров в корзине
- А также **геттер** для получения данных из поля класса

#### Класс **OrderModel**
Класс отвечает за хранение и логику работы с данными заказа.\
Конструктор класса принимает инстант брокера событий.\
В полях класса хранятся следующие данные:
- **_order: Partial<IOrder> = {
        payment: '',
        address: '',
        email: '',
        phone: ''
    }** - объект заказа

Методы класса:
- **createOrderToPost(items: string[], total: number): IOrder** - создает объект заказа для дальнейшей отправки его на сервер
- **validatedOrder(): boolean** - отвечает за валидацию полей формы заказа
- **setOrderField(field: keyof IOrder, value: IOrder[keyof IOrder]): void** - устанавливает значение в переданное поле формы заказа
- **clearOrder(): void** - очищает заказ
- А также **геттер** для получения данных из поля класса

### Классы представления
Все классы представления отвечают за отображение внутри контейнера (DOM-элемент) передаваемых в них данных.

#### Класс **ModalView**
Реализует модальное окно. Так же предоставляет методы **open()** и **close()** для управления отображением модального окна. Устанавливает слушатели на клик в оверлей и кнопку-крестик для закрытия попапа.  
- constructor(container: HTMLElement, protected events: IEvents ) Конструктор принимает контейнер, по которому в разметке страницы будет идентифицировано модальное окно и экземпляр класса `EventEmitter` для возможности инициации событий.

Поля класса:
- **_closeButton: HTMLButtonElement** - кнопка закрытия модального окна
- **_content: HTMLElement** - элемент контента модального окна

#### Класс **PageView**
Класс отвечает за отображение главной страницы.
- constructor(container: HTMLElement, protected events: IEvents) Конструктор принимает элемент разметки страницы и экземпляр класса `EventEmitter` для возможности инициации событий.

Поля класса:
- **_counter: HTMLElement** - элемент разметки, отвечающий за  количество товаров в корзине
- **_gallery: HTMLElement** - элемент разметки страницы, отвечающий за отображение списка товаров на главной странице
- **_wrapper: HTMLElement** - обертка всей контентной части сайта
- **_basket: HTMLElement** - элемент разметки, отвечающий за отображение корзины на главной странице

Методы класса:
- **set counter(value: number)** - устанавливает количество товаров в корзине
- **set gallery(items: HTMLElement[])** - выводит на страницу массив товаров
- **set locked(value: boolean)** - блокирует прокрутку страницы при открытии модальных окон

#### Класс **ProductView**
Класс отвечает за отображение товара.
- constructor(container: HTMLElement, actions?: ICardActions) Конструктор принимает необходимый элемент разметки товара и объект оброботчика событий для элементов карточки товара.\
В полях класса содержит все имеющиеся элементы разметки карточки товара.\
Имеет **сеттеры** и **геттеры** для сохранения и получения данных из полей класса

#### Класс **BasketView**
Класс отвечает за отображение корзины.
- constructor(container: HTMLElement, actions?: ICardActions) Конструктор принимает необходимый элемент разметки и объект оброботчика событий для элементов корзины.\
Поля класса содержат элементы разметки корзины.

Методы класса:
- **set items(items: HTMLElement[])** - в зависимости от наличия товаров в корзине, выводит список товаров или уведомляет покупателя, что корзина пуста
- **set total(total: number)** - отображает стоимость товаров в корзине

#### Класс **FormView<Т>**
Класс отвечает за отображение форм. Принимает generic-параметр <Т>, который определяет тип переданной формы
- constructor(protected container: HTMLFormElement, protected events: IEvents) Конструктор принимает необходимый элемент разметки и экземпляр класса `EventEmitter` для возможности инициации событий.\
Поля класса содержат элементы формы(кнопка отправки формы и элементы ошибки валидации полей формы)

Методы класса:
- **set valid(value: boolean)** - включает/выключает кнопку отправки формы, в зависимости от заполненных полей формы
- **set errors(value: string)** - устанавливает тексты ошибок валидации полей 
- **protected onInputChange(field: keyof T, value: string)** - устанавливает событие при изменении любого поля формы
- **render(state: Partial<T> & IFormState)** - обновляет состояние формы

#### Класс **OrderView**
Класс отвечает за отображение формы выбора способа оплаты и адреса доставки. 
- constructor(container: HTMLFormElement, events: IEvents) Конструктор принимает необходимый элемент разметки и экземпляр класса `EventEmitter` для возможности инициации событий.

Поля класса содержат элементы данной формы.

Методы класса:
- **set address(value: string)** - устанавливает значение в поле класса
- **resetPayment()** - сбрасывает выбранный метод оплаты после оформления заказа

#### Класс **ContactsView**
Класс отвечает за отображение формы заполнения электронной почты и номера телефона покупателя. 
- constructor(container: HTMLFormElement, events: IEvents) Конструктор принимает необходимый элемент разметки и экземпляр класса `EventEmitter` для возможности инициации событий.

Поля класса содержат элементы данной формы.\
Класс имеет **сеттеры** для сохранение данных в поля класса

#### Класс **SuccessView**
Класс отвечает за отображение модального окна успешной покупки.
- constructor(container: HTMLElement, actions?: ICardActions) Конструктор принимает необходимый элемент разметки товара и объект оброботчика событий.

Поля класса содержат все имеющиеся элементы разметки данного модального окна.\
Класс содержит **сеттер** для установки общей стоимости покупки.

### Слой коммуникации

#### Класс **WebLarekAPI**
Принимает в конструктор экземпляр класса Api и предоставляет методы реализующие взаимодействие с бэкендом сервиса.

## Взаимодействие компонентов
Код, описывающий взаимодействие представления и данных между собой находится в файле `index.ts`, выполняющем роль презентера.\
Взаимодействие осуществляется за счет событий генерируемых с помощью брокера событий и обработчиков этих событий, описанных в `index.ts`\
В `index.ts` сначала создаются экземпляры всех необходимых классов, а затем настраивается обработка событий.

*Список всех событий, которые могут генерироваться в системе:*
- `products:changed` - изменение данных товара
- `product:selected` - запись id товара для дальнейшего открытия подробной информации о товаре
- `preview:changed` - изменение отображения товара
- `product:addToBasket` - товар добавлен в корзину
- `basket:open` - открыть корзину
- `modal:open` - открыть иодальное окно
- `modal:close` - закрыть модальное окно
- `basket:changed`- изменение данных в корзине
- `order:open` - открыть модальное окно выбора способа оплаты и адреса доставки
- `order:changed` - изменение данных в модальном окне выбора способа оплаты и адреса доставки
- `formErrors:changed` - изменение валидности полей формы
- `order:submit` - отправить форму с выбором способа оплаты и адреса доставки и перейти на следующий этап
- `contacts:submit` - отправить форму с контактной информацией покупателя и перейти на следующий этап
