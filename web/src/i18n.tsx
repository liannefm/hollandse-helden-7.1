import i18n from "i18next"
import { initReactI18next } from "react-i18next"

i18n
    .use(initReactI18next)
    .init({
        resources: {
            en: {
                translation: {
                    fresh_healthy_and_quickly: "Fresh, Healthy\n&\nEnjoy Quickly",
                    click_to_start: "CLICK THE SCREEN TO START",

                    eat_in_or_take_away: "Eat in or take away?",
                    eat_in: "Eat in",
                    take_away: "Take away",

                    choose_category: "Choose a category",
                    all: "All",
                    all_products: "All products",
                    vegetarian: "Vegetarian",
                    vegan: "Vegan",
                    items: "items",
                    view_my_order: "View my order",

                    cancel: "Cancel",
                    add_to_order: "Add to order",

                    order_summary: "Order summary",
                    total: "Total",
                    remove_item: "Remove item",
                    continue_ordering: "Continue ordering",
                    complete_order: "Complete order",

                    we_also_recommend: "We also recommend",
                    continue: "Continue",

                    payment_instructions: "Follow the instructions on the payment terminal",

                    order_preparing: "We're preparing your order.\nDon't forget to take your receipt.",

                    are_you_still_there: "Are you still there?",
                    order_cancelled_in: "Your order will be cancelled in {{seconds}} seconds.",

                    help_title: "How does this work?",
                    help_step1_title: "Choose a category",
                    help_step1_desc: "Tap one of the category buttons to browse the products.",
                    help_step2_title: "Filter by diet",
                    help_step3_title: "Add a product",
                    help_step3_desc: "Tap a product for more details, or tap the + button to add it directly to your order.",
                    help_step4_title: "View your order",
                    help_step4_desc: "Tap \"View my order\" at the bottom to review and complete your order.",
                    got_it: "Got it!",

                    added_to_order: "Added to your order!",
                }
            },
            nl: {
                translation: {
                    fresh_healthy_and_quickly: "Vers, Gezond\n&\nSnel Genieten",
                    click_to_start: "TIK OP HET SCHERM OM TE BEGINNEN",

                    eat_in_or_take_away: "Hier eten of meenemen?",
                    eat_in: "Hier eten",
                    take_away: "Meenemen",

                    choose_category: "Kies een categorie",
                    all: "Alles",
                    all_products: "Alle producten",
                    vegetarian: "Vegetarisch",
                    vegan: "Veganistisch",
                    items: "artikelen",
                    view_my_order: "Bekijk mijn bestelling",

                    cancel: "Annuleren",
                    add_to_order: "Toevoegen aan bestelling",

                    order_summary: "Bestellingsoverzicht",
                    total: "Totaal",
                    remove_item: "Verwijder item",
                    continue_ordering: "Verder bestellen",
                    complete_order: "Bestelling afronden",

                    we_also_recommend: "Dit raden we ook aan",
                    continue: "Doorgaan",

                    payment_instructions: "Volg de instructies op de betaalterminal",

                    order_preparing: "We bereiden uw bestelling voor.\nVergeet niet uw bon mee te nemen.",

                    are_you_still_there: "Ben je er nog?",
                    order_cancelled_in: "Je bestelling wordt geannuleerd over {{seconds}} seconden.",

                    help_title: "Hoe werkt dit?",
                    help_step1_title: "Kies een categorie",
                    help_step1_desc: "Tik op een van de categorieknoppen om de producten te bekijken.",
                    help_step2_title: "Filter op dieet",
                    help_step3_title: "Voeg een product toe",
                    help_step3_desc: "Tik op een product voor meer details, of tik op de + knop om het direct aan je bestelling toe te voegen.",
                    help_step4_title: "Bekijk je bestelling",
                    help_step4_desc: "Tik op \"Bekijk mijn bestelling\" onderaan om je bestelling te bekijken en af te ronden.",
                    got_it: "Begrepen!",

                    added_to_order: "Toegevoegd aan je bestelling!",
                }
            },
            de: {
                translation: {
                    fresh_healthy_and_quickly: "Frisch, Gesund\n&\nSchnell Genießen",
                    click_to_start: "BILDSCHIRM ANTIPPEN ZUM STARTEN",

                    eat_in_or_take_away: "Hier essen oder mitnehmen?",
                    eat_in: "Hier essen",
                    take_away: "Mitnehmen",

                    choose_category: "Wähle eine Kategorie",
                    all: "Alle",
                    all_products: "Alle Produkte",
                    vegetarian: "Vegetarisch",
                    vegan: "Vegan",
                    items: "Artikel",
                    view_my_order: "Meine Bestellung ansehen",

                    cancel: "Abbrechen",
                    add_to_order: "Zum Warenkorb hinzufügen",

                    order_summary: "Bestellübersicht",
                    total: "Gesamt",
                    remove_item: "Artikel entfernen",
                    continue_ordering: "Weiter bestellen",
                    complete_order: "Bestellung abschließen",

                    we_also_recommend: "Das empfehlen wir auch",
                    continue: "Weiter",

                    payment_instructions: "Folgen Sie den Anweisungen am Zahlungsterminal",

                    order_preparing: "Wir bereiten Ihre Bestellung vor.\nVergessen Sie nicht, Ihren Kassenbon mitzunehmen.",

                    are_you_still_there: "Bist du noch da?",
                    order_cancelled_in: "Ihre Bestellung wird in {{seconds}} Sekunden abgebrochen.",

                    help_title: "Wie funktioniert das?",
                    help_step1_title: "Wähle eine Kategorie",
                    help_step1_desc: "Tippe auf einen der Kategorieknöpfe, um die Produkte zu durchsuchen.",
                    help_step2_title: "Nach Diät filtern",
                    help_step3_title: "Ein Produkt hinzufügen",
                    help_step3_desc: "Tippe auf ein Produkt für mehr Details oder tippe auf die + Schaltfläche, um es direkt zur Bestellung hinzuzufügen.",
                    help_step4_title: "Deine Bestellung ansehen",
                    help_step4_desc: "Tippe auf \"Meine Bestellung ansehen\" unten, um deine Bestellung zu überprüfen und abzuschließen.",
                    got_it: "Verstanden!",

                    added_to_order: "Zu deiner Bestellung hinzugefügt!",
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
