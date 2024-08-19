<template>
    <div>
        <slot name="paper" :content="content"></slot>
    </div>
</template>

<script setup>
import { ref, watch, onMounted, onBeforeUnmount, reactive, toRefs } from 'vue';

// props
const props = defineProps({
    // 内容
    printerInfo: {
        type: String,
        default: '',
    },
    // 速度
    duration: {
        type: Number,
        default: 80,
    },
    // 延迟
    delay: {
        type: Number,
        default: 3000,
    },
    working: {
        type: Boolean,
        default: true,
    },
    once: {
        type: Boolean,
        default: false,
    },
});

const data = reactive({
    content: "",
    cursor: 0,
    timer: null,
    timeout: null,
    print: true
})

// methods
const start = (work) => {
    data.timeout = setTimeout(() => {
        data.timer = setInterval(() => {
            work();
            if (data.cursor === 0 || (data.cursor === props.printerInfo.length && !props.once)) {
                clearInterval(data.timer);
                start(work);
            } else if (data.cursor === props.printerInfo.length && props.once) {
                clearInterval(data.timer);
            }
        }, props.duration);
    }, props.delay);
};

const work = () => {
    let cur = data.cursor;
    cur += data.print ? 1 : -1;
    if (data.print) {
        if (cur === props.printerInfo.length + 1) {
            cur -= 2;
            data.print = !data.print;
        }
    } else {
        if (cur === -1) {
            cur += 2;
            data.print = !data.print;
        }
    }
    data.cursor = cur;
};

const toBegin = () => {
    data.cursor = 0;
    if (timeout !== null) {
        clearTimeout(timeout);
        if (timer !== null) {
            clearInterval(timer);
        }
    }
    if (props.working) {
        start(work);
    } else {
        data.content = props.printerInfo;
    }
};

// lifecycle hooks
onMounted(() => {
    if (props.working) {
        start(work);
    } else {
        data.content = props.printerInfo;
    }
});

onBeforeUnmount(() => {
    clearInterval(timer);
});

// watchers
watch(() => props.working, () => {
    toBegin();
});

watch(() => props.printerInfo, () => {
    toBegin();
});

watch(() => data.cursor, (newVal) => {
    data.content = props.printerInfo.slice(0, newVal);
});

const { content, cursor, timeout, timer, print } = toRefs(data)
</script>
