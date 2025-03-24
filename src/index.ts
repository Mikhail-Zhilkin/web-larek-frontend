import { EventEmitter } from './components/base/events';
import { BasketModel } from './components/Model/BasketModel';
import { OrderModel } from './components/Model/OrderModel';
import { ProductModel } from './components/Model/ProductModel';
import { BasketView } from './components/View/BasketView';
import { ContactsView } from './components/View/ContactsView';
import { ModalView } from './components/View/ModalView';
import { OrderView } from './components/View/OrderView';
import { PageView } from './components/View/PageView';
import { ProductView } from './components/View/ProductView';
import { SuccessView } from './components/View/SuccessView';
import { WebLarekAPI } from './components/WebLarekApi';
import './scss/styles.scss';
import { TBasketItem, IProduct, IOrder, TOrderForm } from './types';
import { API_URL} from './utils/constants';
import { cloneTemplate} from './utils/utils';

const events = new EventEmitter();
const api = new WebLarekAPI(API_URL);
const productModel = new ProductModel(events);
const basketModel = new BasketModel(events);
const orderModel = new OrderModel(events);

const cardGalleryTemplate: HTMLTemplateElement = document.querySelector('#card-catalog');
const cardPreviewTemplate: HTMLTemplateElement = document.querySelector('#card-preview');
const basketTemplate: HTMLTemplateElement = document.querySelector('#basket');
const cardBasketTemplate: HTMLTemplateElement = document.querySelector('#card-basket');
const orderTemplate: HTMLTemplateElement = document.querySelector('#order');
const contactsTemplate: HTMLTemplateElement = document.querySelector('#contacts');
const successTemplate: HTMLTemplateElement = document.querySelector('#success');

const page = new PageView(document.body, events);
const modal = new ModalView(document.querySelector('#modal-container'), events);
const basket = new BasketView(cloneTemplate(basketTemplate), events);
const order = new OrderView(cloneTemplate(orderTemplate), events);
const contacts = new ContactsView(cloneTemplate(contactsTemplate), events);

api.getProducts()
    .then((products) => productModel.setProducts(products))
    .catch((err) => console.log(err))

events.on('products:changed', () => {
    const cardsArray = productModel.products.map((card) => {
        const cardInstant = new ProductView(cloneTemplate(cardGalleryTemplate), {
            onClick: () => {events.emit('product:selected', card)}
        });
        return cardInstant.render(card);
    });

    page.render({gallery: cardsArray});
});

events.on('product:selected', (product: IProduct) => {
    productModel.setPreview(product);
});

events.on('preview:changed', (product: IProduct) => {
    const cardInstant = new ProductView(cloneTemplate(cardPreviewTemplate), {
        onClick: () => {
            events.emit('preview:changed', product);
            events.emit('product:addToBasket', product);
            modal.close();
    }
});

    modal.render({content: cardInstant.render({...product, cardButtonText: basketModel.getButtonText(product)})})

});

events.on('product:addToBasket', (product: TBasketItem) => {
    basketModel.addProduct(product);
});

events.on('basket:open', () => {
    modal.render({content: basket.render()});
});

events.on('modal:open', () => {
    page.locked = true;
});

events.on('modal:close', () => {
    page.locked = false;
});

events.on('basket:changed', () => {
    basket.total = basketModel.getTotalPrice();
    page.counter = basketModel.getBusketItems();
    basket.items = basketModel.products.map((product, index) => {
        const cardBasket = new ProductView(cloneTemplate(cardBasketTemplate), {
            onClick: () => basketModel.deleteProduct(product)
        })
        cardBasket.index = index + 1;
        return  cardBasket.render({title: product.title, price: product.price, id: product.id })
    });
});

events.on('order:open', () => {
    modal.render({content: order.render({
        payment: orderModel.order.payment,
        address: orderModel.order.address,
        valid: orderModel.order.payment && orderModel.order.address ? true : false,
        errors: []
    })});
});

events.on(/^order\..*:changed/, (data: {field: keyof TOrderForm, value: string}) => {
    orderModel.setOrderField(data.field, data.value)
})

events.on('formErrors:changed', (errors: Partial<TOrderForm>) => {
    const {payment, address, email, phone} = errors;
    order.valid = !payment && !address;
    order.errors = Object.values({payment, address}).filter(i => !!i).join('; ');
    contacts.valid = !email && !phone;
    contacts.errors = Object.values({email, phone}).filter(i => !!i).join('; ');
});

events.on('order:submit', () => {
    modal.render({content: contacts.render({
        phone: orderModel.order.phone,
        email: orderModel.order.email,
        valid: orderModel.validatedOrder(),
        errors: []
    })})
})

events.on('contacts:submit', () => {
    const items = basketModel.products.map(item => item.id);
    const total = basketModel.getTotalPrice();

    if(orderModel.validatedOrder()) {
        const orderToPost = orderModel.createOrderToPost(items, total)
    
        api.orderProducts(orderToPost)
            .then((res) => {
                const success = new SuccessView(cloneTemplate(successTemplate), {
                    onClick: () => {
                        modal.close()
                    }
                })

                modal.render({content: success.render({total: res.total})})

                basketModel.clearBusket();
                orderModel.clearOrder();
                order.resetPayment();
            })
            .catch((err) => console.log(err))
    };
});

