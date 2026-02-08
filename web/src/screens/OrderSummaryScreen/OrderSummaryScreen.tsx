import './OrderSummaryScreen.scss';

import background from '../../assets/images/background.png';
import shoppingCart from "../../assets/images/icons/shopping-cart.png";

type Props = {
    onContinueOrdering: () => void,
    onCompleteOrder: () => void
}

export default function OrderSummaryScreen({ onContinueOrdering, onCompleteOrder }: Props) {
    return (
        <div className='order-summary-screen'>
            <header>
                <img src={shoppingCart} />

                <h1>Order summary</h1>
            </header>

            <main>
                <img className='background' src={background} />

                <div className="products">
                    <div className="product">
                        <img src="/images/products/1.png" />
                        <div className="quantity-and-remove">
                            <div className="quantity">
                                <button className="subtract-button" />
                                <p>1</p>
                                <button className="add-button" />
                            </div>

                            <button id="removeitem">Remove item</button>
                        </div>
                        <div className="price-and-calories">
                            <p>€7.50</p>
                            <p>320 kcal</p>
                        </div>
                    </div>
                </div>


            </main>

            <footer>
                <div className='box1footer'>
                    <h2>total</h2>
                    <h2>€22.30  ·  1040kcal</h2>
                </div>

                <div className='box2footer'>
                    <button className="continue" onClick={onContinueOrdering}>Continue ordering</button>
                    <button className="complete" onClick={onCompleteOrder}>Complete order</button>
                </div>
            </footer>
        </div>
    );
}