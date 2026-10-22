import * as React from "react";

import { useDeskUILocale } from "../lib/i18n";
import { cn } from "../lib/utils";

export interface MinesweeperProps extends React.ComponentProps<"div"> {
  rows?: number;
  cols?: number;
  mines?: number;
  /** Mapa avanzado: cada fila usa `*` para mina y `.` para celda segura. */
  layout?: string[];
  seed?: number;
  onWin?: (elapsed: number) => void;
  onLose?: () => void;
}

type GameStatus = "ready" | "playing" | "won" | "lost";

interface Cell {
  mine: boolean;
  revealed: boolean;
  flagged: boolean;
  adjacent: number;
}

function mulberry32(seed: number) {
  return function random() {
    let next = (seed += 0x6d2b79f5);
    next = Math.imul(next ^ (next >>> 15), next | 1);
    next ^= next + Math.imul(next ^ (next >>> 7), next | 61);
    return ((next ^ (next >>> 14)) >>> 0) / 4294967296;
  };
}

function neighbours(index: number, rows: number, cols: number) {
  const row = Math.floor(index / cols);
  const col = index % cols;
  const result: number[] = [];

  for (let rowOffset = -1; rowOffset <= 1; rowOffset += 1) {
    for (let colOffset = -1; colOffset <= 1; colOffset += 1) {
      if (rowOffset === 0 && colOffset === 0) {
        continue;
      }
      const nextRow = row + rowOffset;
      const nextCol = col + colOffset;
      if (
        nextRow >= 0 &&
        nextRow < rows &&
        nextCol >= 0 &&
        nextCol < cols
      ) {
        result.push(nextRow * cols + nextCol);
      }
    }
  }

  return result;
}

function buildBoard({
  rows,
  cols,
  mines,
  layout,
  seed,
}: {
  rows: number;
  cols: number;
  mines: number;
  layout?: string[];
  seed: number;
}) {
  const total = rows * cols;
  const mineSet = new Set<number>();

  if (layout) {
    layout.forEach((line, row) => {
      line.split("").forEach((char, col) => {
        if (char === "*" && row < rows && col < cols) {
          mineSet.add(row * cols + col);
        }
      });
    });
  } else {
    const random = mulberry32(seed);
    while (mineSet.size < Math.min(mines, total)) {
      mineSet.add(Math.floor(random() * total));
    }
  }

  return Array.from({ length: total }, (_, index): Cell => {
    const mine = mineSet.has(index);
    const adjacent = mine
      ? 0
      : neighbours(index, rows, cols).filter((neighbour) =>
          mineSet.has(neighbour),
        ).length;

    return { mine, revealed: false, flagged: false, adjacent };
  });
}

function openSafeCells(board: Cell[], start: number, cols: number) {
  const next = board.map((cell) => ({ ...cell }));
  const rows = Math.ceil(next.length / cols);
  const stack = [start];

  while (stack.length > 0) {
    const index = stack.pop();
    if (index === undefined) {
      break;
    }
    const cell = next[index];
    if (!cell || cell.revealed || cell.flagged || cell.mine) {
      continue;
    }

    cell.revealed = true;
    if (cell.adjacent === 0) {
      const row = Math.floor(index / cols);
      const col = index % cols;
      for (let rowOffset = -1; rowOffset <= 1; rowOffset += 1) {
        for (let colOffset = -1; colOffset <= 1; colOffset += 1) {
          const nextRow = row + rowOffset;
          const nextCol = col + colOffset;
          if (
            nextRow >= 0 &&
            nextRow < rows &&
            nextCol >= 0 &&
            nextCol < cols
          ) {
            stack.push(nextRow * cols + nextCol);
          }
        }
      }
    }
  }

  return next;
}

const NUMBER_CLASSES = [
  "",
  "text-link",
  "text-success",
  "text-danger",
  "text-accent",
  "text-warning",
  "text-info",
  "text-ink",
  "text-ink-muted",
];

/**
 * Buscaminas clásico. Acepta un `layout` de filas con `*` y `.` para pruebas y
 * demos deterministas, o genera un tablero con `rows`, `cols`, `mines` y `seed`.
 */
