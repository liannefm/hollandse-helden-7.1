import { useState, useEffect } from "react";

import './UpsellScreen.scss';

import background from "../../assets/images/background.png";
import logo from "../../assets/images/logos/logo.webp";

import type { Product } from "../../types/Product.ts";

import AddToCartAnimation from "../../components/animations/AddToCartAnimation.tsx";

type Props = {
    products: Product[],
    onAddToOrder: (productId: number, quantity: number) => void
    onSelectProduct: (product: Product) => void,
    onClickButton: () => void
}

export default function UpsellScreen({ products, onAddToOrder, onSelectProduct, onClickButton }: Props) {
    const [showAnimation, setShowAnimation] = useState(false);
    const [productImage, setProductImage] = useState("");
    const [fourProducts, setFourProducts] = useState<Product[]>([]);

    const handleAddToOrder = (product: Product, quantity: number) => {
        setProductImage(`/images/products/${product.image}`);
        onAddToOrder(product.product_id, quantity);
        setShowAnimation(true);
    };

    const handleAnimationComplete = () => {
        setShowAnimation(false);
    };

    const getRandomItems = (productArray: Product[], count: number) => {
        const shuffled = [...productArray].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
    };

    useEffect(() => {
        const randomProducts = getRandomItems(products, 4);
        setFourProducts(randomProducts);
    }, [products]);

    return (
        <div className="upsell-screen">
            <header>
                <img src={logo} alt="Logo" />

                <h1>We also recommend</h1>
            </header>

            <main>

                <img className="background" src={background} alt="Background" />

                <div className="products">
                    {fourProducts.map((product) => (
                        <div
                            key={product.product_id}
                            className="product"
                            onClick={() => {
                                onSelectProduct(product);
                            }}>
                            <div key={product.product_id} className="info">
                            </div>
                            <img src={`/images/products/${product.image}`} alt={product.name} />
                            {product.diet_type ? <p className="filter">{product.diet_type}</p> : null}
                            <p className='name'>{product.name}</p>
                            <p className='price-kcal'>&euro;<span>{product.price.toFixed(2)}</span> &middot; <span>{product.kcal}</span>kcal</p>

                            <button onClick={(e) => {
                                e.stopPropagation();
                                handleAddToOrder(product, 1);
                            }} className="add-button" />

                        </div>
                    ))}
                </div>

            </main>

            <footer>

                <button className="verdergaan" onClick={onClickButton}>Continue</button>

            </footer>

            <AddToCartAnimation
                isVisible={showAnimation}
                onAnimationComplete={handleAnimationComplete}
                productImage={productImage}
            />
        </div>


    );
}