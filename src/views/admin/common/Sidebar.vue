<template>
    <div class="sidebar">
        <div @click="collapse()"
            style="color: rgb(96, 98, 102);cursor: pointer;background-color: #ebf1f6;display: flex;">
            <el-icon style="margin: 14px; font-size: 17px">
                <Menu />
            </el-icon>
            <div style="font-size: 15px; margin-top: 13px">折叠</div>
        </div>
        <el-menu class="sidebar-el-menu"  unique-opened :default-active="router.currentRoute.value.path" router collapse-transition>
            <template v-for="item in items">
                <template v-if="isBoss || !item.isBoss">
                    <template v-if="item.subs">
                        <el-sub-menu :index="item.index" :key="item.index">
                            <template v-slot:title>
                                <el-icon><component :is="item.icon"></component></el-icon>
                                <span>{{ item.title }}</span>
                            </template>
                            <template v-for="(subItem, index) in item.subs" :key="index">
                                <el-sub-menu v-if="subItem.subs" :index="subItem.index">
                                    <template v-slot:title>
                                        {{ subItem.title }}
                                    </template>
                                    <el-menu-item v-for="threeItem in subItem.subs" :key="threeItem.index"
                                        :index="threeItem.index">
                                        {{ threeItem.title }}
                                    </el-menu-item>
                                </el-sub-menu>
                                <el-menu-item v-else :index="subItem.index">
                                    {{ subItem.title }}
                                </el-menu-item>
                            </template>
                        </el-sub-menu>
                    </template>
                    <template v-else>
                        <el-menu-item :index="item.index" :key="item.index">
                            <el-icon><component :is="item.icon"></component></el-icon>
                            {{ item.title }}
                        </el-menu-item>
                    </template>
                </template>
            </template>
        </el-menu>
    </div>
</template>

<script setup>
import { onMounted, reactive, shallowRef, toRefs } from 'vue';
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { Menu, SwitchFilled, Setting, User, Postcard, Notebook, Edit, ChatLineRound, Paperclip, CreditCard, Sugar, GoodsFilled  } from '@element-plus/icons-vue';

const store = useStore();
const router = useRouter();

const data = reactive({
    isCollapse: true,
    isBoss: store.state.currentAdmin.isBoss,

})

// 自定义组件如果是一个响应式对象可能会造成性能开销 可以使用shallowRef
const items = shallowRef([
        {
            icon: SwitchFilled,
            index: '/main',
            title: '系统首页',
            isBoss: true,
        },
        {
            icon: Setting,
            index: '/webEdit',
            title: '网站设置',
            isBoss: true,
        },
        {
            icon: User,
            index: '/userList',
            title: '用户管理',
            isBoss: true,
        },
        {
            icon: Postcard,
            index: '/postList',
            title: '文章管理',
            isBoss: false,
        },
        {
            icon: Notebook,
            index: '/sortList',
            title: '分类管理',
            isBoss: true,
        },
        {
            icon: Edit,
            index: '/commentList',
            title: '评论管理',
            isBoss: false,
        },
        {
            icon: ChatLineRound,
            index: '/treeHoleList',
            title: '树洞管理',
            isBoss: true,
        },
        {
            icon: Paperclip,
            index: '/resourceList',
            title: '资源管理',
            isBoss: false,
        },
        {
            icon: CreditCard,
            index: '/resourcePathList',
            title: '资源聚合',
            isBoss: true,
        },
        {
            icon: Sugar,
            index: '/loveList',
            title: '表白墙',
            isBoss: true,
        },
        {
            icon: GoodsFilled,
            index: '/order',
            title: '订单管理',
            isBoss: true,
        }
    ])

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

const { isBoss, isCollapse } = toRefs(data)

</script>

<style scoped>
:root {
    --el-menu-bg-color: #ebf1f6;
    --el-menu-item-text-color: #606266;
    --el-menu-item-active-text-color: #20a0ff;
}

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

.el-menu-item [class^=el-icon] {
    font-size: 18px;
    margin-right: 10px;
    text-align: center;
    vertical-align: middle;
    width: var(--el-menu-icon-width);
}

</style>
