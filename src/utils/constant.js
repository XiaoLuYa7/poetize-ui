export default {

  baseURL: import.meta.env.VITE_BASE_URL,
  webURL: import.meta.env.VITE_WEB_URL,


  imIP: import.meta.env.VITE_IM_IP,
  wsProtocol: import.meta.env.VITE_WS_PROTOCOL,
  wsPort: import.meta.env.VITE_WS_PORT,

  host: import.meta.env.VITE_HOST,

  live2d_path: "https://cdn.jsdelivr.net/gh/stevenjoezhang/live2d-widget@latest/",
  cdnPath: "https://cdn.jsdelivr.net/gh/fghrsh/live2d_api/",
  hitokoto: "https://v1.hitokoto.cn",

  tocbot: "https://cdnjs.cloudflare.com/ajax/libs/tocbot/4.18.2/tocbot.min.js",
  jinrishici: "https://v1.jinrishici.com/all.json",

  jitang: "https://api.oick.cn/dutang/api.php",
  shehui: "https://api.oick.cn/yulu/api.php",
  yiyan: "https://api.oick.cn/yiyan/api.php",
  dog: "https://api.oick.cn/dog/api.php",

  //前后端定义的密钥，AES使用16位
  cryptojs_key: "luckluckluckluck",

  before_color_list: ["black", "rgb(131, 123, 199)", "#ee7752", "#e73c7e", "#23a6d5", "#23d5ab"],

  tree_hole_color: ["rgb(180, 224, 255)", "rgb(180, 203, 255)", "rgb(246, 223, 255)", "rgb(255, 214, 198)", "rgb(255, 205, 143)", "rgb(238, 255, 143)", "rgb(220, 255, 165)", "rgb(164, 234, 192)", "rgb(202, 241, 233)", "rgb(230, 230, 250)"],

  before_color_1: "black",
  after_color_1: "linear-gradient(45deg, #f43f3b, #ec008c)",

  before_color_2: "rgb(131, 123, 199)",
  after_color_2: "linear-gradient(45deg, #f43f3b, #ec008c)",

  sortColor: ["linear-gradient(to right, #358bff, #15c6ff)",
    "linear-gradient(to right, #18e7ae, #1eebeb)",
    "linear-gradient(to right, #ff6655, #ffbf37)",
    "linear-gradient(120deg, rgba(255, 39, 232, 1) 0%, rgba(255, 128, 0, 1) 100%)",
    "linear-gradient(120deg, rgba(91, 39, 255, 1) 0%, rgba(0, 212, 255, 1) 100%)"
  ],

  pageColor: "#ee7752",
  commentPageColor: "#23d5ab",

  emojiList: ['衰', '鄙视', '再见', '捂嘴', '摸鱼', '奋斗', '白眼', '可怜', '皱眉', '鼓掌', '烦恼', '吐舌', '挖鼻', '委屈', '滑稽', '啊这', '生气', '害羞', '晕', '好色', '流泪', '吐血', '微笑', '酷', '坏笑', '吓', '大兵', '哭笑', '困', '呲牙']
}
