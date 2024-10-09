<template>
    <div>
        <!-- 封面 -->
        <div class="bg-wrap my-animation-slide-top">
            <!-- 背景图片 -->
            <el-image class="love-image my-el-image" lazy :src="love.bgCover" fit="cover">
                <template v-slot:error>
                    <div class="image-slot"></div>
                </template>
            </el-image>

            <!-- 对象 -->
            <div class="love-wrap transformCenter">
                <div>
                    <el-avatar class="love-avatar" :src="love.manCover"></el-avatar>
                    <div class="love-title">
                        {{ love.manName }}
                    </div>
                </div>
                <div>
                    <img class="love-img" :src="webStaticResourcePrefix + 'assets/image/loveLike.svg'" alt="心心" />
                </div>
                <div>
                    <el-avatar class="love-avatar" :src="love.womanCover"></el-avatar>
                    <div class="love-title">
                        {{ love.womanName }}
                    </div>
                </div>
            </div>

            <div id="bannerWave1"></div>
            <div id="bannerWave2"></div>
        </div>

        <!-- 内容 -->
        <div class="love-container">
            <div class="myCenter love-content">
                <!-- 时间 -->
                <div>
                    <!-- 计时 -->
                    <div>
                        <div class="love-time-title1">这是我们一起走过的</div>
                        <div class="love-time1">
                            第
                            <span class="love-time1-item">{{ timing.year }}</span>
                            年
                            <span class="love-time1-item">{{ timing.month }}</span>
                            月
                            <span class="love-time1-item">{{ timing.day }}</span>
                            日
                            <span class="love-time1-item">{{ timing.hour }}</span>
                            时
                            <span class="love-time1-item">{{ timing.minute }}</span>
                            分
                            <span class="love-time1-item">{{ timing.second }}</span>
                            秒
                        </div>
                    </div>
                    <!-- 倒计时 -->
                    <div class="love-time-title2" v-if="
                        !common.isEmpty(love.countdownTitle) ||
                        !common.isEmpty(love.countdownTime)
                    ">
                        {{ love.countdownTitle }}: {{ countdownChange }}
                    </div>
                </div>
            </div>

            <div style="padding: 0 20px">
                <div class="family-button shadow-box-mini">
                    <span class="family-button-title" @click="gotoLetter()">飞车传信</span>
                    <span class="family-button-car">
                        <svg viewBox="0 0 1024 1024" width="40" height="40">
                            <path
                                d="M399.502 655.103c0 7.902-6.665 14.311-14.88 14.311H72.188c-8.215 0-14.875-6.407-14.875-14.311v-28.634c0-7.913 6.66-14.315 14.875-14.315h312.435c8.217 0 14.88 6.402 14.88 14.315l-0.001 28.634zM968.167 655.103c0 7.902-6.664 14.311-14.882 14.311H640.851c-8.216 0-14.877-6.407-14.877-14.311v-28.634c0-7.913 6.661-14.315 14.877-14.315h312.436c8.218 0 14.882 6.402 14.882 14.315l-0.002 28.634z"
                                fill="#EA0606"></path>
                            <path
                                d="M968.097 624.008c0 11.563-17.723 20.937-39.583 20.937H97.263c-21.858 0-39.579-9.372-39.579-20.937v-41.876c0-11.562 17.72-20.935 39.579-20.935h831.25c21.86 0 39.583 9.373 39.583 20.935v41.876zM855.003 526.553h-12c0-161.793-151.025-293.421-336.66-293.421-185.633 0-336.656 131.628-336.656 293.421h-12c0-41.334 9.261-81.425 27.527-119.161 17.612-36.384 42.807-69.046 74.886-97.079 65.813-57.509 153.264-89.181 246.243-89.181 92.981 0 180.434 31.672 246.247 89.181 32.079 28.032 57.274 60.693 74.887 97.079 18.264 37.734 27.526 77.826 27.526 119.161z"
                                fill="#EA0606"></path>
                            <path
                                d="M1001.996 588.091c-121.146 13.91-980.875 0-980.875 0s-30.62-203.887 241.944-144.555c171.281-1.178 273.436 0 489.644 0 193.07-59.332 283.186 108.642 249.287 144.555z"
                                fill="#EA0606"></path>
                            <path d="M500.343 214.379h12v330.342h-12z" fill="#EA0606"></path>
                            <path
                                d="M333.217 657.192c0 46.174-38.961 83.602-87.029 83.602-48.056 0-87.021-37.428-87.021-83.602 0-46.172 38.963-83.588 87.021-83.588 48.067 0 87.029 37.417 87.029 83.588z"
                                fill="#FFFFFF"></path>
                            <path
                                d="M246.188 743.794c-49.638 0-90.021-38.85-90.021-86.602 0-47.745 40.383-86.588 90.021-86.588 49.642 0 90.029 38.843 90.029 86.588 0 47.752-40.387 86.602-90.029 86.602z m0-167.19c-46.329 0-84.021 36.151-84.021 80.588 0 44.444 37.692 80.602 84.021 80.602 46.333 0 84.029-36.157 84.029-80.602 0-44.436-37.696-80.588-84.029-80.588z"
                                fill="#440A0A"></path>
                            <path
                                d="M309.872 656.757c0 33.159-27.986 60.035-62.491 60.035-34.51 0-62.487-26.876-62.487-60.035 0-33.16 27.977-60.022 62.487-60.022 34.505 0.001 62.491 26.862 62.491 60.022z"
                                fill="#440A0A"></path>
                            <path
                                d="M271.322 657.558c0 11.747-9.918 21.282-22.151 21.282-12.237 0-22.152-9.535-22.152-21.282 0-11.758 9.916-21.277 22.152-21.277 12.233-0.002 22.151 9.519 22.151 21.277z"
                                fill="#FFFFFF"></path>
                            <path
                                d="M875.521 642.811c0 46.175-38.963 83.603-87.027 83.603-48.061 0-87.021-37.428-87.021-83.603 0-46.173 38.962-83.587 87.021-83.587 48.066 0 87.027 37.414 87.027 83.587z"
                                fill="#FFFFFF"></path>
                            <path
                                d="M788.494 729.413c-49.638 0-90.021-38.85-90.021-86.603 0-47.744 40.384-86.587 90.021-86.587 49.642 0 90.027 38.843 90.027 86.587 0 47.753-40.385 86.603-90.027 86.603z m0-167.189c-46.33 0-84.021 36.151-84.021 80.587 0 44.444 37.691 80.603 84.021 80.603 46.333 0 84.027-36.158 84.027-80.603 0-44.436-37.694-80.587-84.027-80.587z"
                                fill="#440A0A"></path>
                            <path
                                d="M852.174 642.374c0 33.159-27.979 60.037-62.486 60.037-34.512 0-62.487-26.878-62.487-60.037 0-33.161 27.977-60.023 62.487-60.023 34.506-0.001 62.486 26.862 62.486 60.023z"
                                fill="#440A0A"></path>
                            <path
                                d="M813.628 643.173c0 11.75-9.919 21.278-22.153 21.278-12.233 0-22.151-9.528-22.151-21.278 0-11.759 9.919-21.275 22.151-21.275 12.235-0.002 22.153 9.516 22.153 21.275z"
                                fill="#FFFFFF"></path>
                            <path d="M518.135 469.838h56.847v12.556h-56.847z" fill="#FFFFFF"></path>
                            <path
                                d="M522.818 468.694c0 7.902-0.648 14.309-1.445 14.309h-30.37c-0.799 0-1.446-6.406-1.446-14.309V440.06c0-7.912 0.647-14.315 1.446-14.315h30.37c0.797 0 1.445 6.403 1.445 14.315v28.634z"
                                fill="#EA0606"></path>
                        </svg>
                    </span>
                </div>
            </div>

            <div style="padding: 0 20px">
                <!-- 卡片 -->
                <div class="card-wrap" id="card-station">
                    <div class="card-content shadow-box-mini" @click="changeCard(1)">
                        <div>
                            <el-avatar :size="100" :src="webStaticResourcePrefix + 'assets/image/dddd.jpg'">
                            </el-avatar>
                        </div>
                        <div class="card-right">
                            <div class="card-title">点点滴滴</div>
                            <div class="card-desc">☀️今朝有酒今朝醉</div>
                        </div>
                    </div>

                    <div class="card-content shadow-box-mini" @click="changeCard(2)">
                        <div>
                            <el-avatar :size="100" :src="webStaticResourcePrefix + 'assets/image/sgxc.png'">
                            </el-avatar>
                        </div>
                        <div class="card-right">
                            <div class="card-title">时光相册</div>
                            <div class="card-desc">📸记录美好瞬间</div>
                        </div>
                    </div>

                    <div class="card-content shadow-box-mini" @click="changeCard(3)">
                        <div>
                            <el-avatar :size="100" :src="webStaticResourcePrefix + 'assets/image/zfb.png'">
                            </el-avatar>
                        </div>
                        <div class="card-right">
                            <div class="card-title">祝福板</div>
                            <div class="card-desc">📋写下对我们的祝福</div>
                        </div>
                    </div>
                </div>

                <div class="card-container">
                    <div id="treeHole" v-show="card === 1">
                        <div v-if="!common.isEmpty(store.state.currentUser) && store.state.currentUser.isBoss">
                            <TreeHole :treeHoleList="treeHoleList" :avatar="store.state.webInfo.avatar"
                                @deleteTreeHole="deleteTreeHole" :showName="true" :showPlane="true" @launch="launch">
                            </TreeHole>
                            <div class="myCenter proPage" v-if="weiYanPagination.size < weiYanPagination.total"
                                style="margin: 10px 0px 30px 0px">
                                <el-pagination background layout="prev, pager, next" :total="weiYanPagination.total"
                                    :page-size="weiYanPagination.size" :pager-count="5"
                                    @current-change="handlePageChange">
                                </el-pagination>
                            </div>
                        </div>
                        <div v-else>
                            <TreeHole :treeHoleList="treeHoleList" :avatar="store.state.webInfo.avatar"
                                @deleteTreeHole="deleteTreeHole" :showName="true" :showPlane="true"
                                @launch="pageWeiYan">
                            </TreeHole>
                        </div>
                    </div>
                    <div v-show="card === 2">
                        <div v-if="!common.isEmpty(photoTitleList)">
                            <!-- 标签 -->
                            <div class="photo-title-warp" v-if="!common.isEmpty(photoTitleList)">
                                <div v-for="(item, index) in photoTitleList" :key="index" :class="{
                                    isActive: photoPagination.classify === item.classify,
                                }" @click="changePhotoTitle(item.classify)">
                                    <ProTag :info="item.classify + ' ' + item.count" :color="constant.before_color_list[Math.floor(Math.random() * 6)]
                                        " style="margin: 12px">
                                    </ProTag>
                                </div>
                            </div>

                            <div class="photo-title">
                                {{ photoPagination.classify }}
                            </div>

                            <div class="photo-container">
                                <Photo :resourcePathList="photoList" :type="1"></Photo>
                            </div>

                            <div class="pagination-wrap">
                                <div @click="pagePhotos()" class="pagination"
                                    v-if="photoPagination.total !== photoList.length">
                                    下一页
                                </div>
                                <div v-else style="user-select: none">~~到底啦~~</div>
                            </div>
                        </div>
                        <div v-else class="div-content-center" style="user-select: none">
                            ~~到底啦~~
                        </div>
                    </div>
                    <div v-show="card === 3" class="comment-content">
                        <comment :type="'love'"></comment>
                    </div>
                </div>
            </div>

            <el-dialog draggabletitle="点点滴滴" v-model="weiYanDialogVisible" width="40%" :before-close="handleClose"
                :append-to-body="true" destroy-on-close :close-on-click-modal="false" center top="25vh">
                <div>
                    <div class="myCenter" style="padding-bottom: 20px; position: relative">
                        <el-radio-group v-model="isPublic" class="radio-group-center">
                            <el-radio-button :value="true">公开</el-radio-button>
                            <el-radio-button :value="false">私密</el-radio-button>
                        </el-radio-group>
                    </div>
                    <commentBox @submitComment="submitWeiYan"></commentBox>
                </div>
            </el-dialog>

            <div>
                <!-- 页脚 -->
                <myFooter></myFooter>
            </div>
        </div>
    </div>
