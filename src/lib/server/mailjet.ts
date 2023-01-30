import Mailjet from "node-mailjet";
import { env } from "$env/dynamic/private";

export const mailjet = new Mailjet({
	apiKey: env.SECRET_MJ_API_KEY,
	apiSecret: env.SECRET_MJ_API_Secret,
});

export const HCNOTICES_MAILING_LIST_ID = "10278356";