import type { Actions, RequestEvent } from "@sveltejs/kit";
import { default as Mailjet, type Contact } from "node-mailjet";
import {v4 as uuidv4} from 'uuid';

import { env } from "$env/dynamic/private";

const mailjet = new Mailjet({
	apiKey: env.SECRET_MJ_API_KEY,
	apiSecret: env.SECRET_MJ_API_Secret,
});

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

		let success = true;

		try {
			const nameID = uuidv4();
			const newMember: Contact.PostContactResponse = (await mailjet.post("contact", { version: 'v3' })
				.request({
					IsExcludedFromCampaigns: "false",
					Name: nameID,	  
					Email: email
				})).body;
			console.log('Created member',nameID,"Response:", newMember);

			let contactID = newMember["Data"][0]["ID"];

			const request = mailjet
				.post("listrecipient", { 'version': 'v3' })
				.request({
					"ContactID": "987654321",
					"ContactAlt": "passenger@mailjet.com",
					"ListID": "123456",
					"ListAlt": "abcdef123"
				})

		} catch (error) {
			console.error(error);
			success = false;
		}

		return {
			success,
		};
	},
}
