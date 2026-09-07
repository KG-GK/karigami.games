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

`npm test` prüft die laufende Website auf Port 3000. Mit `TEST_BASE_URL` lässt sich ein anderer lokaler Server angeben. Die Tests prüfen gerenderten Inhalt, Sprachen, Rechtsseiten, alte URLs, Bilder, Metadaten, echte 404-Antworten und `app-ads.txt`.

## Auf Vercel veröffentlichen

1. Das Repository in Vercel importieren.
2. Framework-Preset **Next.js**, Root Directory das Repository-Verzeichnis. Die Standardbefehle `npm install` und `npm run build` verwenden. Kein eigenes Output Directory konfigurieren.
3. Die Domains `karigami.games` und `www.karigami.games` verbinden. `www.karigami.games` ist die kanonische Domain in `src/lib/content.ts`; die andere Domain in Vercel darauf umleiten.
4. Nach dem Domainwechsel `/app-ads.txt`, `/datenschutz.html`, `/impressum.html` und die englischen Altadressen prüfen.

Es werden keine Umgebungsvariablen, Datenbank oder API-Schlüssel benötigt. Deployment und DNS-Änderung sind noch nicht vorgenommen.

## Inhalte bearbeiten

- `src/lib/content.ts`: deutsche/englische Texte, Game-Daten, App-Store-Links, Kontakt und Domain.
- `src/components/home.tsx`: Aufbau der Startseite.
- `src/app/globals.css`: Design, Typografie, responsive Layouts, Animationen.
- `src/app/themes.css`: vollständige Paletten für Papierweiß, Schwarz und Rot, einschließlich Katzenfacetten, Papierflächen und Bedienelementen.
- `src/components/theme-provider.tsx`: radiale Theme-Schockwelle mit der nativen View Transition API; zeitversetztes Zittern sichtbarer Buchstaben über die Web Animations API. Die Entfernung zur Katze bestimmt die Verzögerung.
- `src/components/paper-playground.tsx`: Origami-Katze aus CSS-Papierflächen mit Pointer-Reaktion, Kopfnicken und Schwanzbewegung beim Anklicken. Respektiert `prefers-reduced-motion`.
- `src/content/`: übernommene Impressums- und Datenschutztexte in Deutsch und Englisch, als lokale Inhalte in React-Seiten eingebunden.
- `public/assets/`: bestehende Game-Bilder und Markenassets.
- `public/assets/logo-mark.svg`: schlichter Origami-Katzenkopf von vorn mit zwei spitzen Ohren und drei Papierflächen, als Favicon verwendet. Navigation und Footer nutzen dasselbe Motiv als `PaperMark` mit den CSS-Farben des jeweiligen Themes; die Wortmarke „karigami.“ bleibt echter Text in Manrope. `apple-touch-icon.png` ist die auf Papierweiß gerenderte Variante für den Homescreen. Das ursprüngliche `logo.svg` bleibt als Referenz erhalten.
- `public/app-ads.txt`: unveränderte AdMob-Autorisierung.
- `src/lib/redirects.mjs`: permanente Weiterleitungen der alten HTML-URLs.
- `legacy/`: vollständige bisherige statische Website als Referenz. Dieser Ordner wird nicht veröffentlicht und nicht von Next.js gerendert.

Die Seiten werden beim Build statisch vorgerendert. Nur Menü, Origami-Katze und Kopieren der E-Mail-Adresse benötigen React im Browser. Beide Sprachen haben ein eigenes `html lang` und gegenseitige Sprachverweise. Schriftdateien und Bilder werden lokal ausgeliefert; es sind keine Analytics, Tracking-Cookies oder externen Schriftabrufe eingebaut. Der Kontakt läuft über E-Mail; es gibt kein vorgetäuschtes Kontaktformular.

