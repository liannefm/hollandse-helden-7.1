import { useTranslation } from 'react-i18next';
import './HelpOverlay.scss';

type Props = {
    onClose: () => void;
};

export default function HelpOverlay({ onClose }: Props) {
    const { t } = useTranslation();

    return (
        <div className="help-overlay" onClick={onClose}>
            <div className="help-card" onClick={(e) => e.stopPropagation()}>
                <button className="close-button" onClick={onClose}>✕</button>
                <h2>{t("help_title")}</h2>

                <div className="steps">
                    <div className="step">
                        <div className="step-number">1</div>
                        <div className="step-content">
                            <h3>{t("help_step1_title")}</h3>
                            <p>{t("help_step1_desc")}</p>
                        </div>
                    </div>

                    <div className="step">
                        <div className="step-number">2</div>
                        <div className="step-content">
                            <h3>{t("help_step2_title")}</h3>
                            <p>
                                <strong>{t("all")}</strong> — {t("all_products")}<br />
                                <strong>V</strong> — {t("vegetarian")}<br />
                                <strong>VG</strong> — {t("vegan")}
                            </p>
                        </div>
                    </div>

                    <div className="step">
                        <div className="step-number">3</div>
                        <div className="step-content">
                            <h3>{t("help_step3_title")}</h3>
                            <p>{t("help_step3_desc")}</p>
                        </div>
                    </div>

                    <div className="step">
                        <div className="step-number">4</div>
                        <div className="step-content">
                            <h3>{t("help_step4_title")}</h3>
                            <p>{t("help_step4_desc")}</p>
                        </div>
                    </div>
                </div>

                <button className="got-it-button" onClick={onClose}>{t("got_it")}</button>
            </div>
        </div>
    );
}
