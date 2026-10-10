import { defineCliConfig } from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: 'o047dcer',
    dataset: 'production',
  },
  deployment: {
    // Existing hosted studio at https://sheikh-jamal-recipe.sanity.studio
    appId: 'fca79b27d62e56249c4cb10d',
    autoUpdates: true,
  },
})
