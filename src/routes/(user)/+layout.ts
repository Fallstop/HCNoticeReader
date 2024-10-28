import posthog from 'posthog-js'
import { browser } from '$app/environment';

export const load = async () => {

  if (browser) {
    console.log("Loading analytics... (not-evil analytics I promise)")
    posthog.init(
      'phc_jKcMjkhAdcd19nxck3R5sXWFyRSAPj3RxCKon8Ded2O',
      { 
        api_host: 'https://analytics.qinnovate.nz',
        person_profiles: 'identified_only', // or 'always' to create profiles for anonymous users as well
      }
    )
  }
  return
};