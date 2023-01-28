import type { RequestEvent } from "@sveltejs/kit";
import { env } from "$env/dynamic/private";
import { getNoticeText, getTimeTableDay } from "$lib/api";

import NoticeEmail from "./notice.mjml?raw";

import mjml2html from "mjml";
import htmlMinifier from "html-minifier";
import { formatDate } from "$lib/date";
import dayjs from "dayjs";

const sendAuth = env.SECRET_SEND_AUTHENTICATION;


export async function GET({ request, fetch }: RequestEvent): Promise<Response> {
    if (request.headers.get('Authorization') !== sendAuth) {
        return new Response('Unauthorized', { status: 401 })
    }

    // Trigger Daily Notice Newsletter

    const now = new Date(new Date().toLocaleString('en', {timeZone: 'pacific/auckland'}));

    // Get notice data using server-side fetch
    let noticeText = await getNoticeText(now, fetch);
    let timetableDay = await getTimeTableDay(now, fetch);

    // Render MJML
    let renderedEmail = mjml2html(NoticeEmail,{});
    if (renderedEmail.errors.length > 0) {
        console.log("MJML Errors:");
    }
    for (let error in renderedEmail.errors) {
        console.error(error);
    }
    let rawHTML = renderedEmail.html;

    rawHTML = implantVars(rawHTML, {
        "NOTICE_TEXT": noticeText.html,
        "TIMETABLE_DAY": timetableDay,
        "DATE": formatDate(now),
        "DAY": dayjs(now).format("dddd"),
        "EMAIL": "{{mj:contact.email}}",
        "HOMEPAGE": "https://hcnotices.jmw.nz"
    });

    rawHTML = htmlMinifier.minify(rawHTML, {
        collapseWhitespace: true,
        minifyCSS: true,
        minifyJS: true,
        removeComments: true,
        removeEmptyAttributes: true,
        removeRedundantAttributes: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true,
    });


    return new Response(rawHTML, { status: 200 })
}

function implantVars(html: string, vars: Record<string, string>) {
    for (let key in vars) {
        html = html.replaceAll(`\${${key}}`, vars[key]);
    }
    return html;
}