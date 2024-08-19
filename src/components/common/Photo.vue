<template>
    <div :class="photoContainer">
        <div class="photo-card-container" v-if="!common.isEmpty(resourcePathList) && type === 1">
            <div v-for="(resourcePath, index) in resourcePathList" :key="index"
                class="photo-card-item wow shadow-box-mini">
                <div class="photo-card-image">
                    <el-image class="my-el-image" v-once lazy :preview-src-list="[resourcePath.cover]"
                        :src="resourcePath.cover" fit="cover">
                        <template #error>
                            <div class="image-slot"></div>
                        </template>
                    </el-image>
                </div>
                <div class="photo-card-body">
                    <el-tooltip placement="bottom-start" effect="light"  :teleported="false" :show-arrow="false"  popper-class="my-tooltip">
                        <template #content>
                            <div>{{ resourcePath.title }}</div>
                        </template>
                        <div class="photo-card-desc">
                            {{ resourcePath.title }}
                        </div>
                    </el-tooltip>
                    <div class="photo-card-time">
                        Date: {{ common.getDateDiff(resourcePath.createTime) }}
                    </div>
                </div>
            </div>
        </div>

        <div class="photo-card-container" v-if="!common.isEmpty(resourcePathList) && type === 2">
            <div v-for="(resourcePath, index) in resourcePathList" :key="index"
                class="photo-card-item wow shadow-box-mini">
                <div class="photo-card-image">
                    <el-image class="my-el-image" v-once :preview-src-list="[resourcePath.cover]"
                        :src="resourcePath.cover" fit="cover">
                        <template #error>
                            <div class="image-slot"></div>
                        </template>
                    </el-image>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed, inject } from 'vue';
const common = inject("$common")

const props = defineProps({
    resourcePathList: {
        type: Array,
        default: []
    },
    type: {
        type: Number,
        default: 0
    }
});

const photoContainer = computed(() => ({
    'photo-type-1': props.type === 1,
    'photo-type-2': props.type === 2,
}));
</script>



<style scoped>
.photo-type-1 .photo-card-container {
    display: flex;
    flex-wrap: wrap;
    max-width: 1500px;
    margin: 20px auto 40px;
}

.photo-type-1 .photo-card-item {
    position: relative;
    overflow: hidden;
    margin: 15px;
    height: 450px;
    flex-shrink: 0;
    width: calc(33.33333% - 30px);
    cursor: pointer;
    -webkit-animation: hideToShow 0.8s ease-in-out;
    animation: hideToShow 0.8s ease-in-out;
    padding: 0.7rem;
    background: var(--background);
    border-radius: 1.5rem;
    transition: all 0.2s;
}

.photo-type-1 .photo-card-image {
    width: 100%;
    height: 360px;
    border-radius: 1rem;
    overflow: hidden;
    box-shadow: 0 2px 10px hsla(0, 0%, 57.6%, 0.61);
    margin-bottom: 1rem;
}

.photo-type-1 .photo-card-image>>>.el-image__inner {
    transition: all 1s;
}

.photo-type-1 .photo-card-image>>>.el-image__inner:hover {
    transform: scale(1.2);
}

.photo-type-1 .photo-card-body {
    padding: 0 5px 5px;
}

.photo-type-1 .photo-card-desc {
    font-weight: 600;
    font-size: 1.05rem;
    color: var(--fontColor);
    letter-spacing: 1px;
    line-height: 1.2;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
}

.photo-type-1 .photo-card-time {
    position: absolute;
    bottom: 10px;
    color: #999;
    font-weight: 500;
}

.photo-type-2 .photo-card-container {
    display: flex;
    flex-wrap: wrap;
}

.photo-type-2 .photo-card-item {
    position: relative;
    overflow: hidden;
    margin: 10px 5px;
    height: 250px;
    flex-shrink: 0;
    width: calc(20% - 10px);
    cursor: pointer;
    -webkit-animation: hideToShow 0.8s ease-in-out;
    animation: hideToShow 0.8s ease-in-out;
    background: var(--background);
    border-radius: 1rem;
    transition: all 0.2s;
}

.photo-type-2 .photo-card-image {
    width: 100%;
    height: 250px;
    border-radius: 1rem;
    overflow: hidden;
    box-shadow: 0 2px 10px hsla(0, 0%, 57.6%, 0.61);
}

.photo-type-2 .photo-card-image .el-image__inner {
    transition: all 1s;
}

.photo-type-2 .el-image__preview {
    cursor: pointer;
}

.photo-type-2 .el-image__inner {
    vertical-align: top;
}

.photo-type-2 .el-image__error,
.el-image__inner,
.el-image__placeholder {
    width: 100%;
    height: 100%;
}

@media screen and (max-width: 1300px) {
    .photo-type-1 .photo-card-item {
        width: calc(100% / 2 - 30px);
    }
}

@media screen and (max-width: 1150px) {
    .photo-type-2 .photo-card-item {
        width: calc(25% - 10px);
    }
}

@media screen and (max-width: 1000px) {
    .photo-type-1 .photo-card-item {
        height: 350px;
    }

    .photo-type-1 .photo-card-image {
        height: 260px;
    }
}

@media screen and (max-width: 850px) {
    .photo-type-2 .photo-card-item {
        width: calc(33.33333% - 10px);
    }

    .photo-card-image {
        height: 260px;
    }
}

@media screen and (max-width: 750px) {
    .photo-type-1 .photo-card-item {
        width: 100%;
        margin: 15px 0;
    }
}

@media screen and (max-width: 700px) {
    .photo-type-2 .photo-card-item {
        width: calc(50% - 10px);
    }
}

@media screen and (max-width: 450px) {
    .photo-type-1 .photo-card-item {
        height: 300px;
    }

    .photo-type-2 .photo-card-item {
        height: 200px;
        margin: 5px;
    }

    .photo-type-1 .photo-card-image {
        height: 210px;
    }

    .photo-type-2 .photo-card-image {
        height: 200px;
    }
}
</style>
