import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";
import "./AddToCartAnimation.scss";


interface Props {
    isVisible: boolean;
    onAnimationComplete: () => void;
    productImage: string;
}

export default function AddToCartAnimation({ isVisible, onAnimationComplete, productImage }: Props) {
    useEffect(() => {
        if (isVisible) {
            const timer = setTimeout(() => {
                onAnimationComplete();
            }, 2500);
            return () => clearTimeout(timer);
        }
    }, [isVisible, onAnimationComplete]);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    className="add-to-cart-overlay"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <motion.div
                        className="backdrop-blur"
                        initial={{ backdropFilter: "blur(0px)" }}
                        animate={{ backdropFilter: "blur(10px)" }}
                        transition={{ duration: 0.5 }}
                    />

                    <div className="animation-container">
                        <motion.div
                            className="product-image-container"
                            initial={{ scale: 0.5, opacity: 0, y: 100 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            transition={{ type: "spring", stiffness: 200, damping: 20 }}
                        >
                            <img src={productImage} alt="Added product" className="product-image" />
                        </motion.div>

                        <motion.div
                            className="success-message"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5, duration: 0.5 }}
                        >
                            <h2>Added to your order!</h2>
                        </motion.div>

                        <motion.div
                            className="checkmark-container"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.8, type: "spring", stiffness: 200, damping: 15 }}
                        >
                            <svg
                                width="150"
                                height="150"
                                viewBox="0 0 100 100"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                style={{ margin: "0 auto", display: "block" }}
                            >
                                <motion.path
                                    d="M15 50 L40 75 L85 25"
                                    stroke="#4CAF50"
                                    strokeWidth="8"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    initial={{ pathLength: 0 }}
                                    animate={{ pathLength: 1 }}
                                    transition={{ delay: 1, duration: 0.5 }}
                                />
                            </svg>
                        </motion.div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
