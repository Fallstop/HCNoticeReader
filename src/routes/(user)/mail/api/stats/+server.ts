import type { RequestEvent } from "@sveltejs/kit";

import { EMAIL_DAILY_CAPACITY, SIGNUP_KILL_SWITCH_PERCENTAGE } from "$lib/server/mailjet";
import { getContactListLength, getEmailsLastMonth } from "$lib/server/mailStats";



export async function GET({}: RequestEvent): Promise<Response> {
    const contactListLength = await getContactListLength();

    const data = {
        sentEmailsLastMonth: await getEmailsLastMonth(),
        contactListLength: contactListLength,
        capacityPercentage: +(contactListLength/EMAIL_DAILY_CAPACITY).toFixed(2),
        signupKillSwitchPercentage: SIGNUP_KILL_SWITCH_PERCENTAGE
    };

    return new Response(JSON.stringify(data), { status: 200, headers: { 'Content-Type': 'text/html' } });
}

