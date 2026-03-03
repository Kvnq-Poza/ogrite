export type LogLevel = "silent" | "error" | "warn" | "info" | "debug";

const LEVEL_ORDER: Record<LogLevel, number> = {
  silent: 0,
  error: 1,
  warn: 2,
  info: 3,
  debug: 4,
};

export interface Logger {
  info(msg: string, ...args: unknown[]): void;
  debug(msg: string, ...args: unknown[]): void;
  error(msg: string, ...args: unknown[]): void;
  warn(msg: string, ...args: unknown[]): void;
}

export function createLogger(level: LogLevel = "info"): Logger {
  const threshold = LEVEL_ORDER[level];

  const noop = () => {};

  return {
    info:
      threshold >= LEVEL_ORDER.info
        ? (msg, ...args) => console.log(`[ogrite] ${msg}`, ...args)
        : noop,
    debug:
      threshold >= LEVEL_ORDER.debug
        ? (msg, ...args) => console.log(`[ogrite:debug] ${msg}`, ...args)
        : noop,
    error: (msg, ...args) => console.error(`[ogrite:error] ${msg}`, ...args),
    warn: (msg, ...args) => console.warn(`[ogrite:warn] ${msg}`, ...args),
  };
}
