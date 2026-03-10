# Hollandse Helden Kiosk Systeem

Een zelfbedieningskiosk-applicatie voor Hollandse Helden. Het systeem bestaat uit drie onderdelen:

- **Web (React/TypeScript)** — De kiosk-interface voor klanten, het bestellingsbeheer-scherm en het statusscherm
- **Server (Node.js)** — WebSocket-server via Socket.IO die communicatie tussen schermen regelt en de database beheert
- **Printer** — Bonprinter-integratie voor het afdrukken van bestellingsbonnen (thermische printer)

## Architectuur

```
┌──────────────────────────────────────────────┐
│               Web (React + Vite)             │
│  Kiosk │ Bestellingsbeheer │ Statusscherm    │
└─────────────────┬────────────────────────────┘
                  │ Socket.IO
┌─────────────────▼────────────────────────────┐
│           Server (Node.js)                   │
│        Socket.IO + MySQL                     │
└─────────────────┬────────────────────────────┘
                  │
┌─────────────────▼────────────────────────────┐
│           MySQL Database                     │
└──────────────────────────────────────────────┘
```

## Vereisten

- [Node.js](https://nodejs.org/) v18 of hoger
- [MySQL](https://www.mysql.com/) (of MariaDB)
- Een thermische bonprinter (optioneel, alleen voor de printer-module)

---

## Installatie

### 1. Repository klonen

```bash
git clone https://github.com/liannefm/hollandse-helden-7.1.git
cd hollandse-helden-7.1
```

### 2. Database instellen

Importeer het meegeleverde SQL-bestand in MySQL:

```bash
mysql -u root -p < kiosk.sql
```

Of via phpMyAdmin: maak een database aan genaamd `kiosk` en importeer `kiosk.sql`.

### 3. Server instellen

```bash
cd server
npm install
```

Maak een `.env` bestand aan op basis van het voorbeeld:

```bash
cp .env.example .env
```

Vul je databasegegevens in in `.env`:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=jouw_wachtwoord
DB_NAME=kiosk
```

Start de server:

```bash
npm run dev
```

De server draait nu op poort **3000**.

### 4. Web-applicatie instellen

```bash
cd web
npm install
npm run dev
```

De web-applicatie is nu bereikbaar op `http://localhost:5173`.

---

## Schermtypen

De web-applicatie heeft drie schermen die via de URL worden geselecteerd:

| Route | Scherm |
|---|---|
| `/` | Kiosk (klantinterface) |
| `/order-management` | Bestellingsbeheer (keuken) |
| `/order-status` | Bestellingsstatus (klantscherm) |

---

## Documentatie

Extra documentatie is te vinden in de `docs/` map:

- `Analyse 7.1.docx` — Projectanalyse
- `database-diagram.png` — Databasediagram
- `figma.png` — Figma-ontwerp
- `wireframe-feedback-1.md` / `wireframe-feedback-2.md` — Wireframe feedback
- [Trello Board](https://trello.com/invite/b/69821b293ba7e2f16453ef26/ATTIe28c5eb69b3e741dcaddd73c941ef3de81F38256/71-kiosk) — Projectplanning en taakoverzicht
