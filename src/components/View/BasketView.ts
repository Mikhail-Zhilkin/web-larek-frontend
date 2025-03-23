import { TBasketItem } from "../../types";
import { createElement, ensureElement, formatNumber } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/events";

export interface IBasketView {
    items: TBasketItem[];
    total: number;
}

export class BasketView extends Component<TBasketItem> {
    protected _list: HTMLElement;
    protected _total: HTMLElement;
    protected _button: HTMLElement;
    protected events: IEvents;

    constructor(container: HTMLElement, events: IEvents) {
        super(container)

        this._list = ensureElement<HTMLElement>('.basket__list', this.container);
        this._total = this.container.querySelector('.basket__price');
        this._button = this.container.querySelector('.button');

        if (this._button) {
            this._button.addEventListener('click', () => {
                events.emit('order:open');
            });
        }

        this.items = []
    }

    set items(items: HTMLElement[]) {
        if (!this._list) {
            console.error('Элемент _list не инициализирован');
            return;
        }
        if (items.length) {
            this._list.replaceChildren(...items);
            this.setDisabled(this._button, false)
        } else {
            this._list.replaceChildren(createElement<HTMLParagraphElement>('p', {
                textContent: 'Ваша корзина пуста'
            }));
            this.setDisabled(this._button, true)
        }
    }

    set total(total: number) {
        this.setText(this._total, `${formatNumber(total)} синапсов`)
    }

}