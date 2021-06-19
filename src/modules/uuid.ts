import { DOM } from "./DOM";

// https://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid
export const createUuidV4 = (): Readonly<string> => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

const getDeviceId = () => {
  let deviceId = DOM.localStorage.getItem('app.deviceId');
  if (deviceId === null) {
    deviceId = createUuidV4();
    DOM.localStorage.setItem('app.deviceId', deviceId);
  }
  return deviceId;
}

// TODO export immutable (readonly) somehow
export const sessionId: Readonly<string> = createUuidV4();

export const deviceId: Readonly<string> = getDeviceId();
