import dayjs, { Dayjs } from "dayjs";

const API_ROUTE = "https://hctools.jmw.nz/api/";

export async function getNoticeText(noticeDateToGet: Date | Dayjs): Promise<NoticeText> {
	let response = await fetch(
		new Request(API_ROUTE + "getdailynotice/" + dayjs(noticeDateToGet).format("YYYY-MM-DD"))
	)
	let data = await response.json();
	let dayHasNotices = data["isSchoolDay"];
	if (dayHasNotices) {
		dayHasNotices = (data["noticeText"] || "").trim() !== "";
	}
	return processNoticeText(data["noticeText"] ?? "Unknown Error, please try again later.");
}

export async function getTimeTableDay(noticeDateToGet: Date | Dayjs) {
	let response = await fetch(
		new Request(API_ROUTE + "gettimetableday/" + dayjs(noticeDateToGet).format("YYYY-MM-DD"))
	)
	let data = await response.json();
	let timeTableDayText = data["currentDay"] || "N/A";

	return timeTableDayText || "";
}

export interface NoticeText {
	html: string;
	isBroken: boolean;
}

function processNoticeText(text: string): NoticeText {
	// Strip out <html-blob> tags, leaving the contents
	text = text.replaceAll(/<html-blob>(.*?)<\/html-blob>/g,"$1")

	// Find 3+ repeated -,_,+,~ and replace with <hr> (also wipes out any spaces/newlines before/after)
	text = text.replaceAll(/(?: |\r\n|\r|\n|(?:<br\/?>))*[-+_~][-+_~]+[-+_~](?: |\r\n|\r|\n|(?:<br\/?>))*/g,"<hr>")


	text = text.replaceAll(/(?:\r\n|\r|\n)/g, '<br>');
	
	
	let noticeTextBroken = false;

	if (text.includes("<br>") == false && text.length > 24) {
		noticeTextBroken = true
		// Contains no line breaks, so we should do it ourselves
		// Punctuation outside of quotes
		text = text.replaceAll(/[!?.]+(?=([^"]*"[^"]*")*[^"]*$)(?=( *[^=]))/g,"$&<br>")
		text = text.replaceAll(/" {2,}(?=[A-Z])/g,"<br>")
	}

	// Find 3+ repeated <br> or <br/> and replace with <hr>
	text = text.replaceAll(/(<br\/?>){3,}/g,"<hr>")

	// Render select markdown
	text = text.replaceAll(/(\*\*|__)([^<>]*?)\1/g,"<b>$2</b>")
	text = text.replaceAll(/(\*|_)([^<>]*?)\1/g,"<i>$2</i>")
	text = text.replaceAll(/(\~\~|\*\*\*)([^<>]*?)\1/g,"<s>$2</s>")

	return {
		html: text,
		isBroken: noticeTextBroken
	}
}
