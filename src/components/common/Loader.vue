<template>
    <div>
        <!-- 加载动画 -->
        <transition name="loader">
            <div v-show="loaderVisible">
                <slot name="loader"></slot>
            </div>
        </transition>
        <!-- 内容 -->
        <transition name="body">
            <div v-show="bodyVisible">
                <slot name="body"></slot>
            </div>
        </transition>
    </div>
</template>

<script setup>
import { reactive, ref, toRefs, watch } from 'vue'

// 接收传入的 props
const props = defineProps({
    loading: {
        type: Boolean,
        default: false,
    }
});

const data = reactive({
    loaderVisible: props.loading,
    bodyVisible: !props.loading
})


// 监听 loading 的变化
watch(() => props.loading, (loading) => {
    data.loaderVisible = loading
    setTimeout(() => {
        data.bodyVisible = !loading
    }, 300)
})

const {loaderVisible,bodyVisible} = toRefs(data)
</script>


<style scoped>
.loader-enter-active,
.loader-leave-active,
.body-enter-active,
.body-leave-active {
    transition: all 0.5s;
}

.loader-enter-from,
.loader-leave-to {
    opacity: 0;
}

.body-enter-from,
.body-leave-to {
    opacity: 0;
    transform: scale(0.5) translateY(50%);
}
</style>
