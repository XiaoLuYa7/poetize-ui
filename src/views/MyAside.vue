<template>
    <div>
        <div class="myAside-container">
            <!-- 网站信息 -->
            <div v-if="!common.mobile()" class="card-content1 shadow-box background-opacity">
                <el-avatar style="margin-top: 20px" class="user-avatar" :size="120" :src="webInfo.avatar"></el-avatar>
                <div class="web-name">{{ webInfo.webName }}</div>
                <div class="web-info">
                    <div class="blog-info-box">
                        <span>文章</span>
                        <span class="blog-info-num">{{ store.getters.articleTotal }}</span>
                    </div>
                    <div class="blog-info-box">
                        <span>分类</span>
                        <span class="blog-info-num">{{ sortInfo.length }}</span>
                    </div>
                    <div class="blog-info-box">
                        <span>访问量</span>
                        <span class="blog-info-num">{{ webInfo.historyAllCount }}</span>
                    </div>
                </div>
                <a class="collection-btn" @click="showTip()">
                    <el-icon style="margin-right: 2px"><Star /></el-icon>朋友圈
                </a>
            </div>

            <!-- 搜索 -->
            <div style="padding: 15px;border-radius: 10px;animation: hideToShow 1s ease-in-out"
                class="shadow-box background-opacity wow">
                <div style="color: var(--lightGreen);font-size: 20px;font-weight: bold;margin-bottom: 10px">
                    搜索
                </div>
                <div style="display: flex">
                    <input class="ais-SearchBox-input" type="text" v-model="articleSearch" placeholder="搜索文章"
                        maxlength="32" />
                    <div class="ais-SearchBox-submit" @click="selectArticle()">
                        <svg style="margin-top: 3.5px;margin-left: 18px" viewBox="0 0 1024 1024" width="20" height="20">
                            <path
                                d="M51.2 508.8c0 256.8 208 464.8 464.8 464.8s464.8-208 464.8-464.8-208-464.8-464.8-464.8-464.8 208-464.8 464.8z"
                                fill="#51C492"></path>
                            <path
                                d="M772.8 718.4c48-58.4 76.8-132.8 76.8-213.6 0-186.4-151.2-337.6-337.6-337.6-186.4 0-337.6 151.2-337.6 337.6 0 186.4 151.2 337.6 337.6 337.6 81.6 0 156-28.8 213.6-76.8L856 896l47.2-47.2-130.4-130.4zM512 776c-149.6 0-270.4-121.6-270.4-271.2S363.2 233.6 512 233.6c149.6 0 271.2 121.6 271.2 271.2C782.4 654.4 660.8 776 512 776z"
                                fill="#FFFFFF"></path>
                        </svg>
                    </div>
                </div>
            </div>

            <!-- 推荐文章 -->
            <div v-if="!common.isEmpty(recommendArticles)"
                style="padding: 25px;border-radius: 10px;animation: hideToShow 1s ease-in-out"
                class="shadow-box background-opacity wow">
                <div class="card-content2-title">
                    <span>🔥推荐文章</span>
                </div>
                <div v-for="(article, index) in recommendArticles" :key="index"
                    @click="router.push({ path: `/article/${article.id}` })">
                    <div class="aside-post-detail">
                        <div class="aside-post-image">
                            <div class="img-outer">
                                <el-image lazy class="my-el-image img-inner" :src="article.articleCover" fit="cover">
                                    <template #error>
                                        <div class="image-slot">
                                            <div class="error-aside-image">
                                                {{ article.username }}
                                            </div>
                                        </div>
                                    </template>

                                </el-image>
                            </div>
                            <div class="hasVideo transformCenter" v-if="article.hasVideo">
                                <svg viewBox="0 0 1024 1024" width="30" height="30">
                                    <path
                                        d="M514 114.3c-219.9 0-398.9 178.9-398.9 398.9 0.1 219.9 179 398.8 398.9 398.8 219.9 0 398.8-178.9 398.8-398.8S733.9 114.3 514 114.3z m173 421.9L437.1 680.5c-17.7 10.2-39.8-2.6-39.8-23V368.9c0-20.4 22.1-33.2 39.8-23L687 490.2c17.7 10.2 17.7 35.8 0 46z"
                                        fill="#0C0C0C"></path>
                                </svg>
                            </div>
                        </div>
                        <div class="aside-post-title">
                            {{ article.articleTitle }}
                        </div>
                    </div>
                    <div class="aside-post-date">
                        <el-icon style="color: var(--greyFont)"><Calendar /></el-icon>{{ article.createTime }}
                    </div>
                </div>
            </div>

            <!-- 速览 -->
            <div class="selectSort" style="margin-bottom: 30px">
                <div v-for="(sort, index) in sortInfo" @click="selectSort(sort)" :key="index"
                    :style="{ background: constant.sortColor[index % constant.sortColor.length] }"
                    class="shadow-box-mini background-opacity wow"
                    style="position: relative;padding: 10px 25px 15px;border-radius: 10px;animation: hideToShow 1s ease-in-out;cursor: pointer;color: var(--white)">
                    <div>速览</div>
                    <div class="sort-name">
                        {{ sort.sortName }}
                    </div>
                    <div
                        style="font-weight: bold;margin-top: 15px;white-space: nowrap;text-overflow: ellipsis;overflow: hidden">
                        {{ sort.sortDescription }}
                    </div>
                </div>
            </div>

            <!-- 最新树洞 -->
            <div class="shadow-box-mini background-opacity wow tree-box" style="margin-bottom: 30px"
                v-if="!common.isEmpty(treeHoles)">
                <div style="font-weight: bold;margin-bottom: 30px">🧨最新树洞</div>
                <div>
                    <vue3ScrollSeamless :dataList="treeHoles" :classOptions="speedLevel" style="height: 300px;overflow: hidden">
                        <div v-for="(item, i) in treeHoles" :key="i">
                            <div style="display: flex">
                                <el-avatar style="margin-bottom: 10px;height: 36px;width: 36px;line-height: 36px"
                                    :size="36" :src="item.avatar"></el-avatar>

                                <div
                                    style="margin-left: 10px;height: 36px;line-height: 36px;overflow: hidden;width: calc(100% - 46px)">
                                    {{ item.message }}
                                </div>
                            </div>
                        </div>
                    </vue3ScrollSeamless>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import {vue3ScrollSeamless} from "vue3-scroll-seamless";

