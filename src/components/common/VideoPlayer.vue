<template>
    <div class="video-player-box">
        <div ref="artRef" class="video-container" />
    </div>

</template>

<script setup>
import { ref, watch, reactive, onMounted, onUnmounted, inject } from 'vue';
import Artplayer from "artplayer";
import artplayerPluginDanmuku from 'artplayer-plugin-danmuku';


const props = defineProps({
    url: {
        type: String
    },
    cover: {
        type: String,
        default: ''
    }
});

const artRef = ref(null);

const constant = inject("$constant")

let player = null;

onMounted(() => {
    if (artRef.value) {
        player = new Artplayer({
            container: artRef.value,
            url: props.url, // 你的视频URL
            autoplay: true, // 自动播放
            lang: 'zh-cn',
            muted: true, //自动静音
            poster: props.cover,
            theme: '#39c5bb',
            // autoSize: true,  // 自动填充
            autoMini: false,  // 当浏览器滚动到页面其他位置时，启用迷你播放
            playbackRate: true, //播放速度
            setting: true,   //设置
            aspectRatio: true, // 长宽比
            fullscreen: true,
            fullscreenWeb: true,
            miniProgressBar: true, // 迷你进度条
            playsInline: true,
            lock: true, // 移动端锁定
            fastForward: true,  // 移动端长按快进
            plugins: [
                artplayerPluginDanmuku({
                    danmuku:
                        [{
                            "text": "这段太精彩了！",
                            "time": 10,
                            "mode": 0,
                            "color": "#FF0000",
                            "border": false,
                            "style": {}
                        },
                        {
                            "text": "哈哈哈，笑死我了！",
                            "time": 20,
                            "mode": 1,
                            "color": "#00FF00",
                            "border": false,
                            "style": {}
                        },
                        {
                            "text": "有谁知道这首歌的名字吗？",
                            "time": 30,
                            "mode": 2,
                            "color": "#0000FF",
                            "border": false,
                            "style": {}
                        },
                        {
                            "text": "这段剧情让我想起了童年。",
                            "time": 35,
                            "mode": 0,
                            "color": "#FFFF00",
                            "border": false,
                            "style": { "fontStyle": "italic" }
                        },
                        {
                            "text": "真是神级表演！",
                            "time": 45,
                            "mode": 1,
                            "color": "#FFFFFF",
                            "border": false,
                            "style": { "fontWeight": "bold" }
                        }
                        ],

                    // 以下为非必填
                    speed: 5, // 弹幕持续时间，范围在[1 ~ 10]
                    margin: [10, '25%'], // 弹幕上下边距，支持像素数字和百分比
                    opacity: 1, // 弹幕透明度，范围在[0 ~ 1]
                    color: '#FFFFFF', // 默认弹幕颜色，可以被单独弹幕项覆盖
                    mode: 0, // 默认弹幕模式: 0: 滚动，1: 顶部，2: 底部
                    modes: [0, 1, 2], // 弹幕可见的模式
                    fontSize: 17, // 弹幕字体大小，支持像素数字和百分比
                    antiOverlap: true, // 弹幕是否防重叠
                    synchronousPlayback: true, // 是否同步播放速度
                    mount: undefined, // 弹幕发射器挂载点, 默认为播放器控制栏中部
                    filter: (danmu) => danmu.text.length <= 100, // 弹幕载入前的过滤器
                    beforeVisible: () => true, // 弹幕显示前的过滤器，返回 true 则可以发送
                    visible: true, // 弹幕层是否可见
                    emitter: true, // 是否开启弹幕发射器
                    maxLength: 200, // 弹幕输入框最大长度, 范围在[1 ~ 1000]
                    theme: 'dark', // 弹幕主题，支持 dark 和 light，只在自定义挂载时生效
                    lockTime: 1,

                    // 手动发送弹幕前的过滤器，返回 true 则可以发送，可以做存库处理
                     beforeEmit: async (danmu) => {
                        //所有弹幕都不允许有边框
                        danmu.border = false
                        const isDirty = (/fuck/i).test(danmu.text);
                        if (isDirty) return false;
                        const state = await saveDanmu(danmu);
                        return state;
                    }
                })
            ]
        });

        player.on('artplayerPluginDanmuku:emit', (danmu) => {

        });

        // 禁止双击全屏
        Artplayer.DBCLICK_FULLSCREEN = false;
        Artplayer.USE_RAF = true;

        player.on('artplayerPluginDanmuku:hide', () => {
            player.notice.show = '弹幕已关闭'
            $('.apd-config, .apd-emitter').animate({
                opacity: 0 // 淡出效果
            }, 500);
        });

        player.on('artplayerPluginDanmuku:show', () => {
            player.notice.show = '弹幕已打开'
            $('.apd-config, .apd-emitter').animate({
                opacity: 1 // 淡入效果
            }, 500);
        });
    }
})

const saveDanmu = (danmu) =>  {

    return new Promise(resolve => {
        setTimeout(() => {
            resolve(true);
        }, 1000);
    })
}


onUnmounted(() => {
    if (player) {
        player.destroy(); // 销毁ArtPlayer实例
    }
})

</script>

<style>
.video-container {
    width: 100%;
    height: 450px;
}

.video-player-box {
    border-radius: 5px;
    overflow: hidden;
}

.art-settings {
    width: 200px !important;
}

.apd-input {
    font-size: 14px
}

.art-controls {
    font-family: var(--globalFont), serif;
}

.apd-config-panel {
    font-size: 13px;
    width: 350px !important
}

.artplayer-plugin-danmuku .apd-config-slider .apd-value {
    width: 35px !important
}

.artplayer-plugin-danmuku .apd-slider {
    margin-left: 2.5px;
}
</style>
