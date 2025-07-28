import { CartItem } from "./cart-item";
import { OrderSummary } from "./order-summary";

export interface CartSummary {
    cartItems: CartItem[];
    orderSummary: OrderSummary;
}
