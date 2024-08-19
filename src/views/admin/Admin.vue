<template>
    <div>
        <MyHeader></MyHeader>
        <Sidebar></Sidebar>
        <div class="content-box">
            <div class="content">
                <router-view></router-view>
            </div>
        </div>
    </div>
</template>

<script setup>
import MyHeader from './common/MyHeader.vue'
import Sidebar from './common/Sidebar.vue'
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";

//hooks
const common = inject("$common");
const constant = inject("$constant");
const http = inject("$http");

const store = useStore();
const router = useRouter();

let root = document.querySelector(':root')
let webStaticResourcePrefix = import.meta.env.VITE_WEB_STATIC_RESOURCE_PREFIX
root.style.setProperty(
    '--backgroundPicture',
    'url(' + webStaticResourcePrefix + 'assets/image/backgroundPicture.jpg)'
)
const font = new FontFace(
    'poetize-font',
    'url(' + webStaticResourcePrefix + 'assets/font/font.woff2)'
)
font.load()
document.fonts.add(font)

const verifyToken = () => {
    let adminToken = common.encrypt(localStorage.getItem('adminToken'))
    // 跳转之前判断用户token是否正常，是否过期
    http.get(constant.baseURL + '/user/verifyToken',{ token: adminToken },false,false)
        .then((res) => {
            return res.data
        })
        .catch((error) => {
            ElMessage({
                message: error.message,
                type: 'error',
            })
            store.commit('loadCurrentAdmin', {})
            localStorage.removeItem('adminToken')
            router.push({ path: '/' })
        })
}
</script>

<style scoped>
.content-box {
    position: absolute;
    left: 130px;
    right: 0;
    top: 70px;
    bottom: 0;
    transition: left 0.3s ease-in-out;
}

.content {
    width: auto;
    height: 100%;
    padding: 30px;
    overflow-y: scroll;
}
</style>
