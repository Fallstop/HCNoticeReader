import NodeCache from "node-cache";
export const memCache = new NodeCache({ stdTTL: 60 * 60, checkperiod: 60 * 60 * 0.2, useClones: false });