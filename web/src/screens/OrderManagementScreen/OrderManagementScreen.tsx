import { useEffect, useState, useCallback } from 'react';
import './OrderManagementScreen.scss';
import { socket } from '../../socket';
import OrderDetailModal from './OrderDetailModal';

interface Order {
    order_id: number;
    pickup_number: number;
    order_status_id: number;
    status_description: string;
    price_total: number;
    datetime: string;
}

const STATUS_LABELS: Record<number, string> = {
    1: 'Started',
    2: 'Placed & Paid',
    3: 'Preparing',
    4: 'Ready for Pickup',
    5: 'Picked Up',
};

const STATUS_CLASS: Record<number, string> = {
    1: 'started',
    2: 'paid',
    3: 'preparing',
    4: 'ready',
    5: 'done',
};

const NEXT_STATUS: Record<number, number> = {
    1: 2,
    2: 3,
    3: 4,
    4: 5,
};

const NEXT_STATUS_LABEL: Record<number, string> = {
    1: 'Mark Paid',
    2: 'Mark Preparing',
    3: 'Mark Ready',
    4: 'Mark Picked Up',
};

export default function OrderManagementScreen() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

    const handleOrderUpdated = useCallback((updatedOrder: Order) => {
        setOrders(prev => {
            if (!prev.find(o => o.order_id === updatedOrder.order_id)) return prev;
            if (updatedOrder.order_status_id === 5) {
                return prev.filter(o => o.order_id !== updatedOrder.order_id);
            }
            return prev.map(o => o.order_id === updatedOrder.order_id ? updatedOrder : o);
        });
        setSelectedOrder(prev =>
            prev?.order_id === updatedOrder.order_id
                ? updatedOrder.order_status_id === 5 ? null : updatedOrder
                : prev
        );
    }, []);

    useEffect(() => {
        socket.auth = { screenType: 'orderManagement' };
        socket.connect();

        socket.on('active_orders', (activeOrders: Order[]) => {
            setOrders(activeOrders);
        });

        socket.on('new_order', (order: Order) => {
            setOrders(prev => {
                if (prev.find(o => o.order_id === order.order_id)) return prev;
                return [order, ...prev];
            });
        });

        socket.on('order_updated', handleOrderUpdated);

        return () => {
            socket.off('active_orders');
            socket.off('new_order');
            socket.off('order_updated');
            socket.disconnect();
        };
    }, [handleOrderUpdated]);

    const advanceStatus = (order: Order) => {
        const nextStatus = NEXT_STATUS[order.order_status_id];
        if (!nextStatus) return;
        socket.emit('update_order_status', { order_id: order.order_id, status_id: nextStatus });
    };

    const formatTime = (datetime: string) =>
        new Date(datetime).toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' });

    const formatPrice = (price: number) => `€${Number(price).toFixed(2)}`;

    return (
        <div className="order-management-screen">
            <header className="management-header">
                <h1>Order Management</h1>
                <span className="order-count">{orders.length} actieve order{orders.length !== 1 ? 's' : ''}</span>
            </header>

            <main className="management-content">
                {orders.length === 0 ? (
                    <div className="empty-state">
                        <p>Geen actieve orders</p>
                    </div>
                ) : (
                    <table className="orders-table">
                        <thead>
                            <tr>
                                <th>Pickup #</th>
                                <th>Status</th>
                                <th>Totaal</th>
                                <th>Tijdstip</th>
                                <th>Actie</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map(order => (
                                <tr
                                    key={order.order_id}
                                    className={`order-row status--${STATUS_CLASS[order.order_status_id]} ${selectedOrder?.order_id === order.order_id ? 'selected' : ''}`}
                                    onClick={() => setSelectedOrder(order)}
                                >
                                    <td className="pickup-number">#{order.pickup_number}</td>
                                    <td>
                                        <span className={`status-badge status--${STATUS_CLASS[order.order_status_id]}`}>
                                            {STATUS_LABELS[order.order_status_id]}
                                        </span>
                                    </td>
                                    <td className="price">{formatPrice(order.price_total)}</td>
                                    <td className="time">{formatTime(order.datetime)}</td>
                                    <td onClick={e => e.stopPropagation()}>
                                        {NEXT_STATUS[order.order_status_id] && (
                                            <button
                                                className="advance-btn"
                                                onClick={() => advanceStatus(order)}
                                            >
                                                {NEXT_STATUS_LABEL[order.order_status_id]}
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </main>

            {selectedOrder && (
                <OrderDetailModal
                    order={selectedOrder}
                    onClose={() => setSelectedOrder(null)}
                    onAdvance={(order) => {
                        advanceStatus(order);
                        setSelectedOrder(null);
                    }}
                />
            )}
        </div>
    );
}
