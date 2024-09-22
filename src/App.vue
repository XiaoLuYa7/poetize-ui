<template>
    <div id="app">
        <el-config-provider :locale="zhCn">
            <router-view />
        </el-config-provider>

    </div>
</template>

<script setup>
import zhCn from "element-plus/es/locale/lang/zh-cn"

// 修改分页器默认文字
zhCn.el.pagination.total = "总计：" + `{total}` + "条"
// zhCn.el.pagination.goto = "跳转至"

</script>
