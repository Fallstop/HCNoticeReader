import dayjs from "dayjs";

const API_ROUTE = "https://hctools.jmw.nz/api/";

export async function getNoticeText(noticeDateToGet: Date): Promise<NoticeText> {
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

export async function getTimeTableDay(noticeDateToGet: Date) {
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
	text = text.replaceAll(/--+-/g,"<hr>")
	text = text.replaceAll(/\+\++\+/g,"<hr>")
	text = text.replaceAll(/__+_/g,"<hr>")
	text = text.replaceAll(/~~+~/g,"<hr>")


	text = text.replaceAll(/(?:\r\n|\r|\n)/g, '</p><br><p>');
	
	let noticeTextBroken = false;

	if (text.includes("<br>") == false && text.length > 24) {
		noticeTextBroken = true
		// Contains no line breaks, so we should do it ourselves
		// Punctuation outside of quotes
		text = text.replaceAll(/[!?.]+(?=([^"]*"[^"]*")*[^"]*$)(?=( *[^=]))/g,"$&<br>")
		text = text.replaceAll(/" +(?=[A-Z])/g,"<br>")
	}

	return {
		html: text,
		isBroken: noticeTextBroken
	}
}
