<template>
    <div>
        <transition name="body">
            <div v-show="showEmoji">
                <span class="emoji-item" v-for="(value, key, index) in emojiListURL" :key="index"
                    @click="addEmoji(key)">
                    <img loading="lazy" class="emoji" :src="value" :title="key" width="28px" height="28px" />
                </span>
            </div>
        </transition>
    </div>
</template>

<script setup>
import { inject, reactive, toRefs, onMounted } from 'vue'

// 接收传入的 props
const props = defineProps({
    showEmoji: {
        type: Boolean,
        default: false
    }
})

// emit 事件
const emit = defineEmits(['addEmoji'])

//全局注入
const constant = inject("$constant")

const data = reactive({
    emojiList : constant.emojiList,
    emojiListURL: {}
})

// 在组件创建时初始化 emojiListURL
onMounted(() => {
    data.emojiListURL = getEmojiList(data.emojiList)
})

// 方法
const addEmoji = (key) => {
    emit('addEmoji', key)
}

const getEmojiList = (emojiList) => {
    let result = {}
    emojiList.forEach((emoji, index) => {
        const emojiName = `[${emoji}]`
        const url =
            import.meta.env.VITE_WEB_STATIC_RESOURCE_PREFIX +
            `assets/emoji/q${index + 1}.gif`
        result[emojiName] = url
    })
    return result
}

const {emojiList,emojiListURL} = toRefs(data)

</script>


<style scoped>
.emoji-item {
    cursor: pointer;
    display: inline-block;
}

.emoji-item:hover {
    transition: all 0.2s;
    border-radius: 0.25rem;
    background: var(--lightGray);
}

.emoji {
    margin: 0.25rem;
    vertical-align: middle;
}

.body-enter-active,
.body-leave-active {
    transition: all 0.3s;
}

.body-enter-from,
.body-leave-to {
    opacity: 0;
    transform: scale(0.5);
}
</style>
