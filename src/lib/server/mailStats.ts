import { HCNOTICES_MAILING_LIST_ID, ensureMailjet, mailjet } from "$lib/server/mailjet";

import type { Statistic, ContactList } from "node-mailjet";
import { memCache } from "./cache";

const cacheTTL = 60*30; // 1 hour

export async function getContactListLength(): Promise<number> {
    const cacheResponse: number | undefined = memCache.get("contactListLength");
    if (typeof cacheResponse !== "undefined") {
        console.log("Using cached contact contactListLength", cacheResponse)
        return cacheResponse;
    }

    if (!ensureMailjet() || !mailjet) {
        console.log("Mailjet not configured")
        return 0;
    }

    const request = await mailjet
        .get("contactslist", {'version': 'v3'}).id(HCNOTICES_MAILING_LIST_ID).request();
    
    const contactList = (request.body as ContactList.GetContactListResponse);
    const count = contactList.Data[0].SubscriberCount || 0;
    
    memCache.set("contactListLength", count, cacheTTL);

    return count;
}

export async function getEmailsLastMonth(): Promise<number> {
    const cacheResponse: number | undefined = memCache.get("emailsLastMonth");
    if (typeof cacheResponse !== "undefined") {
        console.log("Using cached contact emailsLastMonth", cacheResponse)
        return cacheResponse;
    }


    if (!ensureMailjet() || !mailjet) {
        console.log("Mailjet not configured")
        return 0;
    }

    // Pretend all months are 31 days long
    const interval = 31 * 24 * 60 * 60;
    const currentTime = new Date().getTime();

    const request = await mailjet
        .get("campaignoverview", {'version': 'v3'}).request({},{
            "Sent": "true",
            "Limit": 40 // Should at least get one month, while accounting for test campaigns
        });
    const fullStats = (request.body as Statistic.GetCampaignOverviewResponse);
    // Count number of processed emails in campaigns with a start time in the last month
    const sentMailLastMonth = fullStats.Data.reduce((acc, cur) => acc + (((currentTime - cur.SendTimeStart) < interval) ? cur.ProcessedCount : 0), 0);
    
    memCache.set("emailsLastMonth", sentMailLastMonth, cacheTTL);

    return sentMailLastMonth;

}