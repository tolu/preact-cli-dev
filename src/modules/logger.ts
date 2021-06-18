import loglevel from 'loglevel';

loglevel.setDefaultLevel(loglevel.levels.DEBUG);

let counter = 0;
const colors: ReadonlyArray<string> = ['hotpink', 'aqua', 'aquamarine', 'fuchsia', 'ghostwhite', 'lavenderblush', 'yellow', 'tomato', 'salmon', 'powderblue', 'palegreen'];
const getColor = () => colors[counter++ % colors.length] as string;
const colorMap = new Map<string, string>();

export const getLogger = (name: string): Pick<typeof loglevel, 'info' | 'error' | 'debug'> => {
  const clr = colorMap.has(name) ? colorMap.get(name) : colorMap.set(name, getColor()).get(name);
  const label = `%c[${name}]`;
  const style = `color: ${clr}; background: black; padding: 2px`;
  return {
    info: loglevel.info.bind(loglevel, label, style),
    error: loglevel.error.bind(loglevel, label, style),
    debug: loglevel.debug.bind(loglevel, label, style),
  }
}