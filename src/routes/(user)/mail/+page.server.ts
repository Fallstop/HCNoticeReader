import { fail, type Actions, type RequestEvent } from "@sveltejs/kit";
import { default as Mailjet, type Contact } from "node-mailjet";
import {v4 as uuidv4} from 'uuid';

import { env } from "$env/dynamic/private";
import { RegisterStatus } from "./common";

const mailjet = new Mailjet({
	apiKey: env.SECRET_MJ_API_KEY,
	apiSecret: env.SECRET_MJ_API_Secret,
});
console.log('mailjet', env.SECRET_MJ_API_KEY, env.SECRET_MJ_API_Secret);

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
		const email = data.get('email')?.toString();
		console.log(data)

		if (!email || !email.match(/.+@.+\..+/)) {
			return {
				state: RegisterStatus.InvalidEmail,
			};
		}

		let state: RegisterStatus = RegisterStatus.ServerError;

		try {
			const nameID = uuidv4();
			console.log("Creating Email with", email)
			const newMember: Contact.PostContactResponse = (await mailjet.post("contact", { version: 'v3' })
				.request({
					IsExcludedFromCampaigns: "false",
					Name: nameID,	  
					Email: email
				})).body as Contact.PostContactResponse;
			console.log('Created member',nameID,"Response:", newMember);

		} catch (error) {
			console.error(error);
		}

		try {
			// Continue anyway
			const request = await mailjet
				.post("listrecipient", { 'version': 'v3' })
				.request({
					"ContactAlt": email,
					"ListID": 10278356,
				});
			// console.log(request.body);
			state = RegisterStatus.Success;

		} catch (error) {

			let errorMessage = error?.ErrorMessage as string;
			console.log(errorMessage)
			if (errorMessage.toLowerCase().includes("already exists")) {
				state = RegisterStatus.AlreadyRegistered;
			} else {
				state = RegisterStatus.ServerError;
			}
		}

		return {
			state,
			email,
		};
	},
}
