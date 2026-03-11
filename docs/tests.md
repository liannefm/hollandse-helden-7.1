# Tests

---

## 1. Functional Test

De onderstaande functies zijn getest en werken correct.

| # | Functie | Status |
|---|---------|--------|
| 1 | App openen / idle scherm weergeven | ✅ Werkt |
| 2 | Taal wisselen (NL / EN / DE) | ✅ Werkt |
| 3 | Bestelling type kiezen (Eten hier / Meenemen) | ✅ Werkt |
| 4 | Menu laden met categorieën en producten | ✅ Werkt |
| 5 | Filteren op dieet (Alles / Vegetarisch / Vegan) | ✅ Werkt |
| 6 | Product detail bekijken | ✅ Werkt |
| 7 | Product toevoegen aan winkelwagen | ✅ Werkt |
| 8 | Hoeveelheid verhogen / verlagen in winkelwagen | ✅ Werkt |
| 9 | Product verwijderen uit winkelwagen | ✅ Werkt |
| 10 | Winkelwagen overzicht bekijken | ✅ Werkt |
| 11 | Upsell scherm weergeven | ✅ Werkt |
| 12 | Betaling starten | ✅ Werkt |
| 13 | Order aanmaken in de database | ✅ Werkt |
| 14 | Bevestigingsscherm met ophaalnummer weergeven | ✅ Werkt |
| 15 | Bon afdrukken via thermische printer | ✅ Werkt |
| 16 | Orderstatus bijwerken (Started → In Progress → Ready → Picked Up) | ✅ Werkt |
| 17 | Orderstatus live weergeven op statusscherm | ✅ Werkt |
| 18 | Orderbeheer scherm (kitchen display) | ✅ Werkt |
| 19 | Inactiviteitstimer en terugkeer naar idle scherm | ✅ Werkt |
| 20 | Help overlay openen en sluiten | ✅ Werkt |

---

## 2. Compatibility Test

De applicatie is getest op het kiosk bord en alles werkt correct.

| Apparaat / Platform | Resultaat |
|---------------------|-----------|
| Kiosk bord (touchscreen) | ✅ Werkt |
| Touchscreen bediening | ✅ Werkt |
| Lokaal netwerk (Socket.IO verbinding) | ✅ Werkt |
| MySQL database verbinding | ✅ Werkt |

---

## 3. Performance Test

### Test Scenarios

#### 1. Menu Loading Time
- **Wat wordt gemeten:** De tijd die nodig is om het menu te laden, inclusief categorieën, producten en afbeeldingen.
- **Netwerkomstandigheden:** Getest op lokaal netwerk (kiosk setup).
- **Bevindingen:**
  - Categorieën en producten worden direct bij de Socket.IO verbinding verstuurd vanuit de server (`socket.emit("products", ...)` en `socket.emit("categories", ...)`). Dit zorgt voor een snelle initiële laadtijd.
  - Afbeeldingen zijn opgeslagen als `.webp` bestanden, wat de bestandsgrootte minimaliseert.
  - Taalteksten worden apart opgehaald per taalwissel via `get_product_languages` en `get_category_languages`.
  - **Geschatte laadtijd menu:** ~0.5 – 1.5 seconden op lokaal netwerk.
  - **Bij taalwissel:** ~0.2 – 0.5 seconden extra voor de taaldata.

---

#### 2. Order Processing Time
- **Wat wordt gemeten:** De tijd van bevestigen in de winkelwagen tot het ontvangen van een ophaalnummer.
- **Variabelen:** Aantal producten in de bestelling, databasebelasting.
- **Bevindingen:**
  - In `PaymentInProgressScreen` wordt een timer van **3 seconden** gebruikt als simulatie van betalingsverwerking, daarna wordt `create_order` verstuurd via Socket.IO.
  - De server verwerkt de order in een MySQL-transactie (INSERT in `orders` + meerdere INSERTs in `order_product`).
  - De totale verwerkingstijd is sterk afhankelijk van het aantal items: voor elke item in de bestelling wordt een aparte query uitgevoerd (`for (const item of orderData.items)`).
  - **Geschatte verwerkingstijd:**
    - 1–5 producten: ~3.1 – 3.4 seconden (inclusief de 3s timer).
    - 10+ producten: ~3.5 – 4.0 seconden.

---

#### 3. Touchscreen Responsiveness
- **Wat wordt gemeten:** De reactietijd van de app op aanraakgebeurtenissen.
- **Testomstandigheden:** Normaal gebruik en druk gebruik.
- **Bevindingen:**
  - De UI is gebouwd in React met lokale state (`useState`, `useOrderStore`). Toestandswijzigingen zoals `addToCart`, `increaseFromCart` en `decreaseFromCart` zijn synchrone berekeningen zonder netwerkverzoeken, wat zorgt voor directe feedback.
  - Animaties (zoals de `AddToCartAnimation`) zijn CSS-gebaseerd en beïnvloeden de UI-responsiviteit minimaal.
  - Scroll-posities worden onthouden via `useScrollStore`, wat navigatie vloeiend maakt.
  - **Geschatte reactietijd:** < 100ms voor vrijwel alle touch-interacties.
  - Geen merkbare vertraging verwacht, zelfs bij intensief gebruik.

---

#### 4. Payment Processing Speed
- **Wat wordt gemeten:** De tijd die nodig is om een betaling te verwerken en de order aan te maken.
- **Betaaltypes:** Momenteel wordt betaling gesimuleerd via een 3-seconden timer in `PaymentInProgressScreen`.
- **Bevindingen:**
  - De betaling zelf is een simulatie (geen externe betaalterminal geïntegreerd). De timer staat vast op 3 seconden.
  - Na de timer wordt de order aangemaakt via Socket.IO + MySQL, wat ~0.1 – 0.5 seconden extra kost.
  - **Geschatte totale betalingstijd:** ~3.1 – 3.5 seconden.
  - Bij integratie van een echte betaalterminal zal de tijd afhangen van de terminal responstijd (gemiddeld 5–15 seconden bij PIN-betaling).

---

#### 5. Concurrent User Simulation
- **Wat wordt gesimuleerd:** Meerdere gebruikers die tegelijkertijd een bestelling plaatsen.
- **Bevindingen:**
  - De server gebruikt een MySQL connection pool met een limiet van **10 gelijktijdige verbindingen** (`connectionLimit: 10`).
  - Socket.IO verwerkt meerdere clients gelijktijdig. Elke client (kiosk) heeft een eigen socketverbinding.
  - Orders worden verwerkt in een MySQL-transactie met rollback-beveiliging bij fouten.
  - Het ophaalnummer wordt gegenereerd op basis van de laatste order in de database (`SELECT pickup_number FROM orders ORDER BY order_id DESC LIMIT 1`). Bij gelijktijdige orders bestaat er een kleine kans op een race condition bij het ophalen van het ophaalnummer.
  - **Verwachte prestaties bij meerdere gelijktijdige gebruikers:**
    - Tot 5 gelijktijdige gebruikers: geen merkbare vertraging.
    - 5–10 gelijktijdige gebruikers: lichte vertraging mogelijk door de connection pool.
    - 10+ gelijktijdige gebruikers: wachtrij in de connection pool, vertraging van ~0.5 – 2 seconden per extra gebruiker boven de limiet.
