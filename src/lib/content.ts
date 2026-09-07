export type Locale = "de" | "en";

export const site = {
  name: "Karigami",
  author: "Kaan Gevrek",
  email: "contact@karigami.games",
  url: "https://www.karigami.games",
  itch: "https://karigami.itch.io/",
};

export const content = {
  de: {
    home: "/", otherLocale: "/en", otherLanguage: "Read in English",
    aboutNav: "Über mich", contactNav: "Kontakt", menu: "Menü öffnen", closeMenu: "Menü schließen", skip: "Zum Inhalt",
    eyebrow: "UNABHÄNGIG ENTWICKELT. MIT CHARAKTER.",
    headline: ["Kleine Games.", "Große", "Spielfreude."],
    intro: "Aus seltsamen Ideen werden kleine Welten. Ich bin Kaan und entwickle Spiele, die ich selbst gerne spielen würde.",
    explore: "Entdecke die Games", meet: "Lerne mich kennen",
    location: "INDIE GAMES AUS HANNOVER", scroll: "WEITERSPIELEN",
    flight: "Klicken. Fliegen lassen.", flightLabel: "Papierflieger fliegen lassen", flightDone: "Und noch eine Runde?", flightNote: "JEDE IDEE FÄNGT KLEIN AN.",
    strip: ["AUS NEUGIER GEMACHT", "FÜR SPIELFREUDE GEBAUT", "EIN BISSCHEN EIGENSINN"],
    gamesLabel: "01 / DIE GAMES", gamesTitle: "Kleine Welten.\nEigene Regeln.",
    gamesIntro: "Zwei Ideen, die nicht auf dem Papier geblieben sind. Finde dein nächstes Spiel für zwischendurch.",
    appStore: "Im App Store", androidSoon: "Android in Planung", offline: "Auch offline spielbar",
    pocketDescription: "PocketWars für die Hosentasche. Deine nächste Runde ist immer nur einen Fingertipp entfernt.",
    hammerDescription: "Ein Hammer mit Raketenantrieb. Manchmal braucht eine Spielidee nicht mehr, um loszufliegen.",
    itchHeading: "Noch neugierig?", itchDescription: "Mehr von Karigami findest du auf itch.io.", itchCta: "Zu meinem itch.io",
    aboutLabel: "02 / DER MENSCH DAHINTER", aboutTitle: "Hi, ich bin Kaan.",
    aboutLead: "Ein Entwickler. Viele Ideen.\nUnd die Lust, sie spielbar zu machen.",
    aboutBody: "Karigami ist mein Platz für Games, auf die ich gerade Lust habe. Meistens sind es seltsame Ideen, die mir unter der Dusche einfallen. Oder Dinge, von denen ich mir wünsche, dass es sie schon gäbe.",
    aboutEnd: "Von der ersten Idee bis zum letzten Feinschliff: Ich mache Spiele, weil ich Spiele liebe. Schön, dass du hier bist.",
    maker: "DER KOPF HINTER KARIGAMI", note: "Gute Ideen passen\nauf ein Blatt Papier.", noteFooter: "DER REST IST AUSPROBIEREN.",
    contactLabel: "03 / KONTAKT & SUPPORT", contactTitle: "Lass von dir hören.",
    contactBody: "Eine Frage, eine Idee oder etwas, das im Spiel nicht rundläuft? Schreib mir.",
    copy: "E-Mail-Adresse kopieren", copied: "Adresse kopiert!", copyFailed: "Bitte die E-Mail-Adresse direkt kopieren.",
    supportNote: "Bei Support-Anfragen helfen mir der Spielname, dein Gerät, die OS-Version und eine kurze Beschreibung.",
    footerLine: "Kleine Games. Mit viel Herz.", privacy: "Datenschutz", imprint: "Impressum", privacyPath: "/datenschutz", imprintPath: "/impressum",
    back: "Zurück zur Startseite", legalLabel: "DAS KLEINGEDRUCKTE", contents: "Auf dieser Seite",
  },
  en: {
    home: "/en", otherLocale: "/", otherLanguage: "Auf Deutsch lesen",
    aboutNav: "About me", contactNav: "Contact", menu: "Open menu", closeMenu: "Close menu", skip: "Skip to content",
    eyebrow: "INDEPENDENTLY MADE. FULL OF CHARACTER.",
    headline: ["Little games.", "Big on", "play."],
    intro: "Turning curious ideas into little worlds. I’m Kaan, and I make the games I’d love to play myself.",
    explore: "Explore the games", meet: "Meet the maker",
    location: "INDIE GAMES FROM HANNOVER", scroll: "KEEP PLAYING",
    flight: "Click. Let it fly.", flightLabel: "Launch the paper plane", flightDone: "One more flight?", flightNote: "EVERY IDEA STARTS SMALL.",
    strip: ["MADE OUT OF CURIOSITY", "BUILT FOR THE JOY OF PLAY", "A LITTLE DIFFERENT"],
    gamesLabel: "01 / THE GAMES", gamesTitle: "Little worlds.\nTheir own rules.",
    gamesIntro: "Two ideas that made it off the page. Find your next game for those in-between moments.",
    appStore: "View on App Store", androidSoon: "Android planned", offline: "Playable offline, too",
    pocketDescription: "PocketWars, right in your pocket. Your next round is always just a tap away.",
    hammerDescription: "A rocket-powered hammer. Sometimes that’s all a game idea needs to take flight.",
    itchHeading: "Still curious?", itchDescription: "Find more from Karigami on itch.io.", itchCta: "Visit my itch.io",
    aboutLabel: "02 / THE PERSON BEHIND THE GAMES", aboutTitle: "Hi, I’m Kaan.",
    aboutLead: "One developer. Plenty of ideas.\nAnd a drive to make them playable.",
    aboutBody: "Karigami is my space for the games I feel like making. Usually, they start as strange ideas that come to me in the shower. Or things I wish already existed.",
    aboutEnd: "From the first idea to the finishing touches: I make games because I love games. Glad you’re here.",
    maker: "THE MIND BEHIND KARIGAMI", note: "Good ideas fit\non a sheet of paper.", noteFooter: "THE REST IS EXPERIMENTING.",
    contactLabel: "03 / CONTACT & SUPPORT", contactTitle: "Let’s hear from you.",
    contactBody: "A question, an idea, or something in a game not quite working? Drop me a line.",
    copy: "Copy email address", copied: "Address copied!", copyFailed: "Please copy the email address directly.",
    supportNote: "For support, please include the game, your device, OS version, and a short description of the issue.",
    footerLine: "Little games. A lot of heart.", privacy: "Privacy", imprint: "Imprint", privacyPath: "/en/privacy", imprintPath: "/en/imprint",
    back: "Back to the homepage", legalLabel: "THE SMALL PRINT", contents: "On this page",
  },
} as const;

export function gameData(locale: Locale) {
  const t = content[locale];
  return [
    { id: "pocketwars", number: "01", name: "PocketWars", subtitle: "FRONTLINES", image: "/assets/Pocketwars_widget.png", description: t.pocketDescription, url: "https://apps.apple.com/de/app/pocketwars-frontlines/id6760602813" },
    { id: "thrusthammer", number: "02", name: "ThrustHammer", subtitle: "READY FOR LIFTOFF", image: "/assets/ThrustHammer_widget.png", description: t.hammerDescription, url: "https://apps.apple.com/de/app/thrusthammer/id6769060279" },
  ];
}
