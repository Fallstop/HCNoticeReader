import { getNoticeText, getTimeTableDay } from "$lib/api";
import { formatDate } from "$lib/date";
import dayjs from "dayjs";
import mjml2html from "mjml";
import htmlMinifier from "html-minifier";

import { stripHtml } from "string-strip-html";

import NoticeEmailTemplate from "./notice.mjml?raw";


interface Email {
    renderedHTML: string;
    mjml: string;
    text: string;
    send: boolean;
    subject: string;
    campaignName: string;
}



export async function generateEmail(serverFetch: typeof fetch): Promise<Email> {
    const now = new Date(new Date("2022-05-24").toLocaleString('en', { timeZone: 'pacific/auckland' }));

    // Get notice data using server-side fetch
    let noticeText = await getNoticeText(now, serverFetch);
    let timetableDay = await getTimeTableDay(now, serverFetch);

    const EMAIL_VARS = {
        "NOTICE_TEXT": noticeText.html || "No notice text found",
        "TIMETABLE_DAY": timetableDay,
        "DATE": formatDate(now),
        "DAY": dayjs(now).format("dddd"),
        "EMAIL": "{{mj:contact.email}}",
        "HOMEPAGE": "https://hcnotices.jmw.nz"
    }

    const mjmlTemplate = implantVars(NoticeEmailTemplate, EMAIL_VARS);


    // Render MJML
    const renderedEmail = mjml2html(mjmlTemplate, {});
    if (renderedEmail.errors.length > 0) {
        console.log("MJML Errors:");
    }
    for (let error in renderedEmail.errors) {
        console.error(error);
    }

    const renderedHTML = htmlMinifier.minify(renderedEmail.html, {
        collapseWhitespace: true,
        minifyCSS: true,
        minifyJS: true,
        removeComments: true,
        removeEmptyAttributes: true,
        removeRedundantAttributes: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true,
    });

    let send = !!timetableDay && timetableDay != "N/A"
    send = send && noticeText.html.length > 10;

    let subject = `HC Notice Newsletter - Day ${timetableDay} - ${formatDate(now)}`;
    let campaignName = `HCNoticeNewsletter_${formatDate(now)}`;

    let textOnlyNotice = stripHtml(noticeText.html, {

    });

    let textOnlyEmail =
`${subject}
${textOnlyNotice.result}

~~~~
This is a newsletter sent by the HC Notices website (\${HOMEPAGE}). You can unsubscribe at any time by clicking the link at the bottom of this email.
\${HOMEPAGE}/mail/unsubscribe?email=\${EMAIL}`;

    textOnlyEmail = implantVars(textOnlyEmail, EMAIL_VARS);

    return {
        renderedHTML,
        text: textOnlyEmail,
        send,
        subject,
        campaignName,
        mjml: mjmlTemplate
    };
}

function implantVars(html: string, vars: Record<string, string>) {
    for (let key in vars) {
        html = html.replaceAll(`\${${key}}`, vars[key]);
    }
    return html;
}