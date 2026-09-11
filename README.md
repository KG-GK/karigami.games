# Karigami

Die Entwickler-Website von Kaan Gevrek: Next.js App Router, React, TypeScript und Motion. Für Vercel vorbereitet.

## Lokal starten

Node.js ab 20.9 und npm werden benötigt. Für neue Deployments eine aktuell unterstützte Node-LTS-Version verwenden.

```sh
npm ci
npm run dev
```

Vorschau: http://127.0.0.1:3000. Bei restriktiver PowerShell Execution Policy `npm.cmd` anstelle von `npm` verwenden.

```sh
npm run lint
npm run build
npm run start
```

`npm test` prüft die laufende Website auf Port 3000. Mit `TEST_BASE_URL` lässt sich ein anderer lokaler Server angeben. Die Tests prüfen gerenderten Inhalt, Sprachen, Rechtsseiten, alte URLs, Bilder, Metadaten, echte 404-Antworten und `app-ads.txt`. Zusätzlich werden Theme-Logik und die Zettelsammlung geprüft. `npm run test:notebook` prüft die tatsächliche React-Komponente in JSDOM ohne laufenden Server: Öffnen, alle acht Seiten, Medien und Links, Fokus, Tastatur, Wischgesten und Übersetzungen.

## Auf Vercel veröffentlichen

1. Das Repository in Vercel importieren.
2. Framework-Preset **Next.js**, Root Directory das Repository-Verzeichnis. Die Standardbefehle `npm install` und `npm run build` verwenden. Kein eigenes Output Directory konfigurieren.
3. Die Domains `karigami.games` und `www.karigami.games` verbinden. `www.karigami.games` ist die kanonische Domain in `src/lib/content.ts`; die andere Domain in Vercel darauf umleiten.
4. Nach dem Domainwechsel `/app-ads.txt`, `/datenschutz.html`, `/impressum.html` und die englischen Altadressen prüfen.

Es werden keine Umgebungsvariablen, Datenbank oder API-Schlüssel benötigt. Deployment und DNS-Änderung sind noch nicht vorgenommen.

## Inhalte bearbeiten

