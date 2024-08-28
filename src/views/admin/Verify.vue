<template>
    <div class="myCenter verify-container">
        <!-- 背景图片 -->
        <el-image class="my-el-image" style="position: absolute" v-once lazy :src="store.state.webInfo.randomCover[
            Math.floor(Math.random() * store.state.webInfo.randomCover.length)
        ]
            " fit="cover">
            <template v-slot:error>
                <div class="image-slot"></div>
            </template>
        </el-image>
        <div class="verify-content">
            <div>
                <el-avatar :size="50" :src="store.state.webInfo.avatar"></el-avatar>
            </div>
            <el-form style="margin-top: 25px">
                <div>
                    <el-input v-model="account">
                        <template v-slot:prepend>账号</template>
                    </el-input>
                </div>
                <div style="margin-top: 25px">
                    <el-input v-model="password" type="password">
                        <template v-slot:prepend>密码</template>
                    </el-input>
                </div>
            </el-form>
            <div>
                <ProButton :info="'提交'" @click="login()" :before="constant.before_color_2"
                    :after="constant.after_color_2">
                </ProButton>
            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted, reactive, toRefs, inject } from 'vue';
import ProButton from '../../components/common/ProButton.vue'
import { useStore } from "vuex";
import { useRouter, useRoute } from "vue-router";
import { ElMessage } from "element-plus";

// hooks
const common = inject("$common");
const constant = inject("$constant");
const http = inject("$http");

const store = useStore();
const router = useRouter();
const route = useRoute();

const data = reactive({
    redirect: route.query.redirect || '/', // Provide a default value if redirect is undefined
    account: '',
    password: ''
});



onMounted(() => {
    const webStaticResourcePrefix = import.meta.env.VITE_WEB_STATIC_RESOURCE_PREFIX;
    const font = new FontFace(
        'poetize-font',
        `url(${webStaticResourcePrefix}assets/font/font.woff2)`
    );
    font.load()
        .then(() => document.fonts.add(font))
        .catch(err => console.error('Font loading failed:', err));
});

const login = () => {
    if (common.isEmpty(data.account) || common.isEmpty(data.password)) {
        ElMessage({
            message: '请输入账号或密码！',
            type: 'error',
        });
        return;
    }

    const user = {
        account: data.account.trim(),
        password: common.encrypt(data.password.trim()),
        isAdmin: true,
    };

    http.post(constant.baseURL + '/user/login', user, true, false)
        .then((res) => {
            if (!common.isEmpty(res.data)) {
                localStorage.setItem('adminToken', res.data.accessToken);
                store.commit('loadCurrentAdmin', res.data);
                data.account = '';
                data.password = '';
                router.push({ path: data.redirect });
            }
        })
        .catch((error) => {
            ElMessage({
                message: error.message,
                type: 'error',
            });
        });
};

const {redirect,account,password} = toRefs(data)

</script>

<style scoped>
.verify-container {
    height: 100vh;
    background: var(--backgroundPicture) center center / cover repeat;
}

.verify-content {
    background: var(--maxWhiteMask);
    padding: 30px 40px 5px;
    position: relative;
}
:deep(.el-input__inner ){
    border: none !important;  /* 移除边框 */
    box-shadow: none !important;  /* 移除阴影 */
  }

.verify-content>div:first-child {
    position: absolute;
    left: 50%;
    transform: translate(-50%);
    top: -25px;
}

.verify-content>div:not(:first-child) {
    margin: 25px 0;
}

.verify-content>div:last-child>div {
    margin: 0 auto;
}
</style>
