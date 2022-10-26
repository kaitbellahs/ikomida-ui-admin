window.environment = 'ENVIRONMENT'
window.host = 'ikomida.com'

import App from './App.svelte'
import { Network, Stores } from '@ikomida/shared-frontend'
import Routes from './stores/Routes'
import pkg from '../package.json' assert { type: 'json' }

const appVersion = pkg.version
const agent = 'ADMIN'
const host: any = {
  production: 'ikomida.com',
  development: 'dev.ikomida.com',
  homologation: 'hmlg.ikomida.com'
}
window.host = host[window.environment]
const url: any = {
  production: 'https://api.ikomida.com',
  development: 'https://dev.api.ikomida.com',
  homologation: 'https://hmlg.api.ikomida.com'
}
Stores.Cache.createInstance()
Stores.Auth.Auth.createInstance(agent)
Stores.MenuHamburger.createInstance()
Stores.Menu.createInstance()
Stores.Title.createInstance()
Stores.Loading.createInstance()
Stores.PushNotificationToken.createInstance()
Stores.Navigation.createInstance(Routes.home)
Stores.LoadMore.createInstance()
Stores.Layout.createInstance()
Network.createInstance(
  url[window.environment],
  'com.ikomida.br.admin',
  agent,
  '6LebYzshAAAAAIXhka3WrAjus5tDXtefR1QefVZS',
  appVersion
)

const app = new App({
  target: document.body
})

export default app
