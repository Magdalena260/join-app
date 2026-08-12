# JoinApp

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 21.2.17.

## Projektstruktur & Architektur

Dieses Projekt nutzt eine modulare und skalierbare Ordnerstruktur, die speziell auf eine saubere Trennung von Logik, Layout und Styling ausgelegt ist.

```BASE STRUCTURE
join-app/
├── public/                 // Statische Dateien, die 1:1 an den Browser ausgeliefert werden
│   └── assets/
│       ├── fonts/          // Lokale Schriftarten (z.B. Inter)
│       ├── icons/          // SVG-Icons, Logos oder Icon-Sprites
│       └── images/         // Allgemeine Grafiken und Bilder
│
├── src/                    // Der eigentliche Quellcode der Anwendung
│   ├── app/                // Der Kern der Angular-App
│   │   ├── layout/         // Globale, seitenübergreifende Elemente (Header, Sidebar, Footer)
│   │   ├── pages/          // Die Haupt-Ansichten/Routen (sog. "Smart Components")
│   │   ├── sections/       // In sich geschlossene Inhaltsblöcke für Pages (z.B. Task-Formular)
│   │   ├── shared/         // Wiederverwendbare UI-Elemente (Buttons, Inputs, Modals)
│   │   ├── app.config.ts   // Globale Konfiguration (Provider, Routing-Setup)
│   │   ├── app.routes.ts   // Definition, welche URL zu welcher Page-Component führt
│   │   └── app.ts/.html    // Die Wurzel-Komponente (Root)
│   │
│   ├── environments/       // Konfigurationsvariablen (z.B. Supabase-Keys) für Dev und Live
│   │
│   ├── styles/             // Modulare, globale SCSS-Architektur
│   │   ├── abstracts/      // SCSS-Helfer (Variablen, Mixins, Funktionen - kein CSS Output)
│   │   ├── base/           // Grundlegende HTML-Element-Stylings und CSS-Resets
│   │   └── utils/          // Hilfsklassen (Utility Classes wie .flex-center, .mt-2)
│   │
│   ├── index.html          // Die einzige HTML-Datei (Einstiegspunkt in den Browser)
│   ├── main.ts             // Startschuss (Entry Point) für die Angular-App
│   └── styles.scss         // Haupt-Styling-Datei (importiert die Dateien aus dem styles/-Ordner)
│
├── .editorconfig           // Erzwingt gleiche Editor-Einstellungen im ganzen Team
├── .gitignore              // Sagt Git, welche Dateien NICHT hochgeladen werden sollen
├── .prettierrc             // Regeln für den automatischen Code-Formatter (Prettier)
├── angular.json            // Das Herzstück der CLI (Build-Configs, Settings wie skipTests & scss)
├── package.json            // Liste aller installierten npm-Pakete und Terminal-Befehle
└── tsconfig.*.json         // Strikte Regeln und Konfigurationen für den TypeScript-Compiler
```

# Team-Manifest: JoinApp

Dieses Manifest definiert unsere gemeinsamen Spielregeln für die Entwicklung. Es hilft uns, effizient zusammenzuarbeiten, Code-Konflikte zu vermeiden und die Qualität unseres Projekts hoch zu halten.

## 1. Kommunikation & Stand-Up

- **Daily Stand-Up:** Wir treffen uns täglich um **15:00 Uhr**.
- **Agenda für das Stand-Up:** Jeder beantwortet kurz und knapp drei Fragen:
  1. Was habe ich seit dem letzten Stand-Up geschafft?
  2. Was plane ich bis zum nächsten Stand-Up?
  3. Wo hänge ich fest oder brauche Hilfe (Blocker)?
- **Asynchrone Kommunikation:** Außerhalb des Stand-Ups kommunizieren wir proaktiv im Chat. Wenn jemand feststeckt, wird umgehend im Team nachgefragt, anstatt stundenlang allein nach einem Fehler zu suchen. Wir respektieren dabei individuelle Arbeits- und Schichtpläne.

## 2. Branching-Strategie (Git)

Wir arbeiten **niemals** direkt auf dem `main`-Branch!

- Für jede neue Aufgabe oder jedes Feature erstellen wir einen eigenen Branch ausgehend vom aktuellsten `main`.
- **Namenskonventionen für Branches:**
  - `feature/name-des-features` (z. B. `feature/login-form`)
  - `fix/name-des-bugs` (z. B. `fix/header-alignment`)
  - `chore/setup-thema` (z. B. `chore/angular-config`)