import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import { computed, reactive, inject, toRefs, onMounted } from "vue";
import {Star,Calendar} from '@element-plus/icons-vue'

// hooks
const common = inject("$common");
const constant = inject("$constant");
const http = inject("$http");

const store = useStore();
const router = useRouter();

const emit = defineEmits(['selectSort', 'selectArticle']);

const data = reactive({
    pagination: {
        current: 1,
        size: 5,
        recommendStatus: true
    },
    recommendArticles: [],
    treeHoles: [],
    articleSearch: "",
    speedLevel: { step: 0.5 }
});

const webInfo = computed(() => {
    return store.state.webInfo;
});

const sortInfo = computed(() => {
    return store.getters.navigationBar;
});

onMounted(() => {
    getRecommendArticles();
    getTreeHoles();
})

const selectSort = (sort) => {
    emit("selectSort", sort);
};
const selectArticle = () => {
    emit("selectArticle", data.articleSearch);
};
const getTreeHoles = () => {
    http.get(constant.baseURL + "/webInfo/getTreeHoles")
        .then((res) => {
            if (!common.isEmpty(res.data)) {
                data.treeHoles = res.data;
            }
        })
        .catch((error) => {
            ElMessage({
                message: error.message,
                type: "error"
            });
        });
};
const getRecommendArticles = () => {
    http.post(constant.baseURL + "/article/listArticle", data.pagination)
        .then((res) => {
            if (!common.isEmpty(res.data)) {
                data.recommendArticles = res.data.records;
            }
        })
        .catch((error) => {
            ElMessage({
                message: error.message,
                type: "error"
            });
        });
};
const showTip = () => {
    router.push({ path: '/weiYan' });
};

const { pagination, recommendArticles, treeHoles, articleSearch, speedLevel } = toRefs(data)
</script>


<style scoped>
.myAside-container>div:not(:last-child) {
    margin-bottom: 30px;
}

.selectSort>div:not(:last-child) {
    margin-bottom: 30px;
}

