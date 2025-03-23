import { Component } from "../base/Component";

interface ISuccess {
    total: number;
}

interface ISuccessActions {
    onClick: () => void;
}

export class SuccessView extends Component<ISuccess> {
    protected _buttonClose: HTMLElement;
	protected _total: HTMLElement;

    constructor(container: HTMLElement, actions?: ISuccessActions) {
        super(container);

        this._buttonClose = this.container.querySelector('.order-success__close');
        this._total = this.container.querySelector('.order-success__description');

        if(actions.onClick) {
            this._buttonClose.addEventListener('click', actions.onClick)
        }
    }

    set total(value: number) {
        this.setText(this._total, `Списано ${value} синапсов`)
    }
}