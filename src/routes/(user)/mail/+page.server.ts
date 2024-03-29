import type {Actions} from "@sveltejs/kit";
import type {Contact} from "node-mailjet";
import {v4 as uuidv4} from 'uuid';

import { RegisterStatus, type FormResponse } from "./common";
import { EMAIL_DAILY_CAPACITY, HCNOTICES_MAILING_LIST_ID, SIGNUP_KILL_SWITCH_PERCENTAGE, ensureMailjet, mailjet } from "$lib/server/mailjet";
import { getContactListLength } from "$lib/server/mailStats";



export const actions: Actions = {
	register: async ({ request }): Promise<FormResponse> => {
		const data = await request.formData();
		const email = data.get('email')?.toString();
		console.log(data)

		if (!email || !email.match(/.+@.+\..+/)) {
			return {
				state: RegisterStatus.InvalidEmail,
			};
		}

		let state: RegisterStatus = RegisterStatus.ServerError;

		if (!ensureMailjet() || !mailjet) {
			console.log("Missing mailjet credentials!")
			return {
				state: RegisterStatus.ServerError,
			};
        }

		// Check the contact list length isn't over the set threshold
		let signupOverQuota = false;
		try {
			signupOverQuota = (await getContactListLength() / EMAIL_DAILY_CAPACITY) > SIGNUP_KILL_SWITCH_PERCENTAGE;
		} catch (error) {
			// COntinue anyway
			console.error(error);
		}

		if (signupOverQuota) {
			return {
				state: RegisterStatus.OverSignupLimit,
			};
		}

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
					"ListID": HCNOTICES_MAILING_LIST_ID,
				});
			// console.log(request.body);
			state = RegisterStatus.Success;

		} catch (error) {
			let errorMessage = (error as any)?.ErrorMessage as string;
			console.log(errorMessage);

			if (errorMessage.toLowerCase().includes("already exists")) {
				state = RegisterStatus.AlreadyCompleted;
			} else {
				state = RegisterStatus.ServerError;
			}
		}

		return {
			state,
			email,
		};
	},
	deregister: async ({ request }): Promise<FormResponse> => {
		const data = await request.formData();
		const email = data.get('email')?.toString();
		console.log(data);

		let state: RegisterStatus = RegisterStatus.ServerError;

		if (!email) {
			return {
				state: RegisterStatus.InvalidEmail,
			};
		}

		if (!ensureMailjet() || !mailjet) {
			console.log("Missing mailjet credentials!")
			return {
				state: RegisterStatus.ServerError,
			};
        }

		try {
			const request = await mailjet
				.post("contact", { 'version': 'v3' })
				.id(email)
				.action("managecontactslists")			
				.request({
					ContactsLists: [
						{
							Action: "remove",
							ListID: HCNOTICES_MAILING_LIST_ID	
						}
					]
				});
				console.log(request.body)
			state = RegisterStatus.Success;
		} catch (error) {
			let errorMessage = (error as any)?.ErrorMessage as string;
			console.log("Error Message",errorMessage);

			if (errorMessage.toLowerCase().includes("not found")) {
				state = RegisterStatus.AlreadyCompleted;
			} else {
				state = RegisterStatus.ServerError;
			}
		}


		return {
			state,
			email
		}
	}
}