- `src/lib/content.ts`: deutsche/englische Texte, Game-Daten, App-Store-Links, Kontakt und Domain.
- `src/components/home.tsx`: Aufbau der Startseite.
- `src/lib/project-stories.ts`: acht Projektgeschichten in beiden Sprachen, Bildzuordnung und Spiel-Links. BoostHammer verwendet die vorhandenen ThrustHammer-Store-Links.
- `src/components/project-notebook.tsx` und `src/app/project-notebook.css`: anklickbarer Zettelstapel im About-Bereich; Blättern per Klick auf Papier, Text oder Bild, per Buttons, Pfeiltasten und horizontalen Wischgesten. Ein Klick auf den letzten Zettel führt zum Titelblatt. Links und Textauswahl lösen kein Umblättern aus; Wischgesten blättern nur einmal. Home/Escape öffnen das Titelblatt, End die letzte Geschichte. Bei reduzierter Bewegung entfällt die Blätteranimation. Ohne JavaScript sind alle Geschichten als aufklappbare Texte lesbar.
- `public/assets/stories/README.md`: Zuordnung der neun eingebundenen Originalbilder; PocketWars und BoostHammer verwenden die vorhandenen App-Icons.
- `#current-projects`: vier textbetonte Projektbereiche für Adeltuner, WorldBuilder, ScoreWriter und Gravity Puzzle. Kleine Papierkärtchen ergänzen die Texte am Rand; bei Adeltuner überlappen vier Bilder. Gravity Puzzle ist als fertiges Spiel mit ausstehender Veröffentlichung gekennzeichnet. `src/lib/current-projects.ts` enthält die deutschen/englischen Beschreibungen und Bildzuordnungen; `src/components/current-projects.tsx` und `src/app/current-projects.css` steuern das responsive Layout. `src/components/project-gallery.tsx` vergrößert ein Kärtchen aus seiner Position heraus in einem nativen Dialog auf derselben Seite. Schließen-Button, Escape oder Klick daneben legen es zurück; der Tastaturfokus kehrt zum Kärtchen zurück. Bei reduzierter Bewegung entfällt die Animation. `npm run test:gallery` prüft Bedienung, Fokus, Animation, Scroll-Wiederherstellung und die sieben Originalbilder in `public/assets/projects/`.
- `src/app/globals.css`: Design, Typografie, responsive Layouts, Animationen.
- `src/app/themes.css`: vollständige Paletten für Papierweiß, Schwarz und Rot, einschließlich Katzenfacetten, Papierflächen und Bedienelementen.
- `src/components/theme-provider.tsx`: gemeinsame radiale Schockwelle für Farbtheme und Schriftart mit der nativen View Transition API. Schriftdateien laden vor der Momentaufnahme; danach werden die neuen Buchstabenpositionen für das zeitversetzte Zittern gemessen. Die Entfernung zum Katzenkörper bzw. zum Schwanz bestimmt die Verzögerung. Eine gemeinsame Sperre verhindert sich überlagernde Wellen.
- `src/components/paper-playground.tsx`: Origami-Katze aus CSS-Papierflächen mit Pointer-Reaktion und einmaliger Easter-Egg-Abfolge: hinlegen mit „Curiosity killed the cat.“, aufstehen mit „Just kidding.“, dann der Hinweis „Maybe try clicking the tail“. Danach bleibt die Katze bei weiteren Theme-Wechseln stehen. Ein Schwanz-Klick nach diesem Hinweis entfernt Text und Pfeil bis zum Neuladen; der Zustand bleibt auch bei interner Navigation im Root-Layout erhalten. Der Schwanz ist von Anfang an ein eigener, per Tastatur bedienbarer Button. Er wechselt per Schockwelle zwischen den ursprünglichen Schriften, lokalem Pixelify Sans und Times New Roman, unabhängig vom Farbtheme. Ein unsichtbarer Ursprungspunkt am Schwanz folgt auch der liegenden Pose. Die Auswahl gilt im aktuellen Dokument; Neuladen stellt die ursprünglichen Schriften wieder her. Während einer Farb- oder Schriftwelle werden beide Buttons kurz gesperrt. Bei `prefers-reduced-motion` erfolgen die Wechsel direkt.
- `src/content/`: übernommene Impressums- und Datenschutztexte in Deutsch und Englisch, als lokale Inhalte in React-Seiten eingebunden.
- `public/assets/`: bestehende Game-Bilder und Markenassets.
- `public/assets/KarigamiLogoOverhauled.png`: aktuelles Markenlogo. Navigation und Footer nutzen die kompakte Ableitung `karigami-symbol.png` mit beschnittenem transparentem Außenrand. `karigami-favicon-32.png`, `karigami-favicon-192.png` und `karigami-apple-touch-icon.png` sind die entsprechenden Browser- und Homescreen-Icons. Der Theme-Filter passt das Logo an den Hintergrund an; die Wortmarke „karigami.“ bleibt echter Text in Manrope. Das Zettel-Titelblatt verwendet weiterhin `catlogo.svg`. Die Originaldateien bleiben erhalten.
- `src/components/brand-link.tsx`, `brand-state.tsx` und `src/app/brand.css`: Logo-Easter-Egg mit vier Anordnungen nach den Referenzen: Kopf links, zwischen „kari“ und „gami“, über dem Wort und links neben dem zweizeiligen Wort. Jeder normale Klick ordnet das Logo neu an und führt zu `/#top` bzw. `/en#top`; auf der Startseite scrollt auch ein wiederholter Klick ganz nach oben. Header und Footer bleiben synchron. Der Zustand bleibt bei interner Navigation erhalten und startet nach dem Neuladen neu. Modifizierte Klicks behalten das normale Linkverhalten. Der reservierte Platz im Header verhindert, dass die Navigation zwischen den Logo-Varianten verrutscht.
- `public/app-ads.txt`: unveränderte AdMob-Autorisierung.
- `src/lib/redirects.mjs`: permanente Weiterleitungen der alten HTML-URLs.
- `legacy/`: vollständige bisherige statische Website als Referenz. Dieser Ordner wird nicht veröffentlicht und nicht von Next.js gerendert.

Die Seiten werden beim Build statisch vorgerendert. Menü, Origami-Katze, Zettelsammlung und Kopieren der E-Mail-Adresse nutzen React im Browser. Beide Sprachen haben ein eigenes `html lang` und gegenseitige Sprachverweise. Schriftdateien und Bilder werden lokal ausgeliefert; es sind keine Analytics, Tracking-Cookies oder externen Schriftabrufe eingebaut. Der Kontakt läuft über E-Mail; es gibt kein vorgetäuschtes Kontaktformular.

Ein Klick auf die Katze wechselt Papierweiß → Schwarz → Rot → Papierweiß. Das gewählte Theme wird ausschließlich im Browser unter `karigami-theme` gespeichert und vor dem ersten Zeichnen wiederhergestellt, auch auf Rechtsseiten und nach einem Sprachwechsel. Bei gesperrtem Speicher funktioniert der Wechsel weiterhin. Schnell aufeinanderfolgende Klicks werden während der laufenden Welle ignoriert. Die Textspannen gehören React und behalten einen zusammenhängenden, zugänglichen Text für Screenreader. Bei `prefers-reduced-motion`, fehlender View Transition API oder abgebrochener Momentaufnahme erfolgt ein direkter Theme-Wechsel. `npm run test:theme` prüft Theme-Reihenfolge, Radius, Buchstaben-Timing, gespeicherte Einstellungen und Vollständigkeit der Paletten ohne laufenden Server.

