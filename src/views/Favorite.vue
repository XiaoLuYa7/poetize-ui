<template>
    <div>
        <div class="favorite-container">
            <!-- 封面 -->
            <div class="favorite-header my-animation-slide-top">
                <!-- 背景图片 -->
                <video class="index-video" autoplay="autoplay" muted="muted" loop="loop"
                    :src="webStaticResourcePrefix + 'assets/video/backgroundVideo.mp4'"></video>
                <div style="position: absolute; left: 0; top: 0; padding: 5px 20px">
                    <!-- 标题 -->
                    <div style="color: var(--white); margin: 0 10px">
                        <div style="font-size: 30px; font-weight: bold; line-height: 2">
                            收藏夹
                        </div>
                    </div>
                    <div class="card-container">
                        <!-- 收藏夹 -->
                        <div @click="changeFavorite(1)" class="card-item">
                            <div class="favorite-image"></div>
                            <div style=" position: absolute;left: 0;top: 0; padding: 20px 25px 15px;">
                                <div class="card-name">收藏夹</div>
                                <div class="card-desc">将本网站添加到您的收藏夹吧</div>
                            </div>
                        </div>

                        <!-- 相册 -->
                        <div @click="changeFavorite(2)" class="card-item">
                            <div class="favorite-image"></div>
                            <div style=" position: absolute;left: 0;top: 0;padding: 20px 25px 15px;">
                                <div class="card-name">相册集</div>
                                <div class="card-desc">每一张照片都是一次美好的记忆</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 内容 -->
            <div class="favorite-content">
                <!-- 收藏夹 -->
                <div v-show="card === 1" class="my-animation-hideToShow">
                    <div v-if="!common.isEmpty(collects)">
                        <div v-for="(value, key) in collects" :key="key" style="margin-top: 20px">
                            <div class="collect-classify">
                                {{ key }}
                            </div>
                            <div class="favorite-item-wrap">
                                <div v-for="(item, index) in value" :key="index" @click="toUrl(item.url)"
                                    class="favorite-item">
                                    <div>
                                        <el-avatar class="favorite-item-image" :size="60" :src="item.cover">
                                        </el-avatar>
                                    </div>
                                    <div style="width: calc(100% - 80px)">
                                        <div class="favorite-item-title">
                                            {{ item.title }}
                                        </div>
                                        <div class="favorite-item-introduction">
                                            {{ item.introduction }}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="div-content-center" v-else style="user-select: none">
                        ~~到底啦~~
                    </div>
                </div>

                <!-- 相册 -->
                <div v-show="card === 2" class="my-animation-hideToShow">
                    <div class="album-content my-animation-slide-bottom">
                        <!-- 标签 -->
                        <div class="photo-title-warp" v-if="!common.isEmpty(photoTitleList)">
                            <div v-for="(item, index) in photoTitleList" :key="index" :class="{
                                isActive: photoPagination.classify === item.classify,
                            }" @click="changePhotoTitle(item.classify)">
                                <ProTag :info="item.classify + ' ' + item.count" :color="constant.before_color_list[Math.floor(Math.random() * 6)]
                                    " style="margin: 8px">
                                </ProTag>
                            </div>
                        </div>

                        <div class="photo-title">
                            {{ photoPagination.classify }}
                        </div>

                        <Photo :resourcePathList="photoList" :type="2"></Photo>
                        <div class="pagination-wrap">
                            <div @click="pagePhotos()" class="pagination"
                                v-if="photoPagination.total !== photoList.length">
                                下一页
                            </div>
                            <div v-else style="user-select: none">~~到底啦~~</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- 页脚 -->
        <div style="background: var(--favoriteBg)">
            <MyFooter></MyFooter>
        </div>
    </div>
</template>

<script setup>
import MyFooter from '../components/common/MyFooter.vue';
import ProTag from '../components/common/ProTag.vue';
import Photo from '../components/common/Photo.vue';
import { inject, onMounted, reactive, toRefs } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';

// hooks
const common = inject("$common");
const constant = inject("$constant");
const http = inject("$http");

const store = useStore();
const router = useRouter();

const data = reactive({
    card: 1,
    collects: {},
    photoPagination: {
        current: 1,
        size: 10,
        total: 0,
        resourceType: 'albums',
        classify: '',
        status: true,
    },
    photoTitleList: [],
    photoList: [],
    webStaticResourcePrefix: import.meta.env.VITE_WEB_STATIC_RESOURCE_PREFIX
});

onMounted(() => {
    getCollect();
    getPhotoTitles();
})

const toUrl = (url) => {
    window.open(url);
};

const changeFavorite = (card) => {
    if (card === 1) {
        if (common.isEmpty(data.collects)) {
            getCollect(card);
        }
    }
    data.card = card;
};

const getCollect = () => {
    http.get(constant.baseURL + '/webInfo/listCollect')
        .then((res) => {
            if (!common.isEmpty(res.data)) {
                data.collects = res.data;
            }
        })
        .catch((error) => {
            ElMessage({
                message: error.message,
                type: 'error',
            });
        });
};

