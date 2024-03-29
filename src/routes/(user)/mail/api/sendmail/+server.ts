import type { RequestEvent } from "@sveltejs/kit";
import { env } from "$env/dynamic/private";

import { generateEmail } from "$lib/server/generateEmail";

import cronitorConstructor from "cronitor";

import { HCNOTICES_MAILING_LIST_ID, ensureMailjet, mailjet } from "$lib/server/mailjet";
import type { DraftCampaign } from "node-mailjet";

const sendAuth = env['SECRET_SEND_AUTHENTICATION'];
const cronitorAuth = env['SECRET_CRONITOR_AUTHENTICATION'];

let cronitor: ReturnType<typeof cronitorConstructor> | null;

if (cronitorAuth) {
    cronitor = cronitorConstructor(cronitorAuth);
} else {
    cronitor = null
}


// Generate preview of email
export async function GET({ request, fetch: serverFetch }: RequestEvent): Promise<Response> {
    return new Response((await generateEmail(serverFetch, "")).renderedHTML, { status: 200, headers: { 'Content-Type': 'text/html' } });
}

// Send email manager
export async function POST(requestEvent: RequestEvent): Promise<Response> {
    const { request } = requestEvent;

    if (request.headers.get('Authorization') !== sendAuth) {
        return new Response('Unauthorized', { status: 401 })
    }

    let asyncWorker = sendMail;

    if (cronitor) {
        console.log("Running with cronitor monitoring")
        // If using cronitor, wrap the send mail function in a cronitor wrapper
        asyncWorker = cronitor.wrap('send-newsletter', sendMail);
    } else {
        console.log("Running without cronitor monitoring")
    }

    return await asyncWorker(requestEvent, request.headers.get('X-Api-Auth') || "");
}

async function sendMail({ fetch: serverFetch }: RequestEvent, apiAuthCode: string = ""): Promise<Response> {
    try {
        let emailToSend = await generateEmail(serverFetch, apiAuthCode);

        if (!emailToSend.send) {
            return new Response("No email to send", { status: 200 })
        }
        console.log("Creating Draft Campaign");
        
        if (!ensureMailjet() || !mailjet) {
            return new Response("Mailjet not configured", { status: 500 })
        }

        // Create Campaign
        const campaignDraft = await mailjet.post("campaigndraft").request({
            "Locale": "en_US",
            "Sender": "HCNotices",
            "SenderName": "HC Notices",
            "SenderEmail": "hcnewsletter@jmw.nz",
            "Subject": emailToSend.subject,
            "ContactsListID": HCNOTICES_MAILING_LIST_ID,
            "Title": emailToSend.campaignName,
            "EditMode": "mjml",
            "ReplyEmail": "office@hc.school.nz"
        });
    
        let draftID = (campaignDraft.body as DraftCampaign.PostCampaignDraftResponse).Data[0].ID;
    
        console.log("Created compaign draft with ID: " + draftID);
    
        // Fill campaign with content
        await mailjet
            .post("campaigndraft", { 'version': 'v3' })
            .id(draftID)
            .action("detailcontent")
            .request({
                "Headers": {
                    "MJ-TemplateLanguage": "True",
                },
                "Html-part": emailToSend.renderedHTML,
                "MJMLContent": emailToSend.mjml,
                "Text-part": emailToSend.text
            });
    
        // Send campaign
        const result = (await mailjet
            .post("campaigndraft", {'version': 'v3'})
            .id(draftID)
            .action("send")
            .request()).body as DraftCampaign.PostCampaignDraftSend;
        let statusCode = result.Data[0].Status.toLowerCase();
        if (statusCode !== "sent" && statusCode !== "programmed") {
            console.log("Potential problem sending email",result.Data[0].Status)
            return new Response("Potential problem sending email", { status: 500 })
        }
    
        return new Response("OK", { status: 200 });    
    } catch {
        return new Response("Unknown problem sending email", { status: 500 })
    }
}