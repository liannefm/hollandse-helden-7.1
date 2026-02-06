import './OrderSummaryScreen.scss';

import background from '../../assets/images/background.png';
import shoppingCart from "../../assets/images/icons/shopping-cart.png";
import template1 from "../../assets/images/products/template-1.png";

export default function OrderSummaryScreen() {
    return (
        <div className='order-summary-screen'>
            <header>
                <img src={shoppingCart} ></img>

                <h1>Order summary</h1>
            </header>

            <main>
                <img className='background' src={background} />

                <img src={template1} id="template1"></img>

                <div className='box1'>
                    <div className="quantity">
                        <button className="subtract-button" />
                        <p>1</p>
                        <button className="add-button" />
                    </div>

                    <button id="removeitem">Remove item</button>

                </div>
            </main>

            <footer>
                <div className='box1footer'>
                    <h2>total</h2>
                    <h2>€22.30  ·  1040kcal</h2>
                </div>

                <div className='box2footer'>
                    <button className="continue">Continue ordering</button>
                    <button className="complete">Complete order</button>
                </div>
            </footer>
        </div>
    );
}