</template>

<script setup>
import TreeHole from '../components/common/TreeHole.vue'
import Comment from '../components/comment/Comment.vue'
import CommentBox from '../components/comment/CommentBox.vue'
import MyFooter from '../components/common/MyFooter.vue'
import Photo from '../components/common/Photo.vue'
import ProTag from '../components/common/ProTag.vue'
import 'vditor/dist/index.css'
import { onMounted, reactive, toRefs, inject, nextTick } from 'vue';
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { ElMessage, ElMessageBox } from "element-plus";

//hooks
const common = inject("$common");
const constant = inject("$constant");
const http = inject("$http");

const store = useStore();
const router = useRouter();

const data = reactive({
    weiYanDialogVisible: false,
    isPublic: true,
    love: {
        bgCover: '',
        manCover: '',
        womanCover: '',
        manName: '',
        womanName: '',
        countdownTitle: '',
        countdownTime: '',
        timing: '',
        userId: '',
    },
    weiYanPagination: {
        current: 1,
        size: 12,
        total: 0,
        classify: 'love',
    },
    photoPagination: {
        current: 1,
        size: 10,
        total: 0,
        resourceType: 'lovePhoto',
        classify: '',
        status: true,
    },
    treeHoleList: [],
    photoTitleList: [],
    photoList: [],
    card: null,
    countdownChange: '',
    timing: {
        year: 0,
        month: 0,
        day: 0,
        hour: 0,
        minute: 0,
        second: 0,
    },
    webStaticResourcePrefix: import.meta.env.VITE_BASE_URL + "/"
})



