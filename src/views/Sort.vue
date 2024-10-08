<template>
    <div>
        <!-- 两句诗 -->
        <div class="my-animation-slide-top">
            <TwoPoem></TwoPoem>
        </div>

        <div style="background: var(--background); padding-top: 40px" class="my-animation-slide-bottom">
            <!-- 标签 -->
            <div class="sort-warp shadow-box" v-if="!common.isEmpty(sort) && !common.isEmpty(sort.labels)">
                <div v-for="(label, index) in sort.labels" :key="index" :class="{
                    isActive:
                        !common.isEmpty(labelId) && parseInt(labelId) === label.id,
                }" @click="listArticle(label)">
                    <ProTag :info="label.labelName + ' ' + label.countOfLabel"
                        :color="constant.before_color_list[Math.floor(Math.random() * 6)]" style="margin: 12px">
                    </ProTag>
                </div>
            </div>

            <!-- 文章 -->
            <div class="article-wrap">
                <ArticleList :articleList="articles"></ArticleList>
                <div class="pagination-wrap">
                    <div @click="pageArticles()" class="pagination" v-if="pagination.total !== articles.length">
                        下一页
                    </div>
                    <div v-else style="user-select: none">~~到底啦~~</div>
                </div>
            </div>
            <!-- 页脚 -->
            <MyFooter></MyFooter>
        </div>
    </div>
</template>

<script setup>
import TwoPoem from './../components/common/TwoPoem.vue';
import ProTag from './../components/common/ProTag.vue';
import ArticleList from './ArticleList.vue';
import MyFooter from './../components/common/MyFooter.vue';
import { nextTick, reactive, watch, inject, toRefs, onMounted } from 'vue';
import { useStore } from "vuex";
import { useRoute, useRouter } from "vue-router";
import { ElMessage } from "element-plus";

// hooks
const common = inject("$common");
const constant = inject("$constant");
const http = inject("$http");

const store = useStore();
const router = useRouter();
const route = useRoute();

const data = reactive({
    sortId: route.query.sortId,
    labelId: route.query.labelId,
    sort: null,
    pagination: {
        current: 1,
        size: 10,
        total: 0,
        searchKey: '',
        sortId: route.query.sortId,
        labelId: route.query.labelId,
    },
    articles: []
});

watch(() => route, () => {
    data.pagination = {
        current: 1,
        size: 10,
        total: 0,
        searchKey: '',
        sortId: route.query.sortId,
        labelId: route.query.labelId,
    };
    data.articles.splice(0, data.articles.length);
    data.sortId = route.query.sortId;
    data.labelId = route.query.labelId;
    getSort();
    getArticles();
});

onMounted(() => {
    getSort();
    getArticles();
})

const pageArticles = () => {
    data.pagination.current = data.pagination.current + 1;
    getArticles();
};

const getSort = () => {
    let sortInfo = store.state.sortInfo;
    if (!common.isEmpty(sortInfo)) {
        let sortArray = sortInfo.filter((f) => {
            return f.id === parseInt(data.sortId);
        });
        if (!common.isEmpty(sortArray)) {
            data.sort = sortArray[0];
        }
    }
};

const listArticle = (label) => {
    data.labelId = label.id;
    data.pagination = {
        current: 1,
        size: 10,
        total: 0,
        searchKey: '',
        sortId: route.query.sortId,
        labelId: label.id,
    };
    data.articles.splice(0, data.articles.length);
    nextTick(() => {
        getArticles();
    });
};

const getArticles = () => {
    http
        .post(constant.baseURL + '/article/listArticle', data.pagination)
        .then((res) => {
            if (!common.isEmpty(res.data)) {
                data.articles = data.articles.concat(res.data.records);
                data.pagination.total = res.data.total;
            }
        })
        .catch((error) => {
            ElMessage({
                message: error.message,
                type: 'error',
            });
        });
};

const { sortId, labelId, sort, pagination, articles } = toRefs(data)
</script>

<style scoped>
.sort-warp {
    width: 70%;
    max-width: 780px;
    margin: 0 auto;
    padding: 20px;
    border-radius: 10px;
    display: flex;
    flex-wrap: wrap;
}

.article-wrap {
    width: 70%;
    margin: 40px auto;
    min-height: 600px;
}

.isActive {
    animation: scale 1.5s ease-in-out infinite;
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

@media screen and (max-width: 900px) {
    .sort-warp {
        width: 90%;
    }

    .article-wrap {
        width: 90%;
    }
}
</style>