.card-content1 {
    background: linear-gradient(-45deg, #e8d8b9, #eccec5, #a3e9eb, #bdbdf0, #eec1ea);
    background-size: 400% 400%;
    animation: gradientBG 10s ease infinite;
    display: flex;
    flex-direction: column;
    align-items: center;
    border-radius: 10px;
    position: relative;
    overflow: hidden;
}

.card-content1 :not(:first-child) {
    z-index: 10;
}

.web-name {
    font-size: 30px;
    font-weight: bold;
    margin: 20px 0;
}

.web-info {
    width: 80%;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
}

.blog-info-box {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-around;
}

.blog-info-num {
    margin-top: 12px;
}

.collection-btn {
    position: relative;
    margin-top: 12px;
    background: var(--lightGreen);
    cursor: pointer;
    width: 65%;
    height: 35px;
    border-radius: 1rem;
    text-align: center;
    line-height: 35px;
    color: var(--white);
    overflow: hidden;
    z-index: 1;
    margin-bottom: 25px;
    display: flex;
    justify-content: center;
    align-items: center;
}

.collection-btn::before {
    background: var(--gradualRed);
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    content: "";
    transform: scaleX(0);
    transform-origin: 0;
    transition: transform 0.5s ease-out;
    transition-timing-function: cubic-bezier(0.45, 1.64, 0.47, 0.66);
    border-radius: 1rem;
    z-index: -1;
}

.collection-btn:hover::before {
    transform: scaleX(1);
}

.card-content2-title {
    font-size: 18px;
    margin-bottom: 20px;
    color: var(--lightGreen);
    font-weight: bold;
}

.card-content2-icon {
    color: var(--red);
    margin-right: 5px;
    animation: scale 1s ease-in-out infinite;
}

.aside-post-detail {
    display: flex;
    cursor: pointer;
}

.aside-post-image {
    width: 40%;
    min-height: 50px;
    border-radius: 6px;
    margin-right: 8px;
    overflow: hidden;
    position: relative;
}

@media screen and (max-width: 1100px) {

    .aside-post-image,
    .aside-post-title {
        width: 50%;
    }
}

.error-aside-image {
    background: var(--themeBackground);
    color: var(--white);
    padding: 10px;
    text-align: center;
    width: 100%;
    height: 100%;
}

.aside-post-title {
    width: 60%;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    line-height: 1.5em;
    max-height: 3em;
}

.aside-post-date {
    margin-top: 8px;
    margin-bottom: 20px;
    color: var(--greyFont);
    font-size: 12px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
}

.post-sort {
    border-radius: 1rem;
    margin-bottom: 15px;
    line-height: 30px;
    transition: all 0.3s;
}

.post-sort:hover {
    background: var(--themeBackground);
    padding: 2px 15px;
    cursor: pointer;
    color: var(--white);
}

.sort-style {
    padding: 25px 25px 5px;
    border-radius: 10px;
    animation: hideToShow 1s ease-in-out;
    color: var(--white);
}

.sort-name {
    font-weight: bold;
    font-size: 25px;
    margin-top: 15px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
}

.sort-name:after {
    top: 74px;
    width: 22px;
    left: 26px;
    height: 2px;
    background: var(--white);
    content: "";
    border-radius: 1px;
    position: absolute;
}

.tree-box {
    background: var(--springBg) 50% / cover no-repeat;
    padding: 20px;
    border-radius: 10px;
}

.ais-SearchBox-input {
    padding: 0 14px;
    height: 30px;
    width: calc(100% - 50px);
    outline: 0;
    border: 2px solid var(--lightGreen);
    border-right: 0;
    border-radius: 40px 0 0 40px;
    color: var(--maxGreyFont);
    background: var(--white);
}

.ais-SearchBox-submit {
    height: 30px;
    width: 50px;
    border: 2px solid var(--lightGreen);
    border-left: 0;
    border-radius: 0 40px 40px 0;
    background: var(--white);
    cursor: pointer;
}

.hasVideo {
    padding: 2px 10px 0;
    background: var(--maxMaxWhiteMask);
    border-radius: 6px;
}

.img-outer {
    position: relative;
    width: 100%;
    padding-top: 70%;
}

.img-inner {
    position: absolute;
    top: 0;
    left: 0;
}
</style>