const getPhotoTitles = () => {
    http.get(constant.baseURL + '/webInfo/listAdminAlbums')
        .then((res) => {
            if (!common.isEmpty(res.data)) {
                data.photoTitleList = res.data;
                data.photoPagination = {
                    current: 1,
                    size: 10,
                    total: 0,
                    resourceType: 'albums',
                    classify: data.photoTitleList[0].classify,
                    status: true,
                };
                changePhoto();
            }
        })
        .catch((error) => {
            ElMessage({
                message: error.message,
                type: 'error',
            });
        });
};

const changePhotoTitle = (classify) => {
    if (classify !== data.photoPagination.classify) {
        data.photoPagination = {
            current: 1,
            size: 10,
            total: 0,
            resourceType: 'albums',
            classify: classify,
            status: true,
        };
        data.photoList = [];
        changePhoto();
    }
};

const pagePhotos = () => {
    data.photoPagination.current += 1;
    changePhoto();
};

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
            });
        });
};

const { card, collects, photoPagination, photoTitleList, photoList, webStaticResourcePrefix } = toRefs(data)

</script>

<style scoped>
.favorite-container {
    padding: 25px;
    background: var(--favoriteBg);
    min-height: 100vh;
}

.favorite-header {
    margin: 60px auto 30px;
    height: 240px;
    position: relative;
    overflow: hidden;
    border-radius: 20px;
    max-width: 1200px;
}

.album-content {
    margin: 0 auto;
    max-width: 1200px;
}

.photo-title-warp {
    max-width: 1150px;
    margin: 0 auto;
    padding: 0 10px;
    border-radius: 10px;
    display: flex;
    flex-wrap: wrap;
}

.isActive {
    animation: scale 2.5s ease-in-out infinite;
}

.photo-title {
    text-align: center;
    font-size: 30px;
    font-weight: 700;
    line-height: 50px;
    letter-spacing: 2px;
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

@media screen and (max-width: 1150px) {
    .photo-title-warp {
        max-width: 780px;
    }
}

.index-video {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.favorite-image::before {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: var(--translucent);
}

.card-container {
    display: flex;
    flex-wrap: wrap;
    margin-top: 20px;
}

.card-item {
    transition: all 0.3s;
    position: relative;
    width: 250px;
    height: 120px;
    border-radius: 20px;
    animation: hideToShow 1s ease-in-out;
    cursor: pointer;
    overflow: hidden;
    margin: 10px;
    color: var(--white);
}

.card-item:hover {
    transform: translateY(-6px);
}

.card-name {
    font-weight: bold;
    font-size: 25px;
}

.card-name:after {
    top: 50px;
    width: 22px;
    left: 26px;
    height: 2px;
    background: var(--white);
    content: '';
    border-radius: 1px;
    position: absolute;
}

.card-desc {
    font-weight: bold;
    margin-top: 15px;
}

.favorite-content {
    margin: 0 auto;
    max-width: 1200px;
}

.collect-classify {
    font-size: 28px;
    font-weight: bold;
    margin-bottom: 10px;
}

.favorite-item-wrap {
    display: flex;
    flex-wrap: wrap;
    margin-left: -10px;
}

.favorite-item {
    transition: all 0.3s;
    border-radius: 12px;
    box-shadow: 0 8px 16px -4px #2c2d300c;
    background: var(--background);
    display: flex;
    width: calc(100% / 4 - 20px);
    max-width: 320px;
    height: 90px;
    overflow: hidden;
    padding: 15px;
    cursor: pointer;
    margin: 10px;
}

.favorite-item:hover {
    background: #425aef;
    color: var(--white);
}

.favorite-item:hover .favorite-item-image {
    transition: all 0.6s;
    width: 0 !important;
    height: 0 !important;
    opacity: 0;
    margin-right: 0;
}

.favorite-item:hover div:nth-child(2) {
    width: 100% !important;
}

.favorite-item-image {
    margin-right: 20px;
    transition: all 0.3s;
}

.favorite-item-title {
    font-size: 19px;
    font-weight: bold;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    margin-bottom: 5px;
}

.favorite-item-introduction {
    opacity: 0.7;
    font-weight: bold;
    letter-spacing: 1px;
    font-size: 14px;
    line-height: 1.2;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
}

@media screen and (max-width: 906px) {
    .card-container {
        margin-top: 0;
    }
}

@media screen and (max-width: 906px) {
    .favorite-item {
        width: calc(100% / 3 - 20px);
    }

    .favorite-header {
        height: 360px;
    }
}

@media screen and (max-width: 636px) {
    .favorite-item {
        width: calc(100% / 2 - 20px);
    }

    .favorite-header {
        height: 500px;
    }
}

@media screen and (max-width: 400px) {
    .favorite-item {
        width: calc(100% - 20px);
    }
}
</style>
