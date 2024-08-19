<template>
    <div class="sidebar">
        <div @click="collapse()"
            style="color: rgb(96, 98, 102);cursor: pointer;background-color: #ebf1f6;display: flex;">
            <i class="el-icon-menu" style="margin: 14px; font-size: 17px"></i>
            <div style="font-size: 15px; margin-top: 13px">折叠</div>
        </div>
        <el-menu class="sidebar-el-menu" background-color="#ebf1f6" text-color="#606266" active-text-color="#20a0ff"
            unique-opened :default-active="router.currentRoute.path" router>
            <template v-for="item in items">
                <template v-if="isBoss || !item.isBoss">
                    <template v-if="item.subs">
                        <el-submenu :index="item.index" :key="item.index">
                            <template v-slot:title>
                                <i :class="item.icon"></i>
                                <span>{{ item.title }}</span>
                            </template>
                            <template v-for="(subItem, index) in item.subs" :key="index">
                                <el-submenu v-if="subItem.subs" :index="subItem.index">
                                    <template v-slot:title>
                                        {{ subItem.title }}
                                    </template>
                                    <el-menu-item v-for="threeItem in subItem.subs" :key="threeItem.index"
                                        :index="threeItem.index">
                                        {{ threeItem.title }}
                                    </el-menu-item>
                                </el-submenu>
                                <el-menu-item v-else :index="subItem.index">
                                    {{ subItem.title }}
                                </el-menu-item>
                            </template>
                        </el-submenu>
                    </template>
                    <template v-else>
                        <el-menu-item :index="item.index" :key="item.index">
                            <i :class="item.icon"></i>
                            {{ item.title }}
                        </el-menu-item>
                    </template>
                </template>
            </template>
        </el-menu>
    </div>
</template>

<script setup>
import { reactive, toRefs } from 'vue';
import { useStore } from "vuex";
import { useRouter } from "vue-router";

const store = useStore();
const router = useRouter();

const data = reactive({
    isCollapse: true,
    isBoss: store.state.currentAdmin.isBoss,
    items: [
        {
            icon: 'el-icon-s-home',
            index: '/main',
            title: '系统首页',
            isBoss: true,
        },
        {
            icon: 'el-icon-s-tools',
            index: '/webEdit',
            title: '网站设置',
            isBoss: true,
        },
        {
            icon: 'el-icon-user-solid',
            index: '/userList',
            title: '用户管理',
            isBoss: true,
        },
        {
            icon: 'el-icon-postcard',
            index: '/postList',
            title: '文章管理',
            isBoss: false,
        },
        {
            icon: 'el-icon-notebook-2',
            index: '/sortList',
            title: '分类管理',
            isBoss: true,
        },
        {
            icon: 'el-icon-edit-outline',
            index: '/commentList',
            title: '评论管理',
            isBoss: false,
        },
        {
            icon: 'el-icon-s-comment',
            index: '/treeHoleList',
            title: '树洞管理',
            isBoss: true,
        },
        {
            icon: 'el-icon-paperclip',
            index: '/resourceList',
            title: '资源管理',
            isBoss: false,
        },
        {
            icon: 'el-icon-bank-card',
            index: '/resourcePathList',
            title: '资源聚合',
            isBoss: true,
        },
        {
            icon: 'el-icon-sugar',
            index: '/loveList',
            title: '表白墙',
            isBoss: true,
        },
    ]
})

const collapse = () => {
    if (data.isCollapse) {
        $('.sidebar').css('width', '45px')
        $('.content-box').css('left', '45px')
    } else {
        $('.sidebar').css('width', '130px')
        $('.content-box').css('left', '130px')
    }
    data.isCollapse = !data.isCollapse
}

const { isBoss, isCollapse, items } = toRefs(data)

</script>

<style scoped>
.sidebar {
    display: block;
    position: absolute;
    left: 0;
    top: 70px;
    bottom: 0;
    overflow-y: scroll;
    width: 130px;
    user-select: none;
}

.sidebar::-webkit-scrollbar {
    width: 0;
}

.sidebar>ul {
    height: 100%;
}

.sidebar-el-menu .el-menu-item {
    padding: 0 10px !important;
}
</style>
