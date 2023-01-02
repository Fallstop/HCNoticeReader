import { formatDate } from "$lib/date";
import { redirect } from "@sveltejs/kit";

export function GET() {
    throw redirect(303, `/print/${formatDate(new Date())}`)
}
