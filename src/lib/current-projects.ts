import type { Locale } from "./content";

export function currentProjects(locale: Locale) {
  const de = locale === "de";
  return [
    {
      id: "adeltuner",
      name: "Adeltuner",
      category: de ? "3D-EXPLORATION & MAGIE" : "3D EXPLORATION & MAGIC",
      description: de
        ? "Ein wissensbasiertes 3D-Erkundungsspiel rund um die Simulation von Magie. Mein bisher größtes Projekt – und eines, das wohl noch ein paar Jahre brauchen wird, bis es das Licht der Welt erblickt."
        : "A knowledge-based 3D exploration game built around magic simulation. My largest project so far — and one that will probably take a few more years to see the light of day.",
      images: [
        { src: "/assets/projects/adeltuner-1.png", width: 1037, height: 723, alt: de ? "Ein magischer Stab erzeugt eine violette Kugel über einem sonnigen Waldweg in Adeltuner." : "A magic staff conjures a violet orb above a sunlit forest path in Adeltuner." },
        { src: "/assets/projects/adeltuner-2.png", width: 990, height: 767, alt: de ? "Feuer breitet sich in einem Baum aus; ein aufgeschlagenes Zauberbuch zeigt das Feuersymbol." : "Fire spreads through a tree as an open spellbook displays a fire symbol." },
        { src: "/assets/projects/adeltuner-3.png", width: 1219, height: 761, alt: de ? "Ein Wasserzauber bildet eine große türkisgrüne Kugel vor dem magischen Stab." : "A water spell forms a large turquoise-green sphere in front of the magic staff." },
        { src: "/assets/projects/adeltuner-4.png", width: 2075, height: 1166, alt: de ? "Blick über einen sonnigen Wald auf eine Burg und ein Dorf in Adeltuner." : "A view across a sunlit forest toward a castle and village in Adeltuner." },
      ],
    },
    {
      id: "worldbuilder",
      name: "WorldBuilder",
      category: "GAME DESIGN & WORLDBUILDING",
      description: de
        ? "Ein Tool für Game Design und Worldbuilding. Ursprünglich für Adeltuner entwickelt, um die komplexen Gameplay- und Erzählsysteme zu planen und ihre Zusammenhänge im Blick zu behalten."
        : "A tool for game design and worldbuilding. Originally created for Adeltuner to help plan its intricate gameplay and narrative systems, and keep track of how everything connects.",
      images: [
        { src: "/assets/projects/worldbuilder.png", width: 1144, height: 883, alt: de ? "WorldBuilder zeigt eine bearbeitbare 3D-Dorfkarte mit markierten Orten, Charakteren und Begegnungen." : "WorldBuilder shows an editable 3D village map with labeled locations, characters, and encounters." },
      ],
    },
    {
      id: "scorewriter",
      name: "ScoreWriter",
      category: de ? "KI & MUSIKKOMPOSITION" : "AI & MUSIC COMPOSITION",
      description: de
        ? "Ein experimentelles KI-Kompositionstool, das Komponierende im kreativen Prozess unterstützt, statt einfach nur fertige KI-Musik auszugeben."
        : "An experimental AI composition tool designed to support composers in their creative process, rather than simply generate finished music.",
      images: [
        { src: "/assets/projects/scorewriter.png", width: 516, height: 359, alt: de ? "ScoreWriter-Schriftzug auf einem schwarz-weißen Punktraster." : "The ScoreWriter wordmark on a black-and-white halftone pattern." },
      ],
    },
    {
      id: "gravity-puzzle",
      name: "Gravity Puzzle",
      category: de ? "PHYSIK & KNOBELN" : "PHYSICS & PUZZLES",
      status: de ? "Spiel fertig · Veröffentlichung offen" : "Game complete · Release pending",
      description: de
        ? "Manche Blöcke fallen, andere nicht – und einige haben besondere Effekte. Das Spiel selbst ist fertig. Mir fehlt gerade nur die Energie, mich um die Einrichtung für die App-Stores, Playtests und Freigaben zu kümmern."
        : "Some blocks fall, some don’t, and some have special effects. The game itself is finished, but I haven’t yet found the energy to tackle app store setup, playtesting, and approval.",
      images: [
        { src: "/assets/projects/gravity-puzzle.png", width: 591, height: 578, alt: de ? "Ein quadratisches Gravity-Puzzle-Spielfeld mit braunen Blöcken und einer hellen Kugel in der oberen linken Ecke." : "A square Gravity Puzzle board with brown blocks and a glowing ball in the top-left corner." },
      ],
    },
  ];
}