Ein Klick auf die Katze wechselt Papierweiß → Schwarz → Rot → Papierweiß. Das gewählte Theme wird ausschließlich im Browser unter `karigami-theme` gespeichert und vor dem ersten Zeichnen wiederhergestellt, auch auf Rechtsseiten und nach einem Sprachwechsel. Bei gesperrtem Speicher funktioniert der Wechsel weiterhin. Schnell aufeinanderfolgende Klicks werden während der laufenden Welle ignoriert. Die Textspannen gehören React und behalten einen zusammenhängenden, zugänglichen Text für Screenreader. Bei `prefers-reduced-motion`, fehlender View Transition API oder abgebrochener Momentaufnahme erfolgt ein direkter Theme-Wechsel. `npm run test:theme` prüft Theme-Reihenfolge, Radius, Buchstaben-Timing, gespeicherte Einstellungen und Vollständigkeit der Paletten ohne laufenden Server.

## Übernommene Rechtstexte

Anbieterangaben und App-Angaben wurden aus der alten Website übernommen. Der Hosting-Abschnitt benennt jetzt Vercel und verlinkt dessen [Datenschutzhinweise](https://vercel.com/legal/privacy-notice). Das Änderungsdatum ist fest eingetragen und wird nicht mehr bei jedem Besuch künstlich aktualisiert.

**Vor der Veröffentlichung offen:** Der ursprüngliche Datenschutztext enthält eine Bearbeitungsanweisung zur noch zu ergänzenden AdMob-Einwilligungslösung (CMP/UMP). Die Bearbeitungsanweisung wurde aus der sichtbaren Website entfernt, die inhaltliche Lücke ist weiterhin offen. Die tatsächlich in den Apps eingesetzte Lösung, Anbieter, Zwecke und Rechtsgrundlage müssen vom Betreiber ergänzt werden. Auch die bisherigen Angaben zu Offline-Nutzung, In-App-Käufen und Push-Nachrichten sind übernommene Aussagen, keine Prüfung der Apps. Die Texte sind keine abgeschlossene rechtliche Prüfung.

## Social Preview

`public/og.png` ist die projektspezifische, visuell geprüfte Vorschaugrafik. Sie wurde mit dem integrierten Imagegen-Tool erstellt und in Open Graph und Twitter-Metadaten eingebunden. Sie zeigt bewusst die deutsche Markenbotschaft auch beim Teilen der englischen Seite.

Generierungsbrief: Landschaftskarte für karigami.games, warmes Papierweiß `#f7f5ef`, dunkle Manrope-artige Typografie, rote sitzende Origami-Katze mit feiner Kreislinie; Texte „karigami“, „Kleine Games. Große Spielfreude.“, „Indie Games von Kaan Gevrek“ und „karigami.games“. Keine zusätzlichen Texte oder UI-Elemente.

Die Katze wurde mit dem integrierten Imagegen-Tool als gezielter Austausch des ursprünglichen Flugzeugmotivs erstellt und in `public/og.png` gespeichert. Bearbeitungsprompt: „Replace only the large red origami paper airplane on the right with a beautiful sitting red origami CAT. The cat must be instantly recognizable: pointed triangular ears, angular folded-paper head, upright seated body, folded front paws, and a long upward-curving faceted tail on its right. Sophisticated minimalist real folded red paper, matte vermilion, crisp triangular facets, subtly lit from upper left, soft paper shadow. No drawn cartoon face, no fur. Give it curious gentle character with a slight head tilt. Fit it entirely in the same right-hand image area, without overlapping any typography. Preserve the exact original aspect ratio and canvas size if possible. Preserve ALL existing text exactly, all typography sizes/weights/positions, the warm ivory paper background, thin circular line behind the subject, and the composition. Text remains exactly \"karigami\", \"Kleine Games.\", \"Große\", \"Spielfreude.\", \"Indie Games von Kaan Gevrek\", \"karigami.games\". Do not add anything else.“

## Prüfung des Relaunchs

Produktionsbuild, ESLint und HTTP-Migrationstests sind die technischen Prüfungen. Eine interaktive Browserprüfung konnte in der Arbeitsumgebung mangels verbundenem Browser nicht durchgeführt werden. Vor dem Livegang daher die Darstellung auf Smartphone und Desktop sowie Menü, Origami-Katze, E-Mail-Kopieren und Tastaturbedienung im eigenen Browser ansehen.
