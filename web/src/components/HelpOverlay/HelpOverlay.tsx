import './HelpOverlay.scss';

type Props = {
    onClose: () => void;
};

export default function HelpOverlay({ onClose }: Props) {
    return (
        <div className="help-overlay" onClick={onClose}>
            <div className="help-card" onClick={(e) => e.stopPropagation()}>
                <button className="close-button" onClick={onClose}>✕</button>
                <h2>How does this work?</h2>

                <div className="steps">
                    <div className="step">
                        <div className="step-number">1</div>
                        <div className="step-content">
                            <h3>Choose a category</h3>
                            <p>Tap one of the category buttons to browse the products.</p>
                        </div>
                    </div>

                    <div className="step">
                        <div className="step-number">2</div>
                        <div className="step-content">
                            <h3>Filter by diet</h3>
                            <p>
                                <strong>All</strong> — All products<br />
                                <strong>V</strong> — Vegetarian<br />
                                <strong>VG</strong> — Vegan
                            </p>
                        </div>
                    </div>

                    <div className="step">
                        <div className="step-number">3</div>
                        <div className="step-content">
                            <h3>Add a product</h3>
                            <p>Tap a product for more details, or tap the <strong>+</strong> button to add it directly to your order.</p>
                        </div>
                    </div>

                    <div className="step">
                        <div className="step-number">4</div>
                        <div className="step-content">
                            <h3>View your order</h3>
                            <p>Tap <strong>"View my order"</strong> at the bottom to review and complete your order.</p>
                        </div>
                    </div>
                </div>

                <button className="got-it-button" onClick={onClose}>Got it!</button>
            </div>
        </div>
    );
}
