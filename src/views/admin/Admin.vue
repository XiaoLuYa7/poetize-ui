<template>
    <div>
        <MyHeader></MyHeader>
        <Sidebar></Sidebar>
        <div class="content-box">
            <div class="content">
                <router-view></router-view>
            </div>
        </div>
    </div>
</template>

<script setup>
import MyHeader from './common/MyHeader.vue'
import Sidebar from './common/Sidebar.vue'

let root = document.querySelector(':root')
let webStaticResourcePrefix = import.meta.env.VITE_BASE_URL + "/"
root.style.setProperty(
    '--backgroundPicture',
    'url(' + webStaticResourcePrefix + 'assets/image/backgroundPicture.jpg)'
)
const font = new FontFace(
    'poetize-font',
    'url(' + webStaticResourcePrefix + 'assets/font/font.woff2)'
)
font.load()
document.fonts.add(font)

</script>

<style scoped>
.content-box {
    position: absolute;
    left: 130px;
    right: 0;
    top: 70px;
    bottom: 0;
    transition: left 0.3s ease-in-out;
}

.content {
    width: auto;
    height: 100%;
    padding: 30px;
    overflow-y: scroll;
}
</style>
