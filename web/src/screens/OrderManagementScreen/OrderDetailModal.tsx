import { useEffect, useState } from 'react';
import './OrderDetailModal.scss';
import { socket } from '../../socket';

interface Order {
    order_id: number;
    pickup_number: number;
    order_status_id: number;
    status_description: string;
    price_total: number;
    datetime: string;
}

interface OrderProduct {
    product_id: number;
    name: string;
    price: number;
    image: string;
    quantity: number;
}

interface Props {
    order: Order;
    onClose: () => void;
    onAdvance: (order: Order) => void;
}

const STATUS_LABELS: Record<number, string> = {
    1: 'Gestart',
    2: 'Geplaatst & Betaald',
    3: 'In bereiding',
    4: 'Klaar voor ophalen',
    5: 'Opgehaald',
};

const STATUS_CLASS: Record<number, string> = {
    1: 'started',
    2: 'paid',
    3: 'preparing',
    4: 'ready',
    5: 'done',
};

const NEXT_STATUS_LABEL: Record<number, string> = {
    1: 'Markeer betaald',
    2: 'Markeer in bereiding',
    3: 'Markeer klaar',
    4: 'Markeer opgehaald',
};

const NEXT_STATUS: Record<number, number> = {
    1: 2,
    2: 3,
    3: 4,
    4: 5,
};

export default function OrderDetailModal({ order, onClose, onAdvance }: Props) {
    const [products, setProducts] = useState<OrderProduct[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        socket.emit('get_order_details', { order_id: order.order_id });

        const handleDetails = ({ order_id, products: p }: { order_id: number; products: OrderProduct[] }) => {
            if (order_id === order.order_id) {
                setProducts(p);
                setLoading(false);
            }
        };

        socket.on('order_details', handleDetails);
        return () => { socket.off('order_details', handleDetails); };
    }, [order.order_id]);

    const formatTime = (datetime: string) =>
        new Date(datetime).toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' });

    const formatPrice = (price: number) => `€${Number(price).toFixed(2)}`;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="order-detail-modal" onClick={e => e.stopPropagation()}>
                <button className="close-btn" onClick={onClose} aria-label="Sluiten">✕</button>

                <div className="modal-header">
                    <div className="pickup-badge">#{order.pickup_number}</div>
                    <div className="meta">
                        <span className={`status-badge status--${STATUS_CLASS[order.order_status_id]}`}>
                            {STATUS_LABELS[order.order_status_id]}
                        </span>
                        <span className="time">{formatTime(order.datetime)}</span>
                    </div>
                </div>

                <div className="modal-body">
                    <h3>Bestelde producten</h3>

                    {loading ? (
                        <div className="loading">Laden...</div>
                    ) : products.length === 0 ? (
                        <div className="empty">Geen producten gevonden</div>
                    ) : (
                        <ul className="product-list">
                            {products.map(product => (
                                <li key={product.product_id} className="product-item">
                                    {product.image && (
                                        <img
                                            src={`/images/products/${product.image}`}
                                            alt={product.name}
                                            className="product-img"
                                        />
                                    )}
                                    <div className="product-info">
                                        <span className="product-name">{product.name}</span>
                                        <span className="product-price">{formatPrice(product.price)}</span>
                                    </div>
                                    <span className="product-qty">×{product.quantity}</span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <div className="modal-footer">
                    <div className="total-row">
                        <span>Totaal</span>
                        <span className="total-price">{formatPrice(order.price_total)}</span>
                    </div>

                    {NEXT_STATUS[order.order_status_id] && (
                        <button className="advance-btn" onClick={() => onAdvance(order)}>
                            {NEXT_STATUS_LABEL[order.order_status_id]}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