## 💾 3. Commit-Nachrichten

Wir nutzen _Conventional Commits_, damit unsere Git-Historie lesbar und nachvollziehbar bleibt. Alle Commits werden im Präsens und auf Englisch geschrieben.

- `feat:` für neue Funktionen (z. B. `feat: add user authentication`)
- `fix:` für Fehlerbehebungen (z. B. `fix: resolve routing issue on main page`)
- `chore:` für Konfigurationen und Setup (z. B. `chore: update angular environment variables`)
- `style:` für reine Optik-Anpassungen im SCSS ohne Logik-Änderung
- `refactor:` für Code-Verbesserungen, die weder Features hinzufügen noch Bugs fixen

_Tipp: Commits sollten kleine, logische Einheiten sein. Lieber öfter kleine Commits machen als einen riesigen am Ende des Tages!_

## 4. Pull Requests (PRs) & Merges

- **Vier-Augen-Prinzip:** Niemand mergt seinen eigenen Code in den `main`-Branch!
- Sobald ein Feature fertig ist, wird ein Pull Request (PR) erstellt.
- Ein anderes Teammitglied schaut sich den Code kurz an (Code Review) und gibt ihn frei.
- **Vor dem PR:** Der Entwickler stellt sicher, dass sein lokaler Branch auf dem neuesten Stand ist (`git pull origin main` in den eigenen Branch mergen und Konflikte lokal lösen), bevor der PR erstellt wird.

## 5. Code & Architektur

- Wir halten uns an die vereinbarte Angular-Ordnerstruktur (`pages`, `shared`, `sections`).
- **Environment-Variablen:** Sensible Daten (wie Supabase API-Keys) werden nur in den `environment.ts` Dateien gepflegt und sauber über Angular-Services abgerufen.
- **Sauberer Code:** Bevor ein PR erstellt wird, räumen wir unseren Code auf (keine unnötigen `console.log()` mehr, korrekte Einrückungen, ungenutzte Imports entfernen).
- **Automatisches Formatieren:** Wir nutzen _Prettier_. Bitte stelle in deinem Code-Editor (z.B. VS Code) ein, dass Dokumente beim Speichern automatisch formatiert werden ("Format on Save"). Das verhindert unnötige Git-Konflikte durch verschiedene Einrückungen.

## 6. Fehlerkultur & Bei Unsicherheiten (Die 15-Minuten-Regel)

- **Fragen ist ausdrücklich erwünscht:** Wir arbeiten als Team zusammen. Wenn jemand bei einem Konzept, einer Fehlermeldung oder einer bestimmten Architektur-Entscheidung unsicher ist, wird proaktiv nachgefragt.
- **Timeboxing:** Bevor wir uns stundenlang frustrieren, gilt die 15-Minuten-Regel. Wer länger als 15 bis 30 Minuten an einem Bug festhängt, ohne erkennbaren Fortschritt zu machen, bittet das Team um Hilfe. Oft sieht ein zweites Paar Augen (oder ein kurzes Screen-Sharing) den fehlenden Buchstaben oder Denkfehler in Sekunden.
- **Keine falsche Scheu:** Es gibt keine dummen Fragen. Lieber einmal zu viel nachgefragt und gemeinsam eine Lösung gefunden, als Code zu pushen, bei dem man sich unwohl fühlt.

## 7. Ticket-Management & Workflow (GitHub Projects)

Wir nutzen GitHub Projects zur Aufgabenverwaltung. Um den Überblick zu behalten und Doppelarbeit zu vermeiden, halten wir uns strikt an folgenden Ablauf:

- **Von der Idee zum Draft:** Alle Aufgaben werden nach gemeinsamer Absprache im Board zunächst als _Drafts_ (Entwürfe) angelegt und der entsprechenden Person zugewiesen.
- **Draft to Issue:** Bevor jemand aktiv an einem Draft zu arbeiten beginnt, **muss** dieser in ein echtes _Issue_ umgewandelt werden. Erst dann startet die eigentliche Entwicklung.
- **Ein Ticket, ein Entwickler:** Niemand arbeitet an einem Issue, das ihm nicht offiziell im Board zugewiesen ist.
- **Automatisches Schließen:** Um das Board sauber zu halten, schließen wir Issues direkt über die Commit-Nachricht des finalen Commits (durch Anhängen von z.B. `closes #12` oder `closed #12`). Das Issue wandert dadurch automatisch auf "Done".