onMounted(() => {

    // 加载family信息
    getFamily();
    getPhotoTitles()
})

const handlePageChange = async (currentPage) => {
    data.weiYanPagination.current = currentPage
    getWeiYan()
    document.querySelector('#card-station').scrollIntoView({
        behavior: 'smooth',
        block: 'start',
        inline: 'nearest',
    })
}
const handleClose = () => {
    data.weiYanDialogVisible = false
}
const submitWeiYan = (content) => {
    let weiYan = {
        content: content,
        isPublic: data.isPublic,
        type: 'love'
    }

    http.post(constant.baseURL + '/weiYan/saveWeiYan', weiYan)
        .then((res) => {
            ElMessage({
                message: '发送成功！',
                type: 'success',
            })
            getWeiYan()
        })
        .catch((error) => {
            ElMessage({
                message: error.message,
                type: 'error',
            })
        })
    handleClose()
}

// 获取admin family信息
const getFamily = () => {
    http.get(constant.baseURL + '/family/getFamily')
        .then((res) => {
            if (!common.isEmpty(res.data)) {
                data.love = res.data
                getLove();
                countdown();
            }
        })
        .catch((error) => {
            ElMessage({
                message: error.message,
                type: 'error',
            })
        })
}

const gotoLetter = () => {
    router.push({ path: '/letter' })
}

