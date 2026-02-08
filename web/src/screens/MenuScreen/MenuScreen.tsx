import { useEffect, useRef, useState } from "react";
import './MenuScreen.scss';

import logo from "../../assets/images/logos/logo.webp";

import shoppingCart from "../../assets/images/icons/shopping-cart.png";

import type { Product } from "../../types/Product.ts";
import type { Category } from "../../types/Category.ts";

import type { ScrollPosition } from "../../types/ScrollStore.ts";

type Props = {
    categories: Category[],
    products: Product[],
    saveScroll: (page: string, key: string, value: ScrollPosition) => void,
    getScroll: (page: string, key: string) => ScrollPosition,
    onSelectProduct: (product: Product) => void,
    activeCategory: number | null,
    setActiveCategory: (id: number) => void
}

export default function MenuScreen({ categories, products, saveScroll, getScroll, onSelectProduct, activeCategory, setActiveCategory }: Props) {
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
                        <div className="product" onClick={() => {
                            saveAllScrolls();
                            onSelectProduct(product);
                        }}>
                            <img src={`/images/products/${product.image}`} alt={product.image_description} />
                            <div className="info">
                                <p className='name'>{product.name}</p>
                                <p className='price-kcal'>&euro;<span>{product.price.toFixed(2)}</span> &middot; <span>{product.kcal}</span>kcal</p>
                            </div>
                            {/* <p className="filter">VG</p> */}
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