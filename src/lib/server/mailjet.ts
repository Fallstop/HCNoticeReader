import Mailjet from "node-mailjet";
import { env } from "$env/dynamic/private";
import { building } from "$app/environment";

export let mailjet: Mailjet | null = null; 

export function ensureMailjet() {
	if (mailjet) return true;

	if (!building) {
		mailjet = new Mailjet({
			apiKey: env['SECRET_MJ_API_KEY'],
			apiSecret: env['SECRET_MJ_API_Secret'],
		});
		return true
	} else {
		return false;
	}
}

// Defaults to dev mail list
export const HCNOTICES_MAILING_LIST_ID = env['SECRET_MJ_MAILING_LIST_ID'] || "10290601";

export const EMAIL_MONTHLY_CAPACITY = 6000;
export const EMAIL_DAILY_CAPACITY = 200;

export const SIGNUP_KILL_SWITCH_PERCENTAGE = 0.95;