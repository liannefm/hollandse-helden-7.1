import './OrderTypeScreen.scss';
import background from '../../assets/images/background.png';
import tasje from '../../assets/images/tasje.png';
import tafeltje from '../../assets/images/tafeltje.png';
import vlagnl from '../../assets/images/vlagnl.png';
import vlagen from '../../assets/images/vlagen.png';
import vlagde from '../../assets/images/vlagde.png';

export default function OrderTypeScreen() {
    return (
        <div className="order-type-screen">
            <header>
                <h1>Eat in or take away?</h1>
            </header>
            <main>
                <img className='background' src={background} />


                <div className='buttonbox'>
                    <button id='eatin'>
                        <img src={tafeltje} id="tafeltje"/>
                        Eat in
                    </button>

                    <button id='takeaway'>
                        <img src={tasje} id="tasje"/>
                        Take away
                    </button>
                </div>
            </main>
            <footer>
                <div className='buttonboxtaal'>
                    <button id="nl">
                        <img src={vlagnl} id="vlagnl"/>
                        Nederlands
                    </button>

                    <button id="en">
                        <img src={vlagen} id="vlagen"/>
                        English
                    </button>

                    <button id="de">
                        <img src={vlagde} id="vlagde"/>
                        Deutsch
                    </button>
                </div>
            </footer>
        </div>
    );
}