`npm run test:playground` prüft die einmalige Katzenabfolge, das dauerhafte Entfernen von Hinweis und Pfeil, den erhaltenen Zustand bei Navigation, separate Schwanz-Bedienung ab dem ersten Laden, Schriftwechsel, unveränderte Farben beim Schwanz-Klick, die Sperre während einer laufenden Welle und deutsche Texte. Zusätzlich geprüft werden Schriftladen vor der Welle, Ursprung am Schwanz, Buchstaben-Timing nach dem Umbruch und Rückfall bei abgebrochener Momentaufnahme. Alle Schriftvarianten nutzen zentrale Variablen für Überschriften, Fließtext und handschriftliche Hinweise. `npm run test:brand` prüft die vier Logo-Anordnungen, Synchronisierung, Rückkehr nach oben, Navigation und das Schließen des mobilen Menüs.

## Übernommene Rechtstexte

Anbieterangaben und App-Angaben wurden aus der alten Website übernommen. Der Hosting-Abschnitt benennt jetzt Vercel und verlinkt dessen [Datenschutzhinweise](https://vercel.com/legal/privacy-notice). Das Änderungsdatum ist fest eingetragen und wird nicht mehr bei jedem Besuch künstlich aktualisiert.

**Vor der Veröffentlichung offen:** Der ursprüngliche Datenschutztext enthält eine Bearbeitungsanweisung zur noch zu ergänzenden AdMob-Einwilligungslösung (CMP/UMP). Die Bearbeitungsanweisung wurde aus der sichtbaren Website entfernt, die inhaltliche Lücke ist weiterhin offen. Die tatsächlich in den Apps eingesetzte Lösung, Anbieter, Zwecke und Rechtsgrundlage müssen vom Betreiber ergänzt werden. Auch die bisherigen Angaben zu Offline-Nutzung, In-App-Käufen und Push-Nachrichten sind übernommene Aussagen, keine Prüfung der Apps. Die Texte sind keine abgeschlossene rechtliche Prüfung.

## Social Preview

`public/og.png` ist die projektspezifische, visuell geprüfte Vorschaugrafik. Sie wurde mit dem integrierten Imagegen-Tool erstellt und in Open Graph und Twitter-Metadaten eingebunden. Sie zeigt bewusst die deutsche Markenbotschaft auch beim Teilen der englischen Seite.

Generierungsbrief: Landschaftskarte für karigami.games, warmes Papierweiß `#f7f5ef`, dunkle Manrope-artige Typografie, rote sitzende Origami-Katze mit feiner Kreislinie; Texte „karigami“, „Kleine Games. Große Spielfreude.“, „Indie Games von Kaan Gevrek“ und „karigami.games“. Keine zusätzlichen Texte oder UI-Elemente.

Die Katze wurde mit dem integrierten Imagegen-Tool als gezielter Austausch des ursprünglichen Flugzeugmotivs erstellt und in `public/og.png` gespeichert. Bearbeitungsprompt: „Replace only the large red origami paper airplane on the right with a beautiful sitting red origami CAT. The cat must be instantly recognizable: pointed triangular ears, angular folded-paper head, upright seated body, folded front paws, and a long upward-curving faceted tail on its right. Sophisticated minimalist real folded red paper, matte vermilion, crisp triangular facets, subtly lit from upper left, soft paper shadow. No drawn cartoon face, no fur. Give it curious gentle character with a slight head tilt. Fit it entirely in the same right-hand image area, without overlapping any typography. Preserve the exact original aspect ratio and canvas size if possible. Preserve ALL existing text exactly, all typography sizes/weights/positions, the warm ivory paper background, thin circular line behind the subject, and the composition. Text remains exactly \"karigami\", \"Kleine Games.\", \"Große\", \"Spielfreude.\", \"Indie Games von Kaan Gevrek\", \"karigami.games\". Do not add anything else.“

## Prüfung des Relaunchs

Produktionsbuild, ESLint und HTTP-Migrationstests sind die technischen Prüfungen. Eine interaktive Browserprüfung konnte in der Arbeitsumgebung mangels verbundenem Browser nicht durchgeführt werden. Vor dem Livegang daher die Darstellung auf Smartphone und Desktop sowie Menü, Origami-Katze, E-Mail-Kopieren und Tastaturbedienung im eigenen Browser ansehen.
