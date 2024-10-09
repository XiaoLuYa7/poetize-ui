<template>
    <div class="letter-wrap myCenter">
        <section class="container my-animation-slide-bottom" id="contact" style="display: unset">
            <form class="flip">
                <!-- 前 -->
                <div class="front">
                    <h2 class="letter-name">Dear Lover</h2>
                    <a id="flip2back" href="#">Flip</a>
                </div>
                <!-- 后 -->
                <!-- 打开信 -->
                <div id="content" class="back">
                    <div id="letter">
                        <div class="container">
                            <div class="flip">
                                <div class="front"></div>
                                <div class="back">
                                    <div style="margin-bottom: 15px">Dear</div>
                                    <div class="letter-content">
                                        <div v-html="familyInfoHtml" style="font-size: 15px; line-height: 1.5"
                                            id="letter-content"></div>
                                    </div>
                                    <p style="float: right; display: block; width: 100px">
                                        Your Lover
                                    </p>
                                    <span class="typed-cursor" style="animation-iteration-count: infinite">|</span>
                                    <a id="close" href="#">Close</a>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div id="top">
                        <a id="flip" href="#contact">Flip</a>
                    </div>
                    <div id="lid" class="container">
                        <div class="flip">
                            <div class="front">
                                <a id="open" href="#content"><span style="background-position: 0px -150px"></span></a>
                            </div>
                            <div class="back"></div>
                            -
                        </div>
                    </div>
                </div>
            </form>
        </section>
        <div id="footer">
            <audio id="music2" preload="auto" loop="true"
                :src="webStaticResourcePrefix + 'assets/video/loveMusic.mp3'"></audio>

            <a id="music_btn2" href="javascript:void(0);" style="opacity: 1">
                <div v-if="!isPlay" class="playCss" @click="play()">
                    <font-awesome-icon :icon="['fa', 'play']" style="width: 12px;height: 14px;" />
                    <div style="margin-left: 5px">播放</div>
                </div>
                <div v-if="isPlay" class="playCss" @click="pause()">
                    <font-awesome-icon :icon="['fa', 'pause']" style="width: 14px;height: 16px;"/>
                    <div style="margin-left: 5px">暂停</div>
                </div>
            </a>
        </div>
    </div>
</template>

<script setup>
import MarkdownIt from 'markdown-it';
import { onMounted, reactive, toRefs, inject } from 'vue';
import multimdTablePlugin from 'markdown-it-multimd-table';
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";

//hooks
const common = inject("$common");
const constant = inject("$constant");
const http = inject("$http");

const store = useStore();
const router = useRouter();

const data = reactive({
    isPlay: false,
    familyInfoHtml: '',
    familyInfo: '',
    webStaticResourcePrefix: import.meta.env.VITE_BASE_URL + "/"
});

const play = () => {
    const music = document.getElementById('music2');
    music.play();
    data.isPlay = true;
};

const pause = () => {
    const music = document.getElementById('music2');
    music.pause();
    data.isPlay = false;
};

const getAdminFamily = () => {
    http.get(constant.baseURL + '/family/getAdminFamily')
        .then((res) => {
            if (!common.isEmpty(res.data)) {
                data.familyInfo = res.data.familyInfo;
                const md = new MarkdownIt({ breaks: true }).use(multimdTablePlugin);
                data.familyInfoHtml = md.render(data.familyInfo);
            }
        })
        .catch((error) => {
            ElMessage({
                message: error.message,
                type: 'error',
            });
        });
};

const getFamily = () => {
    http.get(constant.baseURL + '/family/getFamily')
        .then((res) => {
            if (!common.isEmpty(res.data)) {
                data.familyInfo = res.data.familyInfo;
                const md = new MarkdownIt({ breaks: true }).use(multimdTablePlugin);
                data.familyInfoHtml = md.render(data.familyInfo);
            }
        })
        .catch((error) => {
            ElMessage({
                message: error.message,
                type: 'error',
            });
        });
};

onMounted(() => {
    window.location.hash = '#contact';
    let currentUser = store.state.currentUser;
    if (!common.isEmpty(currentUser)) {
        getFamily();
    }
});

const { isPlay, familyInfoHtml, familyInfo, webStaticResourcePrefix } = toRefs(data)
</script>


<style scoped>
.playCss {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    cursor: pointer;
}

.letter-wrap {
    background: #fffff1;
    width: 100vw;
    height: 100vh;
    padding-top: 50px;
    color: var(--black);
}

.myCenter {
    display: flex;
    justify-content: center;
    align-items: center;
}

.letter-content {
    overflow-y: auto;
    height: 177px;
}

.letter-content::-webkit-scrollbar {
    display: none;
}

