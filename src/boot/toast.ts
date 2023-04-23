import { boot } from 'quasar/wrappers'
// Import one of the available themes
import Notifications from '@kyvg/vue3-notification'
// "async" is optional;
// more info on params: https://v2.quasar.dev/quasar-cli/boot-files
export default boot( async ({app}/* { app, router, ... } */) => {
  // something to do
  app.use(Notifications)
})
