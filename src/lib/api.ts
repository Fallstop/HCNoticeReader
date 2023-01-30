import dayjs, { Dayjs } from "dayjs";

const API_ROUTE = "https://hctools.jmw.nz/api/";

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

export interface NoticeText {
	html: string;
	isBroken: boolean;
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

	// Find 3+ repeated -,_,+,~ and replace with <hr> (also wipes out any spaces/newlines before/after)
	text = text.replaceAll(/(?:\s|(?:<br\/?>))*[-+_~]{3,}(?:\s|(?:<br\/?>))*/g,"<hr>")


	// Fun Fact: If somebody edits the calendar event with some unknown piece of software,
	// it will wipe all of the formatting. Fun. So we need also display a warning for that occurrence. 
	let noticeTextBroken = false;
	if (text.includes("<br>") == false && text.length > 48) {
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
	text = `<p>${text}</p>`
	text = text.replaceAll(/<br\/?>/g,"</p><p>");


	// Clear up empty <p></p> back into <br>
	text = text.replaceAll(/<p>(:?\s|(:?[^<](^|>)+))*<\/p>/g,"<br/>");

	return {
		html: text,
		isBroken: noticeTextBroken
	}
}
