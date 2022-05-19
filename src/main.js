import App from './App.svelte';
import { Network } from '@ikomida/components';

// Network.createInstance("http://192.168.1.104:1988", "", "admin");
Network.createInstance("https://api.ikomida.com", "", "admin");

const app = new App({
	target: document.body
});

export default app;