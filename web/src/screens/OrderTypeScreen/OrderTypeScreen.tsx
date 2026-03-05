import './OrderTypeScreen.scss';
import type { OrderType } from '../../types/Order';
import background from '../../assets/images/background.png';
import tasje from '../../assets/images/icons/tasje.png';
import tafeltje from '../../assets/images/icons/tafeltje.png';
import vlagnl from '../../assets/images/icons/vlagnl.png';
import vlagen from '../../assets/images/icons/vlagen.png';
import vlagde from '../../assets/images/icons/vlagde.png';

export default function OrderTypeScreen({ languageText, changeLanguage, onOrderTypeSelected }: {languageText: (key: string) => string, changeLanguage: (lang: string) => void, onOrderTypeSelected: (orderType: OrderType) => void }) {
    return (
        <div className="order-type-screen">
            <header>
                <h1>{languageText("eat_in_or_take_away")}</h1>
            </header>
            <main>
                <img className='background' src={background} />


                <div className='buttonbox'>
                    <button id='eatin' onClick={() => onOrderTypeSelected('here')}>
                        <img src={tafeltje} id="tafeltje" />
                        <p>{languageText("eat_in")}</p>
                    </button>

                    <button id='takeaway' onClick={() => onOrderTypeSelected('take_away')}>
                        <img src={tasje} id="tasje" />
                        <p>{languageText("take_away")}</p>
                    </button>
                </div>
            </main>
            <footer>

                <div className='buttonboxtaal'>
                    <button onClick={() => changeLanguage("nl")}>
                        <img src={vlagnl} id="vlagnl" />
                        Nederlands
                    </button>

                    <button onClick={() => changeLanguage("en")}>
                        <img src={vlagen} id="vlagen" />
                        English
                    </button>

                    <button onClick={() => changeLanguage("de")}>
                        <img src={vlagde} id="vlagde" />
                        Deutsch
                    </button>
                </div>
            </footer>
        </div>
    );
}