export const Minesweeper = React.forwardRef<HTMLDivElement, MinesweeperProps>(
  (
    {
      className,
      rows = 9,
      cols = 9,
      mines = 10,
      layout,
      seed = 1,
      onWin,
      onLose,
      ...props
    },
    ref,
  ) => {
    const { messages } = useDeskUILocale();
    const labels = messages.minesweeper;
    const boardRows = layout?.length ?? rows;
    const boardCols = layout?.[0]?.length ?? cols;
    const mineCount = layout
      ? layout.join("").split("").filter((char) => char === "*").length
      : mines;

    const [board, setBoard] = React.useState(() =>
      buildBoard({
        rows: boardRows,
        cols: boardCols,
        mines: mineCount,
        layout,
        seed,
      }),
    );
    const [status, setStatus] = React.useState<GameStatus>("ready");
    const [flags, setFlags] = React.useState(0);
    const [elapsed, setElapsed] = React.useState(0);
    const [round, setRound] = React.useState(0);

    React.useEffect(() => {
      if (status !== "playing") {
        return;
      }
      const timer = window.setInterval(() => {
        setElapsed((value) => value + 1);
      }, 1000);
      return () => window.clearInterval(timer);
    }, [status]);

    function reset() {
      const nextRound = round + 1;
      setRound(nextRound);
      setBoard(
        buildBoard({
          rows: boardRows,
          cols: boardCols,
          mines: mineCount,
          layout,
          seed: seed + nextRound,
        }),
      );
      setStatus("ready");
      setFlags(0);
      setElapsed(0);
    }

    function reveal(index: number) {
      if (status === "won" || status === "lost") {
        return;
      }
      const cell = board[index];
      if (!cell || cell.revealed || cell.flagged) {
        return;
      }

      if (status === "ready") {
        setStatus("playing");
      }

      if (cell.mine) {
        setBoard(
          board.map((item) =>
            item.mine ? { ...item, revealed: true } : item,
          ),
        );
        setStatus("lost");
        onLose?.();
        return;
      }

      const next = openSafeCells(board, index, boardCols);
      setBoard(next);
      if (next.every((item) => item.mine || item.revealed)) {
        setStatus("won");
        onWin?.(elapsed);
      }
    }

    function toggleFlag(index: number) {
      if (status === "won" || status === "lost") {
        return;
      }
      const cell = board[index];
      if (!cell || cell.revealed) {
        return;
      }

      const flagged = !cell.flagged;
      setBoard(
        board.map((item, itemIndex) =>
          itemIndex === index ? { ...item, flagged } : item,
        ),
      );
      setFlags((value) => value + (flagged ? 1 : -1));
    }

    function cellLabel(cell: Cell, index: number) {
      const row = Math.floor(index / boardCols) + 1;
      const col = (index % boardCols) + 1;
      if (cell.flagged) {
        return labels.flaggedCell(row, col);
      }
      if (!cell.revealed) {
        return labels.hiddenCell(row, col);
      }
      if (cell.mine) {
        return labels.mineCell(row, col);
      }
      return labels.adjacentCell(row, col, cell.adjacent);
    }

    const statusText =
      status === "won"
        ? labels.won
        : status === "lost"
          ? labels.lost
          : status === "playing"
            ? labels.playing
            : labels.ready;

    return (
      <div
        ref={ref}
        data-slot="minesweeper"
        aria-label={labels.label}
        className={cn(
          "inline-flex max-w-full flex-col gap-1 bg-surface p-1 text-ink",
          className,
        )}
        {...props}
      >
        <div className="bevel-sunken flex items-center gap-2 bg-surface p-1">
          <span
            aria-label={labels.minesLeft(mineCount - flags)}
            className="bevel-field min-w-[42px] bg-terminal px-1 text-center font-mono text-[14px] leading-[20px] text-terminal-accent"
          >
            {String(mineCount - flags).padStart(3, "0")}
          </span>
          <button
            type="button"
            aria-label={labels.newGame}
            onClick={reset}
            className="bevel-raised grid h-7 w-7 place-items-center bg-surface text-[14px] leading-none active:bevel-sunken focus-visible:focus-dotted focus-visible:outline-offset-[-2px]"
          >
            {status === "lost" ? "☹" : status === "won" ? "😎" : "🙂"}
          </button>
          <span
            aria-label={labels.seconds(elapsed)}
            className="bevel-field min-w-[42px] bg-terminal px-1 text-center font-mono text-[14px] leading-[20px] text-terminal-accent"
          >
            {String(elapsed).padStart(3, "0")}
          </span>
          <span role="status" className="sr-only">
            {statusText}
          </span>
        </div>

        <div
          role="group"
          aria-label={labels.boardLabel}
          className="grid gap-[1px] overflow-auto"
          style={{
            gridTemplateColumns: `repeat(${boardCols}, 20px)`,
          }}
        >
          {board.map((cell, index) => (
            <button
              key={index}
              type="button"
              aria-label={cellLabel(cell, index)}
              aria-pressed={cell.flagged || undefined}
              onClick={() => reveal(index)}
              onContextMenu={(event) => {
                event.preventDefault();
                toggleFlag(index);
              }}
              onKeyDown={(event) => {
                if (event.key.toLowerCase() === "f") {
                  event.preventDefault();
                  toggleFlag(index);
                }
              }}
              className={cn(
                "grid h-5 w-5 place-items-center text-[11px] leading-none",
                "focus-visible:focus-dotted focus-visible:outline-offset-[-2px]",
                cell.revealed
                  ? "bevel-field bg-surface-pressed"
                  : "bevel-raised bg-surface active:bevel-sunken",
                cell.revealed && cell.mine && "text-danger",
                cell.revealed &&
                  !cell.mine &&
                  cell.adjacent > 0 &&
                  NUMBER_CLASSES[cell.adjacent],
              )}
            >
              {cell.flagged && !cell.revealed ? (
                <span aria-hidden="true">⚑</span>
              ) : cell.revealed ? (
                cell.mine ? (
                  <span aria-hidden="true">✹</span>
                ) : cell.adjacent > 0 ? (
                  cell.adjacent
                ) : null
              ) : null}
            </button>
          ))}
        </div>

        <p className="m-0 text-center text-[10px] leading-[13px] text-ink-muted">
          {statusText} · {labels.hint}
        </p>
      </div>
    );
  },
);

Minesweeper.displayName = "Minesweeper";