// 头像分类
const getPhotoTitles = () => {
    http.get(constant.baseURL + '/webInfo/listAdminLovePhoto')
        .then((res) => {
            if (!common.isEmpty(res.data)) {
                data.photoTitleList = res.data
                data.photoPagination = {
                    current: 1,
                    size: 10,
                    total: 0,
                    resourceType: 'lovePhoto',
                    classify: data.photoTitleList[0].classify,
                    status: true,
                }
                changePhoto()
            }
        })
        .catch((error) => {
            ElMessage({
                message: error.message,
                type: 'error',
            })
        })
}

// 切换图片分类
const changePhotoTitle = (classify) => {
    if (classify !== data.photoPagination.classify) {
        data.photoPagination = {
            current: 1,
            size: 10,
            total: 0,
            resourceType: 'lovePhoto',
            classify: classify,
            status: true,
        }
        data.photoList = []
        changePhoto()
    }
}

// 设置表白时间
const getLove = () => {
    if (common.isEmpty(data.love.timing)) {
        return;
    }
    let diff = common.timeDiff(data.love.timing);
    data.timing.year = diff.diffYear;
    data.timing.month = diff.diffMonth;
    data.timing.day = diff.diffDay;
    data.timing.hour = diff.diffHour;
    data.timing.minute = diff.diffMinute;
    data.timing.second = diff.diffSecond;
}

// 下一页图片
const pagePhotos = () => {
    data.photoPagination.current = data.photoPagination.current + 1
    changePhoto()
}
// 切换图片列表
const changePhoto = () => {
    http.post(constant.baseURL + '/webInfo/listResourcePath', data.photoPagination)
        .then((res) => {
            if (!common.isEmpty(res.data)) {
                data.photoList = data.photoList.concat(res.data.records);
                data.photoPagination.total = res.data.total;
            }
        })
        .catch((error) => {
            ElMessage({
                message: error.message,
                type: 'error',
            })
        })
}

