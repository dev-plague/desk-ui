const useColor = process.stdout.isTTY && !process.env.NO_COLOR;

function wrap(code: string, text: string) {
  return useColor ? `\u001b[${code}m${text}\u001b[0m` : text;
}

export const color = {
  bold: (text: string) => wrap("1", text),
  cyan: (text: string) => wrap("36", text),
  green: (text: string) => wrap("32", text),
  yellow: (text: string) => wrap("33", text),
  red: (text: string) => wrap("31", text),
  dim: (text: string) => wrap("2", text),
};

export function line(text = "") {
  console.log(text);
}

export function heading(text: string) {
  console.log(`\n${color.bold(color.cyan(text))}`);
}
