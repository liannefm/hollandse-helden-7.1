import { useState } from 'react';
import './ProductDetailScreen.scss';

import logo from "../../assets/images/logos/logo.webp";

import background from "../../assets/images/background.png";

import type { Product } from "../../types/Product.ts";
import AddToCartAnimation from './AddToCartAnimation.tsx';

export default function ProductDetailScreen({ product, onCancel, onAddToOrder }: { product: Product, onCancel: () => void, onAddToOrder: () => void }) {
    const [showAnimation, setShowAnimation] = useState(false);

    const handleAddToOrder = () => {
        setShowAnimation(true);
    };

    const handleAnimationComplete = () => {
        setShowAnimation(false);
        onAddToOrder();
    };

    return (
        <div className="product-detail-screen">
            <header>
                <img src={logo} alt="Logo" />

                <button className="question-button">?</button>
            </header>
            <main>
                <img className="background" src={background} alt="Background" />

                <div className="top-info">
                    <p>&euro;<span>{product.price.toFixed(2)}</span> &middot; <span>{product.kcal}</span>kcal</p>
                    <p className="name">{product.name}</p>
                    <p className="filter">VG</p>
                </div>

                <div className="bottom-info">
                    <img src={`/images/products/${product.image}`} alt={product.image_description} />
                    <p>{product.description}</p>
                </div>
            </main>
            <footer>
                <div className="quantity">
                    <button className="subtract-button" />
                    <p>1</p>
                    <button className="add-button" />
                </div>
                <div className="buttons">
                    <button className="cancel-button" onClick={onCancel}>Cancel</button>
                    <button className="add-to-order-button" onClick={handleAddToOrder}>Add to order</button>
                </div>
            </footer>
            <AddToCartAnimation
                isVisible={showAnimation}
                onAnimationComplete={handleAnimationComplete}
                productImage={`/images/products/${product.image}`}
            />
        </div>
    );
}