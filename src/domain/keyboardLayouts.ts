import type { KeyboardLayout, KeyboardQuarter, KeyboardRow, LayoutId } from "./types";

function key(
  letter: string,
  display: string,
  code: string,
  row: KeyboardRow,
  quarter: KeyboardQuarter,
  unlockOrder: number
) {
  return { letter, display, code, row, quarter, unlockOrder };
}

export const keyboardLayouts: Record<LayoutId, KeyboardLayout> = {
  ru: {
    id: "ru",
    label: "Русская",
    keys: [
      key("ё", "Ё", "Backquote", "top", "left", 29),
      key("й", "Й", "KeyQ", "top", "left", 13),
      key("ц", "Ц", "KeyW", "top", "left", 14),
      key("у", "У", "KeyE", "top", "centerLeft", 5),
      key("к", "К", "KeyR", "top", "centerLeft", 3),
      key("е", "Е", "KeyT", "top", "centerLeft", 7),
      key("н", "Н", "KeyY", "top", "centerRight", 8),
      key("г", "Г", "KeyU", "top", "centerRight", 15),
      key("ш", "Ш", "KeyI", "top", "centerRight", 21),
      key("щ", "Щ", "KeyO", "top", "right", 22),
      key("з", "З", "KeyP", "top", "right", 20),
      key("х", "Х", "BracketLeft", "top", "right", 30),
      key("ъ", "Ъ", "BracketRight", "top", "right", 31),
      key("ф", "Ф", "KeyA", "home", "left", 16),
      key("ы", "Ы", "KeyS", "home", "left", 10),
      key("в", "В", "KeyD", "home", "centerLeft", 2),
      key("а", "А", "KeyF", "home", "centerLeft", 1),
      key("п", "П", "KeyG", "home", "centerLeft", 9),
      key("р", "Р", "KeyH", "home", "centerRight", 6),
      key("о", "О", "KeyJ", "home", "centerRight", 4),
      key("л", "Л", "KeyK", "home", "centerRight", 11),
      key("д", "Д", "KeyL", "home", "right", 12),
      key("ж", "Ж", "Semicolon", "home", "right", 32),
      key("э", "Э", "Quote", "home", "right", 33),
      key("я", "Я", "KeyZ", "bottom", "left", 17),
      key("ч", "Ч", "KeyX", "bottom", "left", 18),
      key("с", "С", "KeyC", "bottom", "centerLeft", 19),
      key("м", "М", "KeyV", "bottom", "centerLeft", 23),
      key("и", "И", "KeyB", "bottom", "centerLeft", 24),
      key("т", "Т", "KeyN", "bottom", "centerRight", 25),
      key("ь", "Ь", "KeyM", "bottom", "centerRight", 26),
      key("б", "Б", "Comma", "bottom", "right", 27),
      key("ю", "Ю", "Period", "bottom", "right", 28)
    ]
  },
  en: {
    id: "en",
    label: "English",
    keys: [
      key("q", "Q", "KeyQ", "top", "left", 13),
      key("w", "W", "KeyW", "top", "left", 14),
      key("e", "E", "KeyE", "top", "centerLeft", 5),
      key("r", "R", "KeyR", "top", "centerLeft", 3),
      key("t", "T", "KeyT", "top", "centerLeft", 7),
      key("y", "Y", "KeyY", "top", "centerRight", 8),
      key("u", "U", "KeyU", "top", "centerRight", 15),
      key("i", "I", "KeyI", "top", "centerRight", 21),
      key("o", "O", "KeyO", "top", "right", 4),
      key("p", "P", "KeyP", "top", "right", 20),
      key("a", "A", "KeyA", "home", "left", 1),
      key("s", "S", "KeyS", "home", "left", 10),
      key("d", "D", "KeyD", "home", "centerLeft", 2),
      key("f", "F", "KeyF", "home", "centerLeft", 6),
      key("g", "G", "KeyG", "home", "centerLeft", 9),
      key("h", "H", "KeyH", "home", "centerRight", 11),
      key("j", "J", "KeyJ", "home", "centerRight", 12),
      key("k", "K", "KeyK", "home", "centerRight", 16),
      key("l", "L", "KeyL", "home", "right", 17),
      key("z", "Z", "KeyZ", "bottom", "left", 18),
      key("x", "X", "KeyX", "bottom", "left", 19),
      key("c", "C", "KeyC", "bottom", "centerLeft", 22),
      key("v", "V", "KeyV", "bottom", "centerLeft", 23),
      key("b", "B", "KeyB", "bottom", "centerLeft", 24),
      key("n", "N", "KeyN", "bottom", "centerRight", 25),
      key("m", "M", "KeyM", "bottom", "centerRight", 26)
    ]
  }
};
