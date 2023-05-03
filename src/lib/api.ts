import dayjs, { Dayjs } from "dayjs";
import { ClearCacheStatus } from "../routes/(user)/admin/common";

// const API_ROUTE = "http://localhost:8080/api/";
const API_ROUTE = "https://hctools.jmw.nz/api/";

export interface NoticeText {
	html: string;
	isBroken: boolean;
}

export async function getNoticeText(noticeDateToGet: Date | Dayjs, fetchFN: typeof fetch = fetch): Promise<NoticeText> {
	let response = await fetchFN(
		new Request(API_ROUTE + "getdailynotice/" + dayjs(noticeDateToGet).format("YYYY-MM-DD"))
	)
	let data = await response.json();
	let dayHasNotices = data["isSchoolDay"];
	if (dayHasNotices) {
		dayHasNotices = (data["noticeText"] || "").trim() !== "";
	}
	return processNoticeText(data["noticeText"] ?? "Unknown Error, please try again later.");
}

export async function getTimeTableDay(noticeDateToGet: Date | Dayjs, fetchFN: typeof fetch = fetch): Promise<string> {
	let response = await fetchFN(
		new Request(API_ROUTE + "gettimetableday/" + dayjs(noticeDateToGet).format("YYYY-MM-DD"))
	)
	let data = await response.json();
	let timeTableDayText = data["currentDay"]?.toString() || "N/A";

	return timeTableDayText || "";
}

export async function postRefreshCache(adminToken: string, fetchFN: typeof fetch = fetch): Promise<ClearCacheStatus> {
	let response = await fetchFN(
		new Request(API_ROUTE + "refreshcache/",{
			method: "POST",
			headers: {
				"admintoken": adminToken
			}
		})
	);
	let roughStatus = Math.round(response.status/100)
	if (roughStatus==2) {
		return ClearCacheStatus.Success;
	} else if (roughStatus==4) {
		return ClearCacheStatus.WrongPassword;
	} else {
		return ClearCacheStatus.ServerError;
	}
}

export interface LunchtimeActivityIndex {
	weekDay: number,
	weekRotation: number
}  

export async function getLunchtimeActivity(noticeDateToGet: Date | Dayjs, fetchFN: typeof fetch = fetch): Promise<LunchtimeActivityIndex> {
	let response = await fetchFN(
		new Request(API_ROUTE + "getlunchtimeactivity/" + dayjs(noticeDateToGet).format("YYYY-MM-DD"))
	)
	let data = await response.json();
	if (data["error"]) {
		throw new Error(data["error"]);
	}
	return data;
}



function processNoticeText(text: string): NoticeText {
	if (!text) {
		return {
			html: text,
			isBroken: false
		}
	}
	// If this ever looks a bit too jank, refer to the following:
	// https://stackoverflow.com/a/1732454

	// Strip out <html-blob> tags, leaving the contents
	text = text.replaceAll(/<html-blob>(.*?)<\/html-blob>/g,"$1")

	// Sometimes, the calendar description is in html. Sometimes it's just ascii.
	// So, we must convert to html using the power of pain and suffering.
	text = text.replaceAll(/(?:\r\n|\r|\n)/g, '<br>');

	// Fun Fact: If somebody edits the calendar event with some unknown piece of software,
	// it will wipe all of the formatting. Fun. So we need also display a warning for that occurrence. 
	let noticeTextBroken = false;
	
	// Checks if has breaks, or has <p></p> tags
	let noticeHasNewLines = text.match(/<\/?br\/?>/g) || text.match(/<\s*\/p>\s*<p[^<>]*>/g)

	if (!noticeHasNewLines && text.length > 128) {
		// Contains no line breaks, so we should do it ourselves
		// Punctuation outside of quotes
		let reformattedText = text.replaceAll(/[!?.]+(?=([^"]*"[^"]*")*[^"]*$)(?=( *[^=]))/g,"$&<br>");
		reformattedText = reformattedText.replaceAll(/" {2,}(?=[A-Z])/g,"<br>");
		if (reformattedText !== text) {
			text = reformattedText;
			noticeTextBroken = true;
		}
	}


	// Find 3+ repeated -,_,+,~ and replace with <hr> (also wipes out any spaces/newlines/p tags before/after)
	text = text.replaceAll(/(?:(?:<\s*p\s*>)|\s|(?:<\/?br\/?>))*[-+_~]{3,}(?:\s|(?:<br\/?>)|(?:<\s*\/\s*p\s*>))*/g,"<hr>")

	// Find 3+ repeated <br> or <br/> and replace with <hr>
	text = text.replaceAll(/(<\/?br\/?>){3,}/g,"<hr>")

	// Render select markdown
	text = text.replaceAll(/(\*\*|__)([^<>]*?)\1/g,"<b>$2</b>")
	text = text.replaceAll(/(\*|_)([^<>]*?)\1/g,"<i>$2</i>")
	text = text.replaceAll(/(\~\~|\*\*\*)([^<>]*?)\1/g,"<s>$2</s>")

	// Now we can convert into a bit more semantic HTML
	// Right now it's:
	// <div wrapper>
	// 		"asd. asd,asd! asdds."<br/>"asd? as. dasd!"<br/>
	// </div>
	// When in realty it should be using paragraphs instead of <br/>, like so
	// <div wrapper>
	// 		<p>
	// 			"asd. asd,asd! asdds."
	//  	</p>
	// 		<p>
	// 			"asd? as. dasd!"
	//  	</p>
	// </div>
	// This is mostly to support the swipe gesture element filtering

	text = text.replaceAll(/<\/?br\/?>/g,"</p><p>");

	// Clear any starting or ending p tags, we will add them back if needed
	text = text.replaceAll(/^\s*<\/?p>/g,"").replaceAll(/<\/?p>\s*$/g,"");

	// Checks if last/first p tag needs completing
	let needsStartOpeningTag = text.indexOf("</p>") > -1 ? text.indexOf("</p>")<text.indexOf("<p>") : false;
	let needsEndClosingTag = text.lastIndexOf("<p>")>text.lastIndexOf("</p>");

	// Then add them back
	text = `${needsStartOpeningTag ? "<p>" : ""}${text}${needsEndClosingTag ? "</p>" : ""}`

	// Clear up empty <p></p> back into <br>
	text = text.replaceAll(/<p>(:?\s|(:?[^<](^|>)+))*<\/p>/g,"<br/>");

	return {
		html: text,
		isBroken: noticeTextBroken
	}
}

export interface MailStats {
	sentEmailsLastMonth: number;
	contactListLength: number;
	capacityPercentage: number;
	signupKillSwitchPercentage: number;
}
export async function getMailStats(fetchFN: typeof fetch = fetch): Promise<MailStats> {
	let response = await fetchFN("/mail/api/stats")
	let data = await response.json();
	return data;
}
