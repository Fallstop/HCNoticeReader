import dayjs, { Dayjs } from "dayjs";

export type NormalisedDate = `${number}-${number}-${number}`;

export const formatDate = (date: Date | Dayjs): NormalisedDate => { return dayjs(date).format("YYYY-MM-DD") as NormalisedDate };