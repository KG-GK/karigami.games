import { gameData, type Locale } from "./content";

export type StoryImage = { src: string; width: number; height: number; alt: string };
export type StoryText = { text: string; href?: string };
export type ProjectStory = {
  id: string;
  title: string;
  category: string;
  images: StoryImage[];
  icon?: StoryImage;
  paragraphs: StoryText[][];
  playUrl?: string;
  stores?: { href: string; label: string }[];
};

export function projectStories(locale: Locale): ProjectStory[] {
  const de = locale === "de";
  const games = gameData(locale);
  const image = (file: string, width: number, height: number, en: string, german: string): StoryImage => ({
    src: `/assets/stories/${file}`, width, height, alt: de ? german : en,
  });
  const paragraph = (text: string): StoryText[] => [{ text }];
  const storeLinks = (id: string) => {
    const game = games.find((entry) => entry.id === id)!;
    return [{ href: game.url, label: "App Store" }, { href: game.androidUrl, label: "Google Play" }];
  };

  return [
    {
      id: "mice-rise", title: "Mice Rise", category: de ? "Der Anfang · Uni-Projekt" : "The beginning · University project",
      images: [image("Mice-Rise-Screenshot.png", 1543, 962, "Pixel-art mice facing a swordsman in a dungeon", "Pixel-Mäuse vor einem Schwertkämpfer in einem Dungeon")],
      icon: image("MiceRiseIcon.png", 310, 247, "Mice Rise — a crowned mouse", "Mice Rise — eine gekrönte Maus"),
      paragraphs: [paragraph(de
        ? "Mein allererstes Spiel, entstanden in einem Uni-Kurs. Mein Bruder und ich haben eine alberne Idee genommen und ein Spiel daraus gemacht. Sogar die Musik stammt von uns! Das hat ziemlich viel Spaß gemacht."
        : "My very first game, made for a university course. My brother and I took a silly idea and turned it into a game. We even made the music ourselves! It was a lot of fun.")],
      playUrl: "https://karigami.itch.io/micerise-prototype",
    },
    {
      id: "creator-studio", title: "CreatorStudio", category: de ? "Zusammen weiterdenken" : "Making things together",
      images: [], icon: image("CreatorStudio-Icon.png", 256, 243, "CreatorStudio logo", "CreatorStudio-Logo"),
      paragraphs: [paragraph(de
        ? "Nach Mice Rise wollten wir als Hobby weiter Spiele entwickeln. Also haben wir andere eingeladen, gemeinsam mit uns Games zu machen. Daraus ist CreatorStudio entstanden — und eine ganze Menge Prototypen!"
        : "After Mice Rise, we wanted to keep making games as a hobby. So we invited others to join us and make games together. That became CreatorStudio — and led to a whole lot of prototypes!")],
    },
    {
      id: "dungeon-forge", title: "Dungeon Forge", category: de ? "Eine Lektion über Scope" : "A lesson in scope",
      images: [image("Dungeon-Forge-Collage.png", 1396, 988, "Dungeon Forge characters, environments, and 3D assets", "Charaktere, Umgebungen und 3D-Assets aus Dungeon Forge")],
      paragraphs: [paragraph(de
        ? "Unsere erste Begegnung mit der Development Hell: Mit jedem Treffen wurde das Projekt gefühlt doppelt so groß, bis wir genug hatten und es eingestampft haben."
        : "Our first encounter with development hell. With every meeting, the scope seemed to double, until we finally called it quits and scrapped the project."),
      paragraph(de
        ? "Immerhin haben wir jetzt jede Menge Assets, die in zukünftigen Projekten noch ein Zuhause finden könnten. Über Scope-Management habe ich hier definitiv etwas gelernt …"
        : "On the bright side, we now have a lot of assets that might find a home in future projects. I definitely learned a thing or two about scope management here…")],
    },
    {
      id: "bullet-rhapsody", title: "Bullet Rhapsody", category: de ? "Ein musikalisches Experiment" : "A musical experiment",
      images: [image("Bullet-Rhapsody-Bild.png", 1097, 773, "A trumpet firing notes along a keyboard in Bullet Rhapsody", "Eine Trompete schießt Noten entlang einer Klaviertastatur in Bullet Rhapsody")],
      paragraphs: [paragraph(de
        ? "Bei diesem Projekt haben wir mit MIDI-Dateien und dynamisch einsetzenden Instrumentenspuren experimentiert. Sogar die Ventile der Trompete bewegen sich beim Schießen passend zu den gespielten Noten!"
        : "This project was an experiment with MIDI files and instrument tracks that come in dynamically. Even the trumpet’s valves move to match the notes as you shoot!"),
      paragraph(de
        ? "Von einem fertigen Spiel ist es weit entfernt, aber als kleines Experiment hat es viel Spaß gemacht."
        : "It’s a long way from a fully playable game, but it was a fun little experiment.")],
      playUrl: "https://karigami.itch.io/bullet-rhapsody",
    },
    {
      id: "pocketwars", title: "PocketWars", category: de ? "Mein erstes Solo-Projekt" : "My first solo project",
      images: [], icon: { src: games[0].image, width: 500, height: 500, alt: "PocketWars app icon" },
      paragraphs: [paragraph(de
        ? "Mein erstes Solo-Projekt hat etwas länger gedauert: Ich habe dabei ein dynamisches Stil-System entwickelt, mit dem Spieler zwischen vielen verschiedenen Grafikstilen wählen können. Und dann habe ich auch noch sämtliche Grafiken selbst gemacht …"
        : "My first solo project took a while. I used it to develop a dynamic style system that lets players choose between lots of different art styles. And then I made all the graphics myself, too…")],
      stores: storeLinks("pocketwars"),
    },
    {
      id: "boosthammer", title: "BoostHammer", category: de ? "Ein Hammer. Ein Raketenantrieb." : "One hammer. One rocket booster.",
      images: [], icon: { src: games[1].image, width: 500, height: 500, alt: "BoostHammer app icon" },
      paragraphs: [paragraph(de
        ? "Während der Arbeit an PocketWars brauchte ich mal frischen Wind. Also habe ich mich herausgefordert, so schnell wie möglich ein weiteres Mobile Game zu entwickeln."
        : "While working on PocketWars, I needed a breath of fresh air. So I challenged myself to develop another mobile game as quickly as possible."),
      paragraph(de
        ? "Diesmal sollte es eine herrlich dumme, einfache Idee sein — nach der komplexen Entwicklung von PocketWars. Geworden ist es ein Hammer mit Raketenantrieb. :D"
        : "This time, I wanted a wonderfully stupid, simple idea after the complexity of PocketWars. So I went with a hammer strapped to a rocket booster. :D")],
      stores: storeLinks("thrusthammer"),
    },
    {
      id: "aura-farmer", title: "AuraFarmer", category: de ? "VR · Master-Projekt" : "VR · Master’s course project",
      images: [
        image("AuraFarmer-Pflanzenpflege.png", 492, 358, "Tending crops with a spray can in AuraFarmer VR", "Pflanzenpflege mit einer Sprühdose in AuraFarmer VR"),
        image("AuraFarmer-Handschuh.png", 742, 473, "A glove displays the garden’s water, pesticide, and crop inventory", "Ein Handschuh zeigt Wasser, Pflanzenschutz und Erntebestand an"),
        image("AuraFarmer-Nachfüllstationen.png", 558, 405, "Refill stations for water and plant care supplies", "Nachfüllstationen für Wasser und Pflanzenpflege"),
      ],
      paragraphs: [paragraph(de
        ? "Ein VR-Projekt aus einem Kurs im Masterstudium: Wir haben einen Garten simuliert, in dem Nutzpflanzen wachsen. Kümmere dich um sie — sonst gehen sie ein!"
        : "A VR project for a university master’s course, simulating a garden full of growing crops. Take care of your plants — or they won’t make it!")],
    },
    {
      id: "your-crew", title: "Your Crew is a useless bunch", category: "Brackeys Game Jam 2026.2",
      images: [image("Your-Crew-Cover.png", 630, 500, "A sleepy pirate crew aboard a ship in Your Crew is a useless bunch", "Eine schläfrige Piratencrew auf dem Schiff in Your Crew is a useless bunch")],
      paragraphs: [[
        { text: de ? "Ein Freund von mir (" : "A friend of mine (" },
        { text: "Zerotwopac", href: "https://zerotwopac.itch.io/" },
        { text: de ? ") und ich haben dieses kleine Spiel in effektiv nur drei bis vier Tagen für die " : ") and I made this little game in just three to four days of actual development for " },
        { text: "Brackeys Game Jam 2026.2", href: "https://itch.io/jam/brackeys-16/rate/4951915" },
        { text: de ? " entwickelt." : "." },
      ], paragraph(de
        ? "Es war ein ziemlicher Endspurt, weil wir beide gleichzeitig noch jede Menge andere Dinge zu tun hatten. Irgendwie haben wir es trotzdem geschafft, etwas ganz Anständiges auf die Beine zu stellen!"
        : "It was quite a scramble, since we both had a lot of other things going on. Somehow, we still managed to make something half-decent!")],
      playUrl: "https://karigami.itch.io/your-crew-is-a-useless-bunch",
    },
  ];
}
