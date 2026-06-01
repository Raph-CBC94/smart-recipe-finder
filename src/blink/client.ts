import { createClient } from '@blinkdotnew/sdk'

export const blink = createClient({
  projectId: import.meta.env.VITE_BLINK_PROJECT_ID || 'smart-recipe-finder-ir3ao04u',
  publishableKey: import.meta.env.VITE_BLINK_PUBLISHABLE_KEY || 'blnk_pk_uKbfZeb9yUe1sJFVwmPnrHZGdPVSNaH5',
  authRequired: false,
  auth: { mode: 'managed' },
})