// 计时器
const countdown = () => {
    if (common.isEmpty(data.love.countdownTime)) {
        return;
    }
    let countdown = common.countdown(data.love.countdownTime);
    data.countdownChange = countdown.d + "天" + countdown.h + "时" + countdown.m + "分" + countdown.s + "秒";
}

// 切换card
const changeCard = (card) => {
    if (data.card !== card) {
        data.card = card;
    } else {
        data.card = null;
    }

    if (card === 1) {
        if (common.isEmpty(data.treeHoleList)) {
            getWeiYan();
        }
    } else if (card === 2) {
        if (common.isEmpty(data.photoTitleList)) {
            getPhotoTitles();
        }
    }
}

// 随笔加载下一页
// 站长新增随笔
const launch = () => {
    if (common.isEmpty(store.state.currentUser)) {
        ElMessage({
            message: "请先登录！",
            type: "error"
        });
        return;
    }
    if (!store.state.currentUser.isBoss) {
        ElMessage({
            message: "没有权限！",
            type: "error"
        });
        return;
    }
    data.weiYanDialogVisible = true;
}

// 用户加载随笔
const pageWeiYan = () => {
    data.weiYanPagination.current = data.weiYanPagination.current + 1;
    getWeiYan();
}

const getWeiYan = () => {
    data.weiYanPagination.userId = data.love.userId;
    http.post(constant.baseURL + '/weiYan/listWeiYan', data.weiYanPagination)
        .then((res) => {
            if (!common.isEmpty(res.data)) {
                res.data.records.forEach(c => {
                    c.content = c.content.replace(/\n{2,}/g, '<div style="height: 12px"></div>');
                    c.content = c.content.replace(/\n/g, '<br/>');
                    c.content = common.faceReg(c.content);
                    c.content = common.pictureReg(c.content);
                });
                // 判断是否是站长
                if (!common.isEmpty(store.state.currentUser) && store.state.currentUser.isBoss) {
                    data.treeHoleList = res.data.records
                } else {
                    if (common.isEmpty(res.data.records)) {
                        ElMessage({
                            message: '到底啦~~',
                            type: 'warning',
                        })
                    }
                    data.treeHoleList = data.treeHoleList.concat(res.data.records);
                }
                data.weiYanPagination.total = res.data.total
            }
            nextTick(() => {
                common.imgShow("#treeHole .pictureReg");
            });
        })
        .catch((error) => {
            ElMessage({
                message: error.message,
                type: 'error',
            })
        })
}


// 根据id删除随笔
const deleteTreeHole = (id) => {
    if (common.isEmpty(store.state.currentUser)) {
        ElMessage({
            message: "请先登录！",
            type: "error"
        });
        return;
    }

    ElMessageBox.confirm('确认删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'success',
        center: true
    }).then(() => {
        http.get(constant.baseURL + "/weiYan/deleteWeiYan", { id: id })
            .then((res) => {
                ElMessage({
                    type: 'success',
                    message: '删除成功!'
                });
                data.weiYanPagination.current = 1;
                data.treeHoleList = [];
                getWeiYan();
            })
            .catch((error) => {
                ElMessage({
                    message: error.message,
                    type: "error"
                });
            });
    }).catch(() => {
        ElMessage({
            type: 'success',
            message: '已取消删除!'
        });
    });
}

const { weiYanDialogVisible, isPublic, love,weiYanPagination, photoPagination, treeHoleList, photoTitleList,
    photoList, card, countdownChange, timing,webStaticResourcePrefix } = toRefs(data)
</script>
<style>
.warning-icon {
    position: absolute;
    right: 0;
    cursor: pointer;
}

.box-width {
    width: 35%;
}

.vditor-reset {
    font-family: var(--globalFont), serif;
}
</style>

<style scoped>
.love-container {
    background-image: linear-gradient(to right,
            rgba(37, 82, 110, 0.1) 1px,
            var(--background) 1px),
        linear-gradient(to bottom,
            rgba(37, 82, 110, 0.1) 1px,
            var(--background) 1px);
    background-size: 3rem 3rem;
}

.photo-container {
    max-width: 1170px;
    margin: auto;
}

.bg-wrap {
    height: 55vh;
    position: relative;
    overflow: hidden;
}

.love-image::before {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: var(--miniMask);
}

