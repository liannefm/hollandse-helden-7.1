import './MenuScreen.scss';

import logo from "../../assets/images/logos/logo.webp";

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

                </div>
            </main>
        </div>
    );
}