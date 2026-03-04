import { useState } from "react";
import { useTranslation } from 'react-i18next';
import { socket } from "../socket";

import type { ProductLanguages } from "../types/ProductLanguages";


export const useLanguage = () => {
    const [productLanguages, setProductLanguages] = useState<ProductLanguages>({});
    const { t, i18n } = useTranslation()

    socket.on("product_languages", (language: string, data: any) => {
        setProductLanguages(prev => ({
            ...prev,
            [language]: data
        }));
    });

    const changeLanguage = (language: string) => {
        i18n.changeLanguage(language);

        if (!productLanguages[language]) {
            socket.emit("get_product_languages", language);
        }
    }

    return {
        productLanguages,
        languageText: t,
        changeLanguage,
        currentLanguage: i18n.language,
    }
}
