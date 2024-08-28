<template>
    <div>
        <!-- 框 -->
        <textarea class="comment-textarea" v-model="commentContent" placeholder="写下点什么..." maxlength="1000" />
        <!-- 按钮 -->
        <div class="myBetween" style="margin-bottom: 10px">
            <div style="display: flex">
                <div :class="{ 'emoji-active': showEmoji }" @click="showEmoji = !showEmoji">
                    <el-icon class="myEmoji"><Orange/></el-icon>
                </div>
                <div @click="openPicture">
                    <el-icon class="myPicture"><PictureFilled /></el-icon>
                </div>
            </div>

            <div style="display: flex">
                <ProButton :info="'提交'" @click="submitComment" :before="constant.before_color_2"
                    :after="constant.after_color_2">
                </ProButton>
            </div>
        </div>
        <!-- 表情 -->
        <Emoji @addEmoji="addEmoji" :showEmoji="showEmoji"></Emoji>

        <el-dialog title="图片" v-model="showPicture" width="25%" :append-to-body="true"
            :close-on-click-modal="false" destroy-on-close center top="25vh">
            <div>
                <UploadPicture :prefix="'commentPicture'" @addPicture="addPicture" :maxSize="2" :maxNumber="1">
                </UploadPicture>
            </div>
        </el-dialog>
    </div>
</template>

<script setup>
import { reactive, inject, toRefs } from 'vue'
import { useStore } from 'vuex'
import { ElMessage } from 'element-plus'
import {PictureFilled,Orange} from '@element-plus/icons-vue'

const http = inject("$http");
const common = inject("$common");
const constant = inject("$constant");

const store = useStore()

// 动态导入组件
import Emoji from '../common/Emoji.vue'
import ProButton from '../common/ProButton.vue'
import UploadPicture from '../common/UploadPicture.vue'

const data = reactive({
    commentContent: '',
    showEmoji: false,
    showPicture: false,
    picture: {
        name: store.state.currentUser.username,
        url: ''
    }
})


const emit = defineEmits(['submitComment'])

// 方法
const openPicture = () => {
    if (common.isEmpty(store.state.currentUser)) {
        ElMessage({
            message: '请先登录！',
            type: 'error',
        })
        return
    }
    data.showPicture = true
}

const addPicture = (res) => {
    data.picture.url = res
    savePicture()
}

const savePicture = () => {
    let img = data.picture.name + data.picture.url
    data.commentContent += img
    data.picture.url = ''
    data.showPicture = false
}

const addEmoji = (key) => {
    data.commentContent += key
}

const submitComment = () => {
    if (common.isEmpty(store.state.currentUser)) {
        ElMessage({
            message: '请先登录！',
            type: 'error',
        })
        return
    }

    if (data.commentContent.trim() === '') {
        ElMessage({
            message: '你还没写呢~',
            type: 'warning',
        })
        return
    }

    emit('submitComment', data.commentContent.trim())
    data.commentContent = ''
}

const {commentContent,showEmoji,showPicture,picture} = toRefs(data)

</script>

<style scoped>
.comment-textarea {
    border: 1px solid var(--lightGray);
    width: 100%;
    font-size: 16px;
    padding: 15px;
    min-height: 180px;
    resize: none;
    outline: none;
    border-radius: 4px;
    background-image: var(--commentURL);
    background-size: contain;
    background-repeat: no-repeat;
    background-position: 100%;
    margin-bottom: 10px;
    font-family: var(--globalFont), serif;
}

.comment-textarea:focus {
    border-color: var(--themeBackground);
}

.myEmoji {
    font-size: 18px;
    cursor: pointer;
    transition: all 0.5s;
    margin-right: 12px;
}

.myEmoji:hover {
    transform: rotate(360deg);
    font-size: 22px;
}

.myPicture {
    font-size: 18px;
    cursor: pointer;
}

.emoji-active {
    color: var(--red);
}
</style>
