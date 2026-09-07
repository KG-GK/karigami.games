(() => {
  const touchQuery = window.matchMedia("(hover: none), (pointer: coarse)");
  const cards = Array.from(document.querySelectorAll(".gameCard"));

  if (!cards.length) {
    return;
  }

  const isTapMode = () => touchQuery.matches;

  const closeCards = (except) => {
    cards.forEach((card) => {
      if (card !== except) {
        card.classList.remove("isTapped");
      }
    });
  };

  cards.forEach((card) => {
    card.addEventListener("click", (event) => {
      if (!isTapMode()) {
        return;
      }

      if (event.target.closest(".storeTile")) {
        return;
      }

      const shouldOpen = !card.classList.contains("isTapped");
      closeCards(card);
      card.classList.toggle("isTapped", shouldOpen);
    });
  });

  document.addEventListener("click", (event) => {
    if (!isTapMode() || event.target.closest(".gameCard")) {
      return;
    }

    closeCards();
  });

  window.addEventListener("resize", () => {
    if (!isTapMode()) {
      closeCards();
    }
  });
})();
