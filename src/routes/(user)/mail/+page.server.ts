import type { Actions, RequestEvent } from "@sveltejs/kit";
import {default as formData} from "form-data";
import {default as Mailgun} from "mailgun.js";

const MAILGUN_API_ROOT = "https://api.mailgun.net/v3";
const mailgun = new Mailgun(formData);

const client = mailgun.client({ username: 'api', key: 'YOUR_API_KEY' || '' });

// (async () => {
// 	try {
// 	  const newMember = await client.lists.members.createMember(DOMAIN,
// 		{
// 			address: 'bob@example.com',
// 			name: 'Bob Barr',
// 			vars: JSON.stringify({age: 27}),
// 			subscribed: 'yes',
// 			upsert: 'yes'
// 		}
// 	  );
// 	  console.log('newMember', newMember);
// 	} catch (error) {
// 		console.error(error);
// 	}
//   })();

export const actions: Actions = {
	register: async ({ request }) => {
		const data = await request.formData();
		const email = data.get('email');

		let user = await fetch(`{MAILGUN_API_ROOT}/lists/LIST@YOUR_DOMAIN_NAME/members`,{method: "POST"});

		return {
			status,
			body: { error }
		};
	},
}
