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
  ];
}
