import { useState } from "react";
import { useTranslation } from 'react-i18next';
import { socket } from "../socket";

import type { ProductLanguages } from "../types/ProductLanguages";
import type { CategoryLanguages } from "../types/CategoryLanguages";


export const useLanguage = () => {
    const [productLanguages, setProductLanguages] = useState<ProductLanguages>({});
    const [categoryLanguages, setcategoryLanguages] = useState<CategoryLanguages>({});
    const { t, i18n } = useTranslation()

    socket.on("product_languages", (data: ProductLanguages) => {
        setProductLanguages(prev => ({
            ...prev,
            ...data
        }));
    });

    socket.on("category_languages", (data: CategoryLanguages) => {
        setcategoryLanguages(prev => ({
            ...prev,
            ...data
        }));
    });

    const changeLanguage = (language: string) => {
        i18n.changeLanguage(language);

        if (!productLanguages[language]) {
            socket.emit("get_product_languages", language);
        }

        if (!categoryLanguages[language]) {
            socket.emit("get_category_languages", language);
        }
    }

    return {
        productLanguages,
        setProductLanguages,
        categoryLanguages,
        setcategoryLanguages,
        languageText: t,
        changeLanguage,
        currentLanguage: i18n.language,
    }
}
