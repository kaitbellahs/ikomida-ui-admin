import App from './App.svelte';
import { Network } from '@tian/components';

Network.createInstance("http://192.168.1.104:1988", "", "admin");

const app = new App({
	target: document.body
});

export default app;