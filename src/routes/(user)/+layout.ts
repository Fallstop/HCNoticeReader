import posthog from 'posthog-js'
import { browser } from '$app/environment';

export const load = async () => {

  if (browser) {
    console.log("Loading analytics... (not-evil analytics I pinky promise)")
    posthog.init(
      'phc_PFuZraY8PjDIKtYBp9kjrLq1B3TrFRQCtzemAorlHKw',
      { 
        // Proxy connection through SvelteKit server
        api_host: '/ingest',
        ui_host: 'https://us.posthog.com',
        person_profiles: 'always',
        persistence: 'localStorage',
      }
    )
  }
  return
};