#footer {
    position: fixed;
    top: 10px;
    right: 10px;
}

#music_btn2 {
    position: relative;
    margin: 50 auto;
    display: block;
    margin-top: 60px;
    width: 60px;
    height: 32px;
    cursor: pointer;
    opacity: 0.2;
}

body {
    opacity: 0;
}

span {
    display: block;
    width: 150px;
    height: 150px;
    background: var(--letterStitch) no-repeat;
    background-position: 0 0;
}

.typed-cursor {
    opacity: 0;
    -webkit-animation: blink 0.7s infinite;
    -moz-animation: blink 0.7s infinite;
    animation: blink 0.7s infinite;
}

@keyframes blink {
    0% {
        opacity: 0;
    }

    50% {
        opacity: 0;
    }

    100% {
        opacity: 0;
    }
}

@-webkit-keyframes blink {
    0% {
        opacity: 0;
    }

    50% {
        opacity: 0;
    }

    100% {
        opacity: 0;
    }
}

@-moz-keyframes blink {
    0% {
        opacity: 0;
    }

    50% {
        opacity: 0;
    }

    100% {
        opacity: 0;
    }
}

h2 {
    font-size: 1.5em;
    line-height: 1.6;
    text-align: center;
    margin-top: 110px;
    width: 100%;
    padding: 0;
    border: 0;
}

html {
    line-height: 1;
}

article,
aside,
details,
figcaption,
figure,
footer,
header,
hgroup,
menu,
nav,
section,
summary {
    display: block;
}

a {
    color: #9b4849;
    text-decoration: none;
    display: block;
}

a:hover {
    color: #783839;
}

#open {
    width: 150px;
    text-align: center;
    margin: 50px auto 0;
}

#flip {
    margin: 160px 20px 0 0;
    float: right;
}

#flip2back {
    margin-top: 60px;
    float: right;
}

#close {
    position: absolute;
    bottom: 5px;
    right: 15px;
}

section.container {
    display: none;
    position: relative;
    width: 600px;
    height: 300px;
    perspective: 1000px;
    margin: 10px;
}

section.container>form.flip {
    width: 100%;
    height: 100%;
    position: absolute;
    transform: rotateY(180deg);
    transform-style: preserve-3d;
    transition: transform 0.7s 0s;
    transform-origin: center center;
}

section.container>form.flip>.back,
section.container>form.flip>.front {
    position: absolute;
    width: 100%;
    height: 100%;
    -webkit-backface-visibility: hidden;
    backface-visibility: hidden;
}

.letter-name {
    font-size: 1.5em;
    line-height: 1.6;
    text-align: center;
    margin-top: 110px;
    width: 100%;
    padding: 0;
    border: 0;
}

section.container>form.flip>.back {
    transform: rotateY(180deg);
    background: #837362;
    box-shadow: inset 0 10px 30px -10px rgba(0, 0, 0, 0.3),
        inset 0 1px 0 rgba(0, 0, 0, 0.2), inset 0 2px 0 hsla(0, 0%, 100%, 0.2);
}

section.container:target>form.flip {
    transform: rotateY(0deg);
}

.no-csstransforms3d section.container:target>form.flip>.back {
    display: none;
}

.container#lid {
    position: relative;
    width: 100%;
    height: 50%;
    perspective: 800px;
    z-index: 2;
    transition: z-index 0s 1s;
}

.no-csstransforms3d .container#lid {
    -webkit-transition: none;
    -moz-transition: none;
    transition: none;
}

#content:target .container#lid {
    z-index: -1;
    transition: z-index 0s 0.5s;
}

.no-csstransforms3d #content:target .container#lid {
    -webkit-transition: none;
    -moz-transition: none;
    transition: none;
}

.no-csstransforms3d .container#lid .back {
    display: none;
}

.no-csstransforms3d #content:target .container#lid .back {
    display: block;
    top: -150px;
}

#lid .flip {
    width: 100%;
    height: 100%;
    position: absolute;
    transform-style: preserve-3d;
    transition: transform 0.5s 1s;
    transform-origin: left top;
}

#lid .flip>.back,
#lid .flip>.front {
    position: absolute;
    width: 100%;
    height: 100%;
    -webkit-backface-visibility: hidden;
    backface-visibility: hidden;
}

#lid .flip>.back {
    transform: rotateX(180deg);
}

#content:target #lid .flip {
    transform: rotateX(180deg);
    transition-duration: 0.5s;
    transition-delay: 0s;
}

#letter .flip>div,
#lid .flip>div,
section.container>form.flip>div {
    box-sizing: border-box;
}

