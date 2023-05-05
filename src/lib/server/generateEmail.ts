import { getLunchtimeActivity, getNoticeText, getTimeTableDay } from "$lib/api";
import { formatDate } from "$lib/date";
import dayjs from "dayjs";
import mjml2html from "mjml";

import { stripHtml } from "string-strip-html";

import NoticeEmailRawTemplate from "./notice.mjml?raw";

import Handlebars from "handlebars";
import { lookupLunchtimeActivity } from "../../LunchTimeActivities";


interface Email {
    renderedHTML: string;
    mjml: string;
    text: string;
    send: boolean;
    subject: string;
    campaignName: string;
}

const noticeCompiledTemplate = Handlebars.compile(NoticeEmailRawTemplate,{noEscape: true})

export async function generateEmail(serverFetch: typeof fetch): Promise<Email> {
    const now = new Date(new Date().toLocaleString('en', { timeZone: 'pacific/auckland' }));

    // Get notice data using server-side fetch
    let noticeText = await getNoticeText(now, serverFetch);
    let timetableDay = await getTimeTableDay(now, serverFetch);
    let lunchtimeActivitiesIndex = await getLunchtimeActivity(now, serverFetch);
    let lunchtimeActivities = lookupLunchtimeActivity(lunchtimeActivitiesIndex);

    const EMAIL_VARS = {
        "NOTICE_TEXT": noticeText.html || "No notice text found",
        "TIMETABLE_DAY": timetableDay,
        "DATE": formatDate(now),
        "DAY": dayjs(now).format("dddd"),
        "EMAIL": "[[EMAIL_TO]]",
        "HOMEPAGE": "https://hcnotices.jmw.nz",
        "LUNCHTIME_ACTIVITIES": lunchtimeActivities || []
    }

    // const mjmlTemplate = implantVars(NoticeEmailRawTemplate, EMAIL_VARS);
    const mjmlTemplate = noticeCompiledTemplate(EMAIL_VARS)

    // Render MJML
    const renderedEmail = mjml2html(mjmlTemplate, {});

    const renderedHTML = renderedEmail.html;

    let send = !!timetableDay && timetableDay != "N/A"
    send = send && noticeText.html.length > 10;

    let subject = `HC Notice Newsletter - Day ${timetableDay} - ${formatDate(now)}`;
    let campaignName = `HCNoticeNewsletter_${formatDate(now)}`;

    let textOnlyNotice = stripHtml(noticeText.html, {

    });

    let textOnlyEmail =
`${subject}
${textOnlyNotice.result}

{{#each LUNCHTIME_ACTIVITIES}}
~~~ Lunchtime Activity - {{this.title}} ~~~
{{#if ../LUNCHTIME_ACTIVITIES.[1]}}
One of today's{{else}}Today's{{/if}} lunchtime activity is run by {{#each this.names}}{{this}}, {{/each}}{{#if this.room}}in {{this.room}}{{else}}in an unknown room{{/if}}.

{{/each}}

~~~~
This is a newsletter sent by the HC Notices website ({{HOMEPAGE}}). You can unsubscribe at any time by clicking the link at the bottom of this email.
{{HOMEPAGE}}/mail/unsubscribe?email={{EMAIL}}`;

    const textOnlyEmailCompiled = Handlebars.compile(textOnlyEmail)

    const textOnlyEmailSubbed = textOnlyEmailCompiled(EMAIL_VARS);

    return {
        renderedHTML,
        text: textOnlyEmailSubbed,
        send,
        subject,
        campaignName,
        mjml: mjmlTemplate
    };
}