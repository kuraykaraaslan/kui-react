'use client';
// TODO M5: keyboard-driven card movement.
// API sketch:
//   useKeyboardMove({ focusedCardId, cards, columns, onCardMove });
//   // Cmd/Ctrl + ArrowLeft / ArrowRight  -> move card to prev/next column
//   // Cmd/Ctrl + ArrowUp   / ArrowDown   -> move card up/down in column
//   // Enter -> open detail (M4), Space -> toggle bulk select (M4).
export function useKeyboardMove() {
  // TODO M5: wire keydown listener to focused card, announce moves via LiveRegion.
  return {};
}
