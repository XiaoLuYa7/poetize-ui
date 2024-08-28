<template>
    <div>
        <el-config-provider :locale="zhCn">
            <MyHeader></MyHeader>
            <Sidebar></Sidebar>
            <div class="content-box">
                <div class="content">
                    <router-view></router-view>
                </div>
            </div>
        </el-config-provider>

    </div>
</template>

<script setup>
import MyHeader from './common/MyHeader.vue'
import Sidebar from './common/Sidebar.vue'
import zhCn from "element-plus/es/locale/lang/zh-cn"

// 修改分页器默认文字
zhCn.el.pagination.total = "总计：" + `{total}` + "条"
// zhCn.el.pagination.goto = "跳转至"


let root = document.querySelector(':root')
let webStaticResourcePrefix = import.meta.env.VITE_WEB_STATIC_RESOURCE_PREFIX
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
