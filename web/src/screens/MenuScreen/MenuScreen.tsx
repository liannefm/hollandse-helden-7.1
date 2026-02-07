import './MenuScreen.scss';

import logo from "../../assets/images/logos/logo.webp";

import shoppingCart from "../../assets/images/icons/shopping-cart.png";

import type { Product } from "../../types/Product.ts";
import type { Category } from "../../types/Category.ts";

export default function MenuScreen({ categories, products }: { categories: Category[], products: Product[] }) {
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
                    <div className="room"></div>
                    {categories.map((category, index) => (
                        <button key={category.category_id} className={index === 0 ? "active" : ""}>{category.name}</button>
                    ))}
                    <div className="room"></div>
                </div>
            </header>
            <hr />
            <main>
                <div className="products">
                    {products.map((product) => (
                        <div className="product">
                            <img src={`/images/products/${product.image}`} alt={product.image_description} />
                            <div className="info">
                                <p className='name'>{product.name}</p>
                                <p className='price-kcal'>&euro;<span>{product.price.toFixed(2)}</span> &middot; <span>{product.kcal}</span>kcal</p>
                            </div>
                            <button className="add-button" />
                        </div>
                    ))}
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