.love-wrap {
    width: 90%;
    background: rgba(255, 255, 255, 0.1);
    max-width: 950px;
    border-radius: 3em;
    display: flex;
    align-items: center;
    justify-content: space-around;
    padding: 50px 70px 30px 70px;
}

.love-avatar {
    border: rgba(255, 255, 255, 0.2) 4px solid;
    width: 180px;
    height: 180px;
}

.love-title {
    margin-top: 15px;
    text-align: center;
    font-size: 25px;
    font-weight: 700;
    color: var(--white);
}

.love-img {
    animation: imgScale 2s linear infinite;
    width: 120px;
    height: 120px;
}

#bannerWave1 {
    height: 84px;
    background: var(--bannerWave1);
    position: absolute;
    width: 200%;
    bottom: 0;
    z-index: 10;
    animation: gradientBG 120s linear infinite;
}

#bannerWave2 {
    height: 100px;
    background: var(--bannerWave2);
    position: absolute;
    width: 400%;
    bottom: 0;
    z-index: 5;
    animation: gradientBG 120s linear infinite;
}

.love-content {
    max-width: 1200px;
    overflow: hidden;
    margin: 20px auto 0;
    user-select: none;
}

.love-time-title1 {
    font-size: 2rem;
    font-weight: 600;
    letter-spacing: 0.2rem;
    line-height: 4rem;
    text-align: center;
    background-image: linear-gradient(270deg,
            #ff4500,
            orange,
            gold,
            #90ee90,
            #0ff,
            #1e90ff,
            #9370db,
            #ff69b4,
            #ff4500);
    -webkit-animation: jianBian 60s linear infinite;
    background-clip: text;
    animation: jianBian 60s linear infinite;
    width: 3000px;
    color: transparent;
}

.love-time-title2 {
    text-align: center;
    font-size: 1.5rem;
    line-height: 4rem;
    font-weight: 600;
    letter-spacing: 2px;
}

.love-time1 {
    text-align: center;
    font-size: 2rem;
    font-weight: 700;
}

.love-time1-item {
    font-size: 4rem;
    font-weight: 700;
}

.card-wrap {
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    justify-content: center;
    padding: 20px 0;
}

.card-content {
    display: flex;
    padding: 25px;
    margin: 25px auto;
    border-radius: 20px;
    max-width: 780px;
    cursor: pointer;
    transition: all 0.3s;
    background: var(--background);
}

.card-content:hover,
.family-button:hover,
.family-wrap:hover {
    transform: translateY(-6px);
}

.card-right {
    margin-left: 20px;
}

.card-title {
    font-size: 1.6rem;
    letter-spacing: 0.2rem;
    line-height: 3.5rem;
    font-weight: 700;
}

.card-desc {
    font-size: 1.1rem;
    letter-spacing: 0.2rem;
    color: #777777;
}

.card-container {
    max-width: 1500px;
    margin: 20px auto 40px;
}

.pagination-wrap {
    display: flex;
    justify-content: center;
    margin-top: 40px;
}

.pagination {
    padding: 13px 15px;
    border: 1px solid var(--lightGray);
    border-radius: 3rem;
    color: var(--greyFont);
    width: 100px;
    user-select: none;
    cursor: pointer;
    text-align: center;
}

.pagination:hover {
    border: 1px solid var(--themeBackground);
    color: var(--themeBackground);
    box-shadow: 0 0 5px var(--themeBackground);
}

.comment-content {
    max-width: 1000px;
    margin: 0 auto;
}

.photo-title {
    text-align: center;
    font-size: 30px;
    font-weight: 700;
    line-height: 50px;
    letter-spacing: 2px;
}

.photo-title-warp {
    max-width: 1150px;
    margin: 30px auto 15px;
    padding: 10px;
    border-radius: 10px;
    display: flex;
    flex-wrap: wrap;
}

.isActive {
    animation: scale 2.5s ease-in-out infinite;
}

.tree-hole-go {
    color: var(--blue);
    font-weight: 700;
    font-size: 25px;
    margin: 20px auto;
    text-align: center;
}

.tree-hole-go i {
    cursor: pointer;
}

.tree-hole-go i:hover {
    animation: scale 1s linear infinite;
}

.family-button {
    position: relative;
    overflow: hidden;
    height: 120px;
    color: var(--white);
    margin: 50px auto 0px;
    border-radius: 20px;
    max-width: 340px;
    transition: all 0.3s;
    background: var(--love) center center / cover no-repeat;
    user-select: none;
}

.family-button::before {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: var(--miniMask);
}

.family-button-title,
.family-button-love {
    cursor: pointer;
    position: absolute;
    line-height: 120px;
    font-size: 25px;
    font-weight: 700;
    color: var(--white);
}

.family-button-title {
    margin-left: 15px;
}

.family-button-love {
    right: 0;
    margin-right: 15px;
}

.family-button-car {
    position: absolute;
    margin-left: 170px;
    margin-top: 40px;
    animation: passing 4s linear infinite;
}

.family-container {
    display: flex;
    justify-content: space-around;
    flex-wrap: wrap;
    margin-bottom: 40px;
}

.family-wrap {
    cursor: pointer;
    width: 350px;
    border-radius: 20px;
    display: flex;
    align-items: center;
    justify-content: space-around;
    padding: 15px 25px 5px 25px;
    margin: 20px;
    transition: all 0.3s;
    user-select: none;
}

.family-avatar {
    border: rgba(255, 255, 255, 0.2) 4px solid;
    width: 90px;
    height: 90px;
}

.family-title {
    margin-top: 15px;
    text-align: center;
    font-size: 20px;
    font-weight: 700;
    color: var(--white);
}

.family-img {
    animation: imgScale 2s linear infinite;
    width: 60px;
    height: 60px;
}

.family-bottom-wrap {
    display: flex;
    justify-content: space-around;
    margin: 0 0 40px;
}

.family-bottom {
    color: var(--white);
    border-radius: 3rem;
    width: 150px;
    text-align: center;
    height: 50px;
    cursor: pointer;
    user-select: none;
}

.form-main {
    animation: hideToShow 2s;
    border-radius: 12px;
    overflow: hidden;
}

.user-content>div {
    height: 65px;
    display: flex;
    align-items: center;
}

.user-content :deep(.el-input__inner) {
    border: none;
    height: 40px;
    width: 300px;
    background: var(--whiteMask);
}

.user-content :deep(.el-textarea__inner) {
    border: none;
    width: 250px;
    background: var(--whiteMask);
}

.user-content :deep(.el-input__count) {
    background: var(--transparent);
    user-select: none;
}

.form-friend {
    background-color: #eeeeee;
    padding: 20px 0;
}

.form-title {
    margin: 10px;
    text-align: center;
}

.my-vditor {
    width: 400px !important;
}

@media screen and (max-width: 1200px) {
    .user-content>div {
        display: unset;
        align-items: unset;
    }

    .my-vditor {
        width: 380px !important;
    }
}

@media screen and (max-width: 800px) {
    .love-wrap {
        border-radius: 1.5em;
        padding: 40px 30px 10px 30px;
    }

    .love-avatar {
        width: 120px;
        height: 120px;
    }

    .love-img {
        width: 100px;
        height: 100px;
    }

    .love-time1 {
        font-size: 1.4rem;
    }

    .love-time1-item {
        font-size: 3rem;
    }

    .my-vditor {
        width: 350px !important;
    }
}

@media screen and (max-width: 600px) {
    .love-wrap {
        padding: 30px 20px 10px 20px;
    }

    .love-avatar {
        width: 100px;
        height: 100px;
    }

    .love-img {
        width: 80px;
        height: 80px;
    }

    .love-time1 {
        font-size: 1rem;
    }

    .love-time1-item {
        font-size: 1.8rem;
    }

    .love-time-title2 {
        font-size: 1.2rem;
    }

    .user-content :deep(.el-textarea__inner) {
        width: 100%;
    }

    .user-content :deep(.el-input__inner) {
        width: 190px;
    }

    .card-container .tree-hole-container {
        padding: 0;
    }

    .my-vditor {
        width: 280px !important;
    }
}

@media screen and (max-width: 450px) {
    .my-vditor {
        width: 240px !important;
    }
}

@media screen and (max-width: 1150px) {
    .card-wrap {
        display: unset;
        justify-content: unset;
    }

    .photo-title-warp {
        max-width: 780px;
    }

    .family-button {
        max-width: 780px;
    }
}

@media screen and (max-width: 1150px) {
    .photo-container {
        max-width: 800px;
    }
}
</style>
