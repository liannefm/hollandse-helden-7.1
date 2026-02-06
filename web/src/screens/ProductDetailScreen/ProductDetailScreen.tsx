import './ProductDetailScreen.scss';

import logo from "../../assets/images/logos/logo.webp";

import background from "../../assets/images/background.png";

import template1 from "../../assets/images/products/template-1.png";

export default function ProductDetailScreen() {
    return (
        <div className="product-detail-screen">
            <header>
                <img src={logo} alt="Logo" />

                <button className="question-button">?</button>
            </header>
            <main>
                <img className="background" src={background} alt="Background" />

                <div className="top-info">
                    <p>&euro;<span>7.50</span> &middot; <span>320</span>kcal</p>
                    <p className="name">Morning Boost Açaí Bowl</p>
                    <p className="filter">VG</p>
                </div>

                <div className="bottom-info">
                    <img src={template1} alt="Product" />
                    <p>A chilled blend of açaí and banana topped with crunchy granola, chia seeds, and coconut.</p>
                </div>
            </main>
            <footer>
                <div className="quantity">
                    <button className="subtract-button" />
                    <p>1</p>
                    <button className="add-button" />
                </div>
                <div className="buttons">
                    <button className="cancel-button">Cancel</button>
                    <button className="add-to-order-button">Add to order</button>
                </div>
            </footer>
        </div>
    );
}