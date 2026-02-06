import './OrderTypeScreen.scss';
import background from '../../assets/images/background.png';

export default function OrderTypeScreen() {
    return (
        <div className="order-type-screen">
            <header>
                <h1>Eat in or take away?</h1>
            </header>
            <main>
                <img className='background' src={background} />


                <div className='buttonbox'>
                    <button id='eatin'>Eat in</button>
                    <button id='takeaway'>Take away</button>
                </div>
            </main>
            <footer>
                <div className='buttonboxtaal'>
                    <button id="nl">Nederlands</button>
                    <button id="en">English</button>
                    <button id="de">Deutsch</button>
                </div>
            </footer>
        </div>
    );
}