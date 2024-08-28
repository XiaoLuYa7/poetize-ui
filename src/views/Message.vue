<template>
    <div>
        <div>
            <el-image style="animation: header-effect 2s" class="background-image" v-once lazy :src="store.state.webInfo.randomCover[
                Math.floor(Math.random() * store.state.webInfo.randomCover.length)]
                " fit="cover">
                <template #error>
                    <div class="image-slot background-image-error"></div>
                </template>
            </el-image>
            <!-- 输入框 -->
            <div class="message-in" style="text-align: center">
                <h2 class="message-title">树洞</h2>
                <div>
                    <input class="message-input" type="text" style="outline: none; width: 70%" placeholder="留下点什么啦~"
                        v-model="messageContent" @click="show = true" maxlength="60" />
                    <button v-show="show" style="margin-left: 12px; cursor: pointer; width: 20%" @click="submitMessage"
                        class="message-input">
                        发射
                    </button>
                </div>
            </div>
            <!-- 弹幕 -->
            <div class="barrage-container">
                <vue-danmaku v-model:danmus="danmus" ref="danmakuRef" randomChannel isSuspend useSlot :speeds="140" loop
                    style="height:90%; width:100%;margin-top: 2%;">
                    <template v-slot:dm="{ danmu }">
                        <div
                            :class="(isLogin && store.state.currentUser.id == danmu.userId) ? 'danmu-div-self' : 'danmu-div'">
                            <el-avatar :src="danmu.avatar" :size="32" />
                            <span class="font-class">{{ danmu.msg }}</span>
                        </div>
                    </template>
                </vue-danmaku>
            </div>
        </div>
        <div class="comment-wrap">
            <div class="comment-content">
                <Comment :type="'message'"></Comment>
            </div>
            <MyFooter></MyFooter>
        </div>
    </div>
</template>

<script setup>
import MyFooter from '../components/common/MyFooter.vue';
import Comment from '../components/comment/Comment.vue';
import { reactive, inject, toRefs, onMounted, ref } from 'vue';
import { useStore } from "vuex";
import { ElMessage } from "element-plus";
import vueDanmaku from 'vue3-danmaku'

// hooks
const common = inject("$common");
const constant = inject("$constant");
const http = inject("$http");

const store = useStore();

const data = reactive({
    show: false,
    messageContent: '',
    danmus: [],
    isLogin: !common.isEmpty(store.state.currentUser)
});

const danmakuRef = ref(null)



onMounted(() => {
    getTreeHole();
})

const getTreeHole = () => {
    http.get(constant.baseURL + '/webInfo/listTreeHole')
        .then((res) => {
            if (!common.isEmpty(res.data)) {
                res.data.forEach((m) => {
                    data.danmus.push({
                        userId: m.userId,
                        avatar: m.avatar,
                        msg: m.message
                    });
                });
            }
        })
        .catch((error) => {
            ElMessage({
                message: error.message,
                type: 'error',
            });
        });
};

const submitMessage = () => {
    if (data.messageContent.trim() === '') {
        ElMessage({
            message: '你还没写呢~',
            type: 'warning',
        });
        return;
    }

    let treeHole = {
        message: data.messageContent.trim(),
    };

    if (!common.isEmpty(store.state.currentUser) && !common.isEmpty(store.state.currentUser.avatar)) {
        treeHole.avatar = store.state.currentUser.avatar;
        treeHole.userId = store.state.currentUser.id;
    }

    http.post(constant.baseURL + '/webInfo/saveTreeHole', treeHole)
        .then((res) => {
            if (!common.isEmpty(res.data)) {
                data.danmus.push({
                    userId: res.data.userId,
                    avatar: res.data.avatar,
                    msg: res.data.message
                });
            }
        })
        .catch((error) => {
            ElMessage({
                message: error.message,
                type: 'error',
            });
        });

    data.messageContent = '';
    data.show = false;
};
const { show, messageContent, danmus, isLogin } = toRefs(data)
</script>

<style scoped>
.message-in {
    position: absolute;
    left: 50%;
    top: 40%;
    transform: translate(-50%, -50%);
    color: #ff8cb0;
    animation: hideToShow 2.5s;
    width: 360px;
    z-index: 10;
    padding: 25px 25px 25px 25px;
}

.message-title {
    user-select: none;
    text-align: center;
}

.message-input {
    border-radius: 1.2rem;
    border: #ff8cb0 1px solid;
    color: #ff8cb0;
    background: var(--transparent);
    padding: 10px 10px;
}

.message-input::-webkit-input-placeholder {
    color: #ff8cb0;
}

.barrage-container {
    position: absolute;
    top: 50px;
    left: 0;
    right: 0;
    bottom: 0;
    height: calc(100% - 50px);
    width: 100%;
    user-select: none;
    overflow: hidden;
    z-index: 1;
}

.comment-wrap {
    background: var(--background);
    position: absolute;
    top: 100vh;
    width: 100%;
}

.comment-content {
    max-width: 800px;
    margin: 0 auto;
    padding: 40px 20px;
}

.danmu-div {
    background-color: rgba(0, 0, 0, 0.7);/* 黑色透明背景，50% 不透明度 */
    border-radius: 40px;/* 圆角 */
    color: white;/* 字体颜色为白色 */
    max-width: 100%;/* 设置最大宽度为 100%，防止过宽 */
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);/* 可选：添加一个阴影效果 */
    display: inline-flex; /* 使 div 的宽度根据内容自动调整 */
    align-items: center;/* 垂直居中 */
    justify-content: center;/* 水平居中 */
    padding: 5px 10px;/* 上下间距10px，左右间距20px，确保文字远离圆角 */
    overflow: hidden;/* 隐藏超出圆角区域的文字 */
}

.danmu-div-self {
    background-color: rgba(0, 0, 0, 0.7); /* 黑色透明背景，50% 不透明度 */
    border-radius: 40px;/* 圆角 */
    color: white;/* 字体颜色为白色 */
    max-width: 100%;/* 设置最大宽度为 100%，防止过宽 */
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);/* 可选：添加一个阴影效果 */
    display: inline-flex;/* 使 div 的宽度根据内容自动调整 */
    align-items: center;/* 垂直居中 */
    justify-content: center;/* 水平居中 */
    padding: 5px 10px;/* 上下间距10px，左右间距20px，确保文字远离圆角 */
    overflow: hidden;/* 隐藏超出圆角区域的文字 */
    border: 2px solid white; /* 白色边框，宽度为 2px */
}

.font-class {
    padding-left: 10px;
    font-size: 16px;
}
</style>
