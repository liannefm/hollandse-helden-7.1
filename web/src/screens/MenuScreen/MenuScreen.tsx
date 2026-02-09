import { useEffect, useRef, useState } from "react";
import './MenuScreen.scss';

import logo from "../../assets/images/logos/logo.webp";

import shoppingCart from "../../assets/images/icons/shopping-cart.png";

import type { Product } from "../../types/Product.ts";
import type { Category } from "../../types/Category.ts";

import type { ScrollPosition } from "../../types/ScrollStore.ts";
import type { OrderData } from "../../types/Order.ts";

type Props = {
    orderData: OrderData,
    categories: Category[],
    products: Product[],
    saveScroll: (page: string, key: string, value: ScrollPosition) => void,
    getScroll: (page: string, key: string) => ScrollPosition,
    onSelectProduct: (product: Product) => void,
    activeCategory: number | null,
    setActiveCategory: (id: number) => void,
    onOrderSummary: () => void
}

export default function MenuScreen({ orderData, categories, products, saveScroll, getScroll, onSelectProduct, activeCategory, setActiveCategory, onOrderSummary }: Props) {
    const productsRef = useRef<HTMLDivElement>(null);
    const categoriesRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const productsScroll = getScroll("menu", "products");
        const categoriesScroll = getScroll("menu", "categories");

        if (productsRef.current) {
            productsRef.current.scrollTop = productsScroll.y;
            productsRef.current.scrollLeft = productsScroll.x;
        }

        if (categoriesRef.current) {
            categoriesRef.current.scrollLeft = categoriesScroll.x;
        }
    }, []);

    const saveAllScrolls = () => {
        if (productsRef.current) {
            saveScroll("menu", "products", {
                x: productsRef.current.scrollLeft,
                y: productsRef.current.scrollTop
            });
        }
        if (categoriesRef.current) {
            saveScroll("menu", "categories", {
                x: categoriesRef.current.scrollLeft,
                y: categoriesRef.current.scrollTop
            });
        }
    };

    const [hasScrollbar, setHasScrollbar] = useState(false);

    useEffect(() => {
        if (productsRef.current) {
            const scrollHeight = productsRef.current.scrollHeight;
            const clientHeight = productsRef.current.clientHeight;
            setHasScrollbar(scrollHeight > clientHeight);
        }
    }, [products, activeCategory]);

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

                <div className="categories" ref={categoriesRef}>
                    <div className="room"></div>
                    {categories.map((category) => (
                        <button
                            key={category.category_id}
                            className={category.category_id === activeCategory ? "active" : ""}
                            onClick={() => setActiveCategory(category.category_id)}
                        >
                            {category.name}
                        </button>
                    ))}
                    <div className="room"></div>
                </div>
            </header>
            <hr />
            <main>
                <div className={`products ${hasScrollbar ? "has-scrollbar" : ""}`} ref={productsRef}>
                    {products.filter((product) => product.category_id === activeCategory).map((product) => (
                        <div
                            key={product.product_id}
                            className="product"
                            onClick={() => {
                                saveAllScrolls();
                                onSelectProduct(product);
                            }}
                        >
                            <img src={`/images/products/${product.image}`} alt={product.name} />
                            <div key={product.product_id} className="info">
                                <p className='name'>{product.name}</p>
                                <p className='price-kcal'>&euro;<span>{product.price.toFixed(2)}</span> &middot; <span>{product.kcal}</span>kcal</p>
                            </div>
                            {product.diet_type ? <p className="filter">{product.diet_type}</p> : null}
                            <button className="add-button" />
                        </div>
                    ))}
                </div>
            </main>

            <footer>
                <img src={shoppingCart} alt="Shopping Cart" />
                <p><span>{orderData.totalItems}</span> items &middot; &euro;<span>{orderData.totalPrice.toFixed(2)}</span></p>
                <button onClick={onOrderSummary}>View my order <span>&gt;</span></button>
            </footer>
        </div>
    );
}