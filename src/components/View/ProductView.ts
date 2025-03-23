import { Component } from "../base/Component";
import { IProduct } from "../../types";
import { IEvents } from "../base/events";
import { CDN_URL } from "../../utils/constants";

const categories = new Map([
	['софт-скил', 'card__category_soft'],
	['хард-скил', 'card__category_hard'],
	['другое', 'card__category_other'],
	['дополнительное', 'card__category_additional'],
    ['кнопка', 'card__category_button'],
]);

interface ICardActions {
    onClick: (event: MouseEvent) => void;
}

export class ProductView extends Component<IProduct> {
    protected _image: HTMLImageElement;
    protected _category: HTMLElement;
    protected _title: HTMLElement;
    protected _price: HTMLElement;
    protected _id: string;
    protected _description: HTMLElement;
    protected _cardButton: HTMLElement;
    protected _cardButtonText: string
    protected _deleteButton: HTMLElement;
    protected _index: HTMLElement
    protected element: HTMLElement;
    protected events: IEvents;
    protected cdn = CDN_URL

    constructor(container: HTMLElement, actions?: ICardActions) {
        super(container)

        this._category = this.container.querySelector('.card__category');
        this._image = this.container.querySelector('.card__image');
        this._price = this.container.querySelector('.card__price');
        this._title = this.container.querySelector('.card__title');
        this._description = this.container.querySelector('.card__text');
        this._cardButton = this.container.querySelector('.card__button');
        this._deleteButton = this.container.querySelector('.basket__item-delete');
        this._index = this.container.querySelector('.basket__item-index');

        if (actions?.onClick) {
            if (this._cardButton) {
                this._cardButton.addEventListener('click', actions.onClick);
            } else {
                container.addEventListener('click', actions.onClick);
            }
        }

    }

    set category(value: string) {
        this.setText(this._category, value)
        this.toggleClass(this._category, categories.get(value), true)
    }
    
    set title(value: string) {
        this.setText(this._title, value)
    }

    set image(value: string) {
        this.setImage(this._image, `${this.cdn}/${value}`, this.title)
    }

    set price(value: number | null) {
        if (!this._price) return;
      
        if (value == null) {
          this.setText(this._price, 'Бесценно');
          this.setText(this._cardButton, 'Нельзя купить');
          this.setDisabled(this._cardButton, true);
        } else {
          this.setText(this._price, `${value} синапсов`);
          this.setDisabled(this._cardButton, false);
        }
      }

    set id(value: string) {
        this.container.dataset.id = value;
    }

    get id(): string {
        return this.container.dataset.id || '';
    }

    set description(value: string) {
        this.setText(this._description, value);
    }

    set cardButtonText(value: string) {
        this.setText(this._cardButton, value)
    }

    set index(value: number) {
        this.setText(this._index, value)
    }
}