import './OrderSummaryScreen.scss';

import background from '../../assets/images/background.png';
import shoppingCart from "../../assets/images/icons/shopping-cart.png";

type Props = {
    orderData: OrderData,
    products: Product[],
    onRemoveFromOrder: (productId: number) => void,
    onIncreaseFromCart: (productId: number) => void,
    onDecreaseFromCart: (productId: number) => void,
    onContinueOrdering: () => void,
    onCompleteOrder: () => void
}

export default function OrderSummaryScreen({ orderData, products, onRemoveFromOrder, onIncreaseFromCart, onDecreaseFromCart, onContinueOrdering, onCompleteOrder }: Props) {
    return (
        <div className='order-summary-screen'>
            <header>
                <img src={shoppingCart} />

                <h1>Order summary</h1>
            </header>

            <main>
                <img className='background' src={background} />

                <div className="products">
                    {Object.entries(orderData.cart).map(([productId, quantity]) => {
                        const product = products.find(p => p.product_id === parseInt(productId));
                        if (!product) return null;
                        return (
                            <div className="product">
                                <img src={`/images/products/${product.image}`} />
                                <div className="quantity-and-remove">
                                    <div className="quantity">
                                        <button className="subtract-button" onClick={() => onDecreaseFromCart(product.product_id)} />
                                        <p>{quantity}</p>
                                        <button className="add-button" onClick={() => onIncreaseFromCart(product.product_id)} />
                                    </div>

                                    <button id="removeitem" onClick={() => onRemoveFromOrder(product.product_id)}>Remove item</button>
                                </div>
                                <div className="price-and-calories">
                                    <p>€{product.price.toFixed(2)}</p>
                                    <p>{product.kcal} kcal</p>
                                </div>
                            </div>
                        );
                    })}
                </div>


            </main>

            <footer>
                <div className='box1footer'>
                    <h2>total</h2>
                    <h2>€{orderData.totalPrice.toFixed(2)}  ·  {orderData.totalKcal} kcal</h2>
                </div>

                <div className='box2footer'>
                    <button className="continue" onClick={onContinueOrdering}>Continue ordering</button>
                    <button className="complete" onClick={onCompleteOrder}>Complete order</button>
                </div>
            </footer>
        </div>
    );
}