#lid .flip .front,
section.container>form.flip .front {
    background: beige var(--letterBg);
    border: 1px solid #eae1d5;
    box-shadow: inset 0 0 10px 1px hsla(0, 0%, 100%, 0.6),
        0 2px 3px -2px rgba(0, 0, 0, 0.6);
    padding: 20px;
    color: #837362;
    text-shadow: 0 1px 0 #fff, 0 1px 0 #fff;
}

section.container>form.flip>.front {
    font-size: 1.25em;
    background: var(--letterStamp) no-repeat 20px 20px, beige var(--letterBg);
    border: 1px solid #eae1d5;
}

#lid .flip .front {
    font-size: 1.25em;
    border-radius: 0 0 40px 40px;
}

#lid .flip .back {
    background: #837362;
    border-radius: 40px 40px 0 0;
    border: 35px solid hsla(0, 0%, 100%, 0.1);
    border-bottom: none;
    box-shadow: inset 0 10px 30px 10px rgba(0, 0, 0, 0.1);
}

#top {
    text-align: right;
    background: beige var(--letterBg);
    box-sizing: border-box;
    width: 100%;
    height: 65%;
    position: absolute;
    left: 0;
    bottom: 0;
    z-index: 1;
    border: 1px solid #eae1d5;
    box-shadow: inset 0 0 10px 1px hsla(0, 0%, 100%, 0.6),
        0 -2px 4px -3px rgba(0, 0, 0, 0.75), 0 2px 3px -2px rgba(0, 0, 0, 0.6);
}

#letter {
    background: #fafafa;
    width: 90%;
    height: 95%;
    position: absolute;
    left: 5%;
    top: 5%;
    z-index: 0;
    transition: 0s 0s;
}

#content:target #letter {
    top: -60%;
    transition: 0.5s 0.5s;
}

#letter .container {
    position: absolute;
    width: 100%;
    perspective: 800px;
    top: 0;
    left: 0;
    transition: 0s 0s;
    z-index: 1;
}

#letter .flip {
    width: 100%;
    height: 100%;
    position: absolute;
    transform-style: preserve-3d;
    transition: transform 0.5s 0s;
    transform-origin: left top;
}

#letter .flip>.back,
#letter .flip>.front {
    position: absolute;
    width: 100%;
    height: 100%;
    -webkit-backface-visibility: hidden;
    backface-visibility: hidden;
}

#letter .flip>.back {
    transform: rotateX(180deg);
}

#content:target #letter .flip {
    transform: rotateX(180deg);
    transition-duration: 0.5s;
    transition-delay: 1s;
}

#content:target #letter .container {
    z-index: -1;
    transition: z-index 0s 1.5s;
}

#letter .flip .front {
    background: #fafafa;
    box-shadow: 0 2px 3px 0 rgba(0, 0, 0, 0.2);
}

.no-csstransforms3d #content:target #letter .flip .front {
    display: none;
}

#letter .flip .back {
    background: #fafafa;
    padding: 40px 40px 0;
    font-size: 18px;
    line-height: 1.5;
    border-bottom: 1px solid hsla(0, 0%, 100%, 0.5);
    box-shadow: 0 -5px 8px -4px rgba(0, 0, 0, 0.15);
}

.no-csstransforms3d #content:target #letter .flip .back {
    top: -140px;
}

input[type='text'] {
    background: transparent;
    border: none;
    border-bottom: 1px dotted #837362;
    box-shadow: 0 1px 0 rgba(255, 255, 255, 0.4);
    width: 50%;
    appearance: none;
}

input[type='text']:focus {
    outline: none;
    border-bottom: 1px solid #837362;
    appearance: none;
}

textarea {
    margin: 10px auto 0;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    width: 90%;
    height: 160px;
    padding: 10px;
    display: block;
    background: transparent;
    background: rgba(255, 255, 255, 0.07);
    border: 1px dashed #c8bfb6;
}

textarea:focus {
    outline: none;
    background-color: rgba(255, 255, 255, 0.12);
    border-color: rgba(255, 255, 255, 0.46);
    box-shadow: inset 0 0 2px rgba(0, 0, 0, 0.1);
}

input[type='submit'] {
    cursor: pointer;
    display: block;
    margin: 10px auto;
    appearance: none;
    font-size: 0.9em;
    background: #9b4849;
    padding: 5px 20px;
    border-radius: 3px;
    border: 1px solid #9b4849;
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.5);
    color: #fff;
    transition: background 0.5s;
}

input[type='submit']:hover {
    background: #783839;
}

.container.target>form.flip>.back,
#content.target #letter .flip .front {
    display: none;
}

#content.target .container#lid {
    z-index: -1;
}

#content.target .container#lid .back {
    display: block;
    top: -150px;
}

#content.target #letter {
    top: -40%;
}

#content.target #letter .flip .back {
    top: -140px;
}
</style>
