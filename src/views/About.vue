<template>
    <div>
        <!-- 两句诗 -->
        <div class="my-animation-slide-top">
            <TwoPoem :isHitokoto="false"></TwoPoem>
        </div>

        <div class="about-container my-animation-slide-bottom">
            <div class="about-wrap">
                <h1 style="font-size: 40px; font-weight: 500; letter-spacing: 5px">
                    两只毛驴鸣翠柳
                </h1>
                <!-- 对话框 -->
                <div class="about-box">
                    <h4>与 {{ store.state.webInfo.webName }} 对话中...</h4>
                    <div v-if="sayShow" id="say-container"></div>
                </div>
            </div>

            <!-- 页脚 -->
            <MyFooter></MyFooter>
        </div>
    </div>
</template>

<script setup>
import TwoPoem from './../components/common/TwoPoem.vue';
import MyFooter from '../components/common/MyFooter.vue';
import { ref, reactive, inject, toRefs } from 'vue';
import { useStore } from 'vuex';

const common = inject("$common");
const store = useStore();
const data = reactive({
    sayShow: false,
    sayContent: [
        {
            "talk": ["Hi, there👋", "这是一个 Vue2 Vue3 与 SpringBoot 结合的产物~"],
            "reply": ["然后呢？ 😃", "少废话！ 🙄"]
        }, {
            "talk": ["😘",
                "本站平时仅用于交流和学习新知识",
                "如涉及侵权请联系站长删除对应资源，谢谢！！！"],
            "reply": ["这个网站有什么用吗？ 😂"]
        }, {
            "talk": ["拥有自己的独立网站难道不酷吗🚀",
                "那就摸鱼吧👋",
                "摸鱼大军请在聊天室集合🥝"],
            "reply": []
        }
    ],
    sayIndex: 0
});

setTimeout(() => {
    data.sayShow = true;
    say();
}, 2000);

const answer = (index, value) => {
    $('.say-select').remove();

    let htmlStr = `<div class="say-right my-animation-slide-bottom"><span class="say-item-right">${value}</span></div>`;
    let frag = document.createRange().createContextualFragment(htmlStr);
    document.getElementById('say-container').appendChild(frag);
    if (index === 0) {
        setTimeout(() => {
            say();
        }, 500);
    } else {
        let htmlStr = `<div class="say-left my-animation-slide-bottom"><span class="say-item-left">👋 👋 👋</span></div>`;
        let frag = document.createRange().createContextualFragment(htmlStr);
        document.getElementById('say-container').appendChild(frag);
    }
};

const say = () => {
    if (!common.isEmpty(data.sayContent[data.sayIndex]) &&
        !common.isEmpty(data.sayContent[data.sayIndex].talk)) {
        data.sayContent[data.sayIndex].talk.forEach((value, index, talk) => {
            setTimeout(() => {
                let htmlStr = `<div class="say-left my-animation-slide-bottom"><span class="say-item-left">${value}</span></div>`;
                let frag = document.createRange().createContextualFragment(htmlStr);
                document.getElementById('say-container').appendChild(frag);
                if (talk.length === index + 1) {
                    if (!common.isEmpty(data.sayContent[data.sayIndex].reply)) {
                        setTimeout(() => {
                            if (data.sayContent[data.sayIndex].reply.length === 2) {
                                let reply0 = data.sayContent[data.sayIndex].reply[0];
                                let reply1 = data.sayContent[data.sayIndex].reply[1];
                                let htmlStr = `<div class="say-left my-animation-slide-bottom"><span class="say-select">${reply0}</span><span class="say-select">${reply1}</span></div>`;
                                let frag = document
                                    .createRange()
                                    .createContextualFragment(htmlStr);
                                document.getElementById('say-container').appendChild(frag);
                                document.getElementsByClassName('say-select')[0].onclick =
                                    () => {
                                        answer(0, reply0);
                                    };
                                document.getElementsByClassName('say-select')[1].onclick =
                                    () => {
                                        answer(1, reply1);
                                    };
                            } else if (
                                data.sayContent[data.sayIndex].reply.length === 1
                            ) {
                                let reply0 = data.sayContent[data.sayIndex].reply[0];
                                let htmlStr = `<div class="say-left my-animation-slide-bottom"><span class="say-select">${reply0}</span></div>`;
                                let frag = document
                                    .createRange()
                                    .createContextualFragment(htmlStr);
                                document.getElementById('say-container').appendChild(frag);
                                document.getElementsByClassName('say-select')[0].onclick =
                                    () => {
                                        answer(0, reply0);
                                    };
                            }
                            data.sayIndex += 1;
                        }, 500);
                    }
                }
            }, index * 500);
        });
    }
};

const {sayShow,sayContent,sayIndex} = toRefs(data)

</script>

<style>
.about-container {
    background-image: linear-gradient(to right,
            rgba(37, 82, 110, 0.1) 1px,
            var(--background) 1px),
        linear-gradient(to bottom,
            rgba(37, 82, 110, 0.1) 1px,
            var(--background) 1px);
    background-size: 3rem 3rem;
}

.about-wrap {
    text-align: center;
    width: 95%;
    max-width: 800px;
    margin: 0 auto;
    padding: 40px 20px 80px;
}

.about-box {
    min-height: 450px;
    padding: 5px;
    background-color: var(--maxMaxLightGray);
    border-radius: 10px;
}

.say-item-left {
    padding: 5px 12px;
    border-radius: 1rem;
    color: var(--maxGreyFont);
    background-color: var(--lightGray);
}

.say-item-right {
    padding: 5px 12px;
    border-radius: 1rem;
    color: var(--white);
    background-color: var(--translucent);
}

.say-left {
    display: flex;
    justify-content: left;
    margin: 15px;
}

.say-right {
    display: flex;
    justify-content: right;
    margin: 15px;
}

.say-select {
    cursor: pointer;
    background: var(--black);
    border-radius: 5px;
    padding: 5px 10px;
    margin-right: 12px;
    margin-top: 20px;
    color: var(--white);
    border: 1px solid var(--black);
}

.say-select:hover {
    border: 1px solid var(--themeBackground);
    color: var(--themeBackground);
    box-shadow: 0 0 5px var(--themeBackground);
}
</style>
