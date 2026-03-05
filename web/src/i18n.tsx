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
                    items: "items",
                    view_my_order: "View my order",

                    cancel: "Cancel",
                    add_to_order: "Add to order",

                    order_summary: "Order summary",
                    total: "total",
                    remove_item: "remove item",
                    continue_ordering: "Continue ordering",
                    complete_order: "Complete order",
                }
            },
            nl: {
                translation: {
                    eat_in_or_take_away: "Hier eten of meenemen?",
                    eat_in: "Hier eten",
                    take_away: "Meenemen",

                    choose_category: "Kies een categorie",
                    all: "Alles",
                    items: "artikelen",
                    view_my_order: "Bekijk mijn bestelling",

                    cancel: "Annuleren",
                    add_to_order: "Toevoegen aan bestelling",

                    order_summary: "Bestellingsoverzicht",
                    total: "totaal",
                    remove_item: "verwijder item",
                    continue_ordering: "Verder bestellen",
                    complete_order: "Bestelling afronden",
                }
            },
            de: {
                translation: {
                    eat_in_or_take_away: "Hier essen oder mitnehmen?",
                    eat_in: "Hier essen",
                    take_away: "Mitnehmen",

                    choose_category: "Wählen Sie eine Kategorie",
                    all: "Alle",
                    items: "Artikel",
                    view_my_order: "Meine Bestellung ansehen",

                    cancel: "Abbrechen",
                    add_to_order: "Zum Warenkorb hinzufügen",

                    order_summary: "Bestellübersicht",
                    total: "Gesamt",
                    remove_item: "Artikel entfernen",
                    continue_ordering: "Weiter bestellen",
                    complete_order: "Bestellung abschließen",
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