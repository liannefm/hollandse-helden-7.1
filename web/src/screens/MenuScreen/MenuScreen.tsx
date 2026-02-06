import './MenuScreen.scss';

import logo from "../../assets/images/logos/logo.webp";

import shoppingCart from "../../assets/images/icons/shopping-cart.png";

import template1 from "../../assets/images/products/template-1.png";
import template2 from "../../assets/images/products/template-2.png";
import template3 from "../../assets/images/products/template-3.png";
import template4 from "../../assets/images/products/template-4.png";

export default function MenuScreen() {
    return (
        <div className="menu-screen">
            <header>
                <div className="top">
                    <img src={logo} alt="Logo" width="440" height="440" />
                    <div className="filters">
                        <p>Choose a category</p>
                        <div className="filter-buttons">
                            <button>All</button>
                            <button>V</button>
                            <button>VG</button>
                        </div>
                    </div>

                    <button className="question-button">?</button>
                </div>

                <div className="categories">
                    <button className="active">Breakfast</button>
                    <button>Lunch & Dinner</button>
                    <button>Handhelds</button>
                </div>
            </header>
            <hr />
            <main>
                <div className="products">
                    <div className="product">
                        <img src={template1} alt="Product" />
                        <div className="info">
                            <p className='name'>Morning Boost Açaí Bowl</p>
                            <p className='price-kcal'>&euro;<span>7.50</span> &middot; <span>240</span>kcal</p>
                        </div>
                        <p className="filter">VG</p>
                        <button className="add-button" />
                    </div>
                    <div className="product">
                        <img src={template2} alt="Product" />
                        <div className="info">
                            <p className='name'>The Garden Breakfast Wrap</p>
                            <p className='price-kcal'>&euro;<span>6.50</span> &middot; <span>240</span>kcal</p>
                        </div>
                        <p className="filter">V</p>
                        <button className="add-button" />
                    </div>
                    <div className="product">
                        <img src={template3} alt="Product" />
                        <div className="info">
                            <p className='name'>Peanut Butter & Cacao Toast</p>
                            <p className='price-kcal'>&euro;<span>5.00</span> &middot; <span>240</span>kcal</p>
                        </div>
                        <button className="add-button" />
                    </div>
                    <div className="product">
                        <img src={template4} alt="Product" />
                        <div className="info">
                            <p className='name'>Overnight Oats: Apple Pie Style</p>
                            <p className='price-kcal'>&euro;<span>5.50</span> &middot; <span>240</span>kcal</p>
                        </div>
                        <button className="add-button" />
                    </div>
                </div>
            </main>

            <footer>
                <img src={shoppingCart} alt="Shopping Cart" />
                <p><span>0</span> items &middot; &euro;<span>0.00</span></p>
                <button>View my order <span>&gt;</span></button>
            </footer>
        </div>
    );
}