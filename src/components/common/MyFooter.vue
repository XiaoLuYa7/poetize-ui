<template>
    <div class="myFooter-wrap" v-show="showFooter">
        <div class="myFooter">
            <div class="footer-title">{{ footerText }}</div>
            <div class="icp">
                Copyright &copy; 2024 本网站由
                <a href="https://poetize.luckytolu.site" target="_blank">POETIZE</a>
                强力支持
                <a href="http://beian.miit.gov.cn/" target="_blank">备案号：{{ beian }}</a>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue';
import { useStore } from 'vuex';

// 获取环境变量
const beian = import.meta.env.VITE_APP_BEIAN;

const props = defineProps({
    showFooter: {
        type: Boolean,
        default: true
    }
})

// 获取 Vuex store
const store = useStore();

// 从 Vuex store 中获取 footer 信息
const footerText = computed(() => store.state.webInfo.footer);
</script>


<style scoped>
.myFooter-wrap {
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    -webkit-animation: hideToShow 2s;
    animation: hideToShow 2s;
}

.myFooter {
    border-radius: 1.5rem 1.5rem 0 0;
    background: var(--gradientBG);
    text-align: center;
    color: var(--white);
    background-size: 300% 300%;
    -webkit-animation: gradientBG 10s ease infinite;
    animation: gradientBG 10s ease infinite;
}

.footer-title {
    padding-top: 10px;
    font-size: 16px;
}

.icp,
.icp a {
    color: var(--maxGreyFont);
    font-size: 13px;
}

.icp {
    padding-top: 10px;
    padding-bottom: 10px;
}

.icp a {
    text-decoration: none;
    transition: all 0.3s;
}

.icp a:hover {
    color: var(--themeBackground);
}
</style>
