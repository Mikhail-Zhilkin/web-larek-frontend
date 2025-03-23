export interface IProduct {
    id: string;
    description?: string;
    image: string;
    title: string;
    category: string;
    price: number | null;
    cardButtonText: string | null;
}

export interface IProductData {
    products: IProduct[];
    preview: string | null;
    getProduct(productId: string): IProduct;
    setProducts(products: IProduct[]): void;
    setPreview(product: IProduct): void;
}

export interface IOrder{
    items: string[];
    total: number;
    payment: string;
    address: string;
    email: string;
    phone: string;
    
}

export interface IOrderData {
    order: IOrder;
    // setPayment(payment: string): void;
    // setAddress(address: string): void;
    // setEmail(email: string): void;
    // setPhone(phone: string): void;
    validatedOrder(): boolean;
    setOrderField(field: keyof IOrder, value: IOrder[keyof IOrder]): void;
    clearOrder(): void;
}

export interface IBasket {
    id: string;
    title: string;
    price: number | null;
    count: number | null;
}

export interface IBasketData {
    products: TBasketItem[]
    addProduct(product: TBasketItem): void;
    deleteProduct(product: TBasketItem): void;
    clearBusket(): void;
    getBusketItems(): number;
    toggleButtonStatus(product: TBasketItem): string;
    getTotalPrice(): number;
    makeAnOrder(order: IOrderData): void;
}

export interface IValidation {
    error: string;
    isValid: boolean;  
}

export interface IOrderResult {
    id: string;
    total: number;  
}

export type TOrderForm = Pick<IOrder, 'payment' | 'address' | 'email' | 'phone'>
export type TBasketItem = Pick<IProduct, 'id' | 'title' | 'price'>;
export type TOrder = Pick<IOrder, 'payment' | 'address'>
export type TContacts = Pick<IOrder, 'email' | 'phone'>
export type TFormErrors = Partial<Record<keyof IOrder, string>>;



