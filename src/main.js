import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import http from './utils/request';
import common from './utils/common';
import constant from './utils/constant';

// Import CSS files
import './assets/css/animation.css';
import './assets/css/index.css';
import './assets/css/tocbot.css';
import './assets/css/color.css';
import './assets/css/video.css';
import './assets/css/markdown-highlight.css';
import './assets/css/font-awesome.min.css';
import './assets/css/vditor-custom.css';


const app = createApp(App);

app.use(router);
app.use(store);
app.use(ElementPlus);

app.provide('$http',http);
app.provide('$common',common);
app.provide('$constant',constant);

app.mount('#app');

