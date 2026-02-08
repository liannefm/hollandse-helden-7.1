export type OrderType = "here" | "take_away";

export type Cart = Record<number, number>;

export interface OrderData {
    orderType: OrderType | null;
    cart: Cart;
    totalItems: number;
    totalPrice: number;
    totalKcal: number;
}
