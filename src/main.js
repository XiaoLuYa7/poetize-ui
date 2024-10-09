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
import './assets/css/markdown-highlight.css';
import './assets/css/font-awesome.min.css';
import './assets/css/vditor-custom.css';

import { library } from '@fortawesome/fontawesome-svg-core'
import { faAlignJustify, faCheck, faCog, faCopy, faHome, faMoon, faPaperPlane, faPause, faPlay, faRemove, faShoppingBag, faSignOut, faSnowflake, faSun, faUserCircle, faUserSecret } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faVolumeUp } from '@fortawesome/free-solid-svg-icons/faVolumeUp';
import { faAtom } from '@fortawesome/free-solid-svg-icons/faAtom';

library.add(faUserSecret)
library.add(faPaperPlane)
library.add(faAlignJustify)
library.add(faCopy)
library.add(faCheck)
library.add(faUserCircle)
library.add(faShoppingBag)
library.add(faRemove)
library.add(faSignOut)
library.add(faHome)
library.add(faCog)
library.add(faSun)
library.add(faMoon)
library.add(faVolumeUp)
library.add(faPlay)
library.add(faPause)
library.add(faSnowflake)



const app = createApp(App);

app.component('font-awesome-icon', FontAwesomeIcon)
app.use(router);
app.use(store);
app.use(ElementPlus);

app.provide('$http',http);
app.provide('$common',common);
app.provide('$constant',constant);

app.mount('#app');

