import i18n from "i18next"
import { initReactI18next } from "react-i18next"

i18n
    .use(initReactI18next)
    .init({
        resources: {
            en: {
                translation: {
                    fresh_healthy_and_quickly: "Fresh, Healthy Enjoy Quickly",

                    eat_in_or_take_away: "Eat in or take away?",
                    eat_in: "Eat in",
                    take_away: "Take away",

                    choose_category: "Choose a category",
                    all: "All",
                }
            },
            nl: {
                translation: {
                    eat_in_or_take_away: "Hier eten of meenemen?",
                    eat_in: "Hier eten",
                    take_away: "Meenemen",

                    choose_category: "Kies een categorie",
                    all: "Alles",
                }
            },
            de: {
                translation: {
                    eat_in_or_take_away: "Hier essen oder mitnehmen?",
                    eat_in: "Hier essen",
                    take_away: "Mitnehmen",

                    choose_category: "Wählen Sie eine Kategorie",
                    all: "Alle",
                }
            }
        },
        lng: "en",
        fallbackLng: "en",
        interpolation: {
            escapeValue: false
        }
    })

export default i18n