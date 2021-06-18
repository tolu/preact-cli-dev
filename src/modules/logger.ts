import loglevel from 'loglevel';

loglevel.setDefaultLevel(loglevel.levels.INFO);

export const getLogger = (name: string): Pick<typeof loglevel, 'info' | 'error'> => {
  const label = `${name}:`;
  return {
    info: (...msg: any[]) => loglevel.info(label, ...msg),
    error: (...msg: any[]) => loglevel.error(label, ...msg),
  }
}