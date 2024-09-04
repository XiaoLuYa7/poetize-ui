<template>
    <div>
        <!-- el过渡动画 -->
        <transition name="el-fade-in-linear">
            <!-- 导航栏 -->
            <div v-show="toolbar.visible || common.mobile() || mobile" @mouseenter="hoverEnter = true"
                @mouseleave="hoverEnter = false" :class="[
                    { enter: toolbar.enter },
                    {
                        hoverEnter:
                            (hoverEnter ||
                                route.path === '/favorite' ||
                                route.path === '/letter' ||
                                route.path === '/user' ||
                                route.path === '/login') &&
                            !toolbar.enter,
                    },
                ]" class="toolbar-content myBetween">
                <!-- 网站名称 -->
                <div class="toolbar-title">
                    <h2 @click="router.push({ path: '/' })">
                        {{ store.state.webInfo.webName }}
                    </h2>
                </div>

                <!-- 手机导航按钮 -->
                <div v-if="common.mobile() || mobile" class="toolbar-mobile-menu"
                    @click="toolbarDrawer = !toolbarDrawer" :class="{ enter: toolbar.enter }">
                    <el-icon><Operation /></el-icon>
                </div>

                <!-- 导航列表 -->
                <div v-else>
                    <ul class="scroll-menu">
                        <li @click="router.push({ path: '/' })">
                            <div class="my-menu"><span>🏡 首页</span></div>
                        </li>

                        <li @click="gotoContent()">
                            <div class="my-menu"><span>🌏 内容</span></div>
                        </li>

                        <!-- 家 -->
                        <li @click="router.push({ path: '/love' })">
                            <div class="my-menu"><span>❤️‍🔥 家</span></div>
                        </li>

                        <el-dropdown :hide-timeout="50" ref="dropdown" placement="bottom">
                            <li>
                                <div class="my-menu"><span>📒 记录</span></div>
                            </li>
                            <template #dropdown>
                                <el-dropdown-menu class="el-dropdown-menu" style="width: 160px">
                                    <!--  class="dropdown-menu-item" -->
                                    <el-dropdown-item v-for="(sort, index) in sortInfo" :key="index" class="myCenter">
                                        <div @click="
                                            router.push({
                                                path: '/sort',
                                                query: { sortId: sort.id },
                                            })
                                            " class="dropdown-menu-item">
                                            {{ sort.sortName }}
                                        </div>
                                    </el-dropdown-item>
                                </el-dropdown-menu>
                            </template>
                        </el-dropdown>

                        <!-- 收藏夹 -->
                        <li @click="router.push({ path: '/favorite' })">
                            <div class="my-menu">🧰 <span>收藏夹</span></div>
                        </li>

                        <!-- 留言 -->
                        <li @click="router.push({ path: '/message' })">
                            <div class="my-menu">📪 <span>留言</span></div>
                        </li>

                        <!-- 关于 -->
                        <li @click="router.push({ path: '/about' })">
                            <div class="my-menu">🐟 <span>关于</span></div>
                        </li>

                        <!-- 聊天室 -->
                        <li @click="goIm()" v-show="!common.isEmpty(store.state.webInfo) &&
                            store.state.webInfo.imStatus
                            ">
                            <div class="my-menu">💬 <span>联系我</span></div>
                        </li>

                        <!-- 后台 -->
                        <li @click="goAdmin()" v-show="!common.isEmpty(store.state.currentUser) &&
                            (store.state.currentUser.isBoss ||
                                store.state.currentUser.isDev)
                            ">
                            <div class="my-menu">💻️ <span>后台</span></div>
                        </li>

                        <!-- 个人中心 -->
                        <li>
                            <template v-if="common.isEmpty(store.state.currentUser)">
                                <div class="header-avatar-wrap">
                                    <div class="default-login" @click="router.push({ path: '/login' })">
                                        登陆
                                    </div>
                                </div>
                            </template>
                            <template v-if="!common.isEmpty(store.state.currentUser)">
                                <el-dropdown placement="bottom-end" :hide-timeout="50">
                                    <div class="myCenter" style="width: 40px;height: 40px;">
                                        <el-avatar class="user-avatar" :size="36" style="margin-top: 12px"
                                        :src="store.state.currentUser.avatar">
                                    </el-avatar>
                                    </div>

                                    <template v-slot:dropdown>
                                        <el-dropdown-menu style="width: 150px; font-size: 14px">
                                            <el-dropdown-item  @click="router.push({ path: '/user' })"
                                                v-if="!common.isEmpty(store.state.currentUser)" class="myCenter"
                                                style="width: 130px; margin-left: 10px">
                                                <div class="dropdown-menu-item">
                                                    <i class="fa fa-user-circle" aria-hidden="true"></i>
                                                    <span>个人中心</span>
                                                </div>
                                            </el-dropdown-item>
                                            <el-dropdown-item @click="logout()"
                                                v-if="!common.isEmpty(store.state.currentUser)" class="myCenter"
                                                style="width: 130px; margin-left: 10px">
                                                <div class="dropdown-menu-item">
                                                    <i class="fa fa-sign-out" aria-hidden="true"></i>
                                                    <span>退出</span>
                                                </div>
                                            </el-dropdown-item>
                                        </el-dropdown-menu>
                                    </template>
                                </el-dropdown>
                            </template>
                        </li>
                    </ul>
                </div>
            </div>
        </transition>

        <div id="main-container">
            <router-view></router-view>
        </div>

        <div class="toolButton">
            <div class="backTop" v-if="toolButton" @click="toTop()">
                <!-- 回到顶部按钮 -->
                <svg viewBox="0 0 1024 1024" width="40" height="40" style="margin-left: 26px; cursor: pointer">
                    <path
                        d="M696.741825 447.714002c2.717387-214.485615-173.757803-312.227566-187.33574-320.371729-10.857551 5.430775-190.050127 103.168727-187.33274 320.371729-35.297037 24.435488-73.306463 65.1623-67.875688 135.752376 5.430775 70.589076 76.018851 119.460051 103.168726 116.745664 27.152875-2.716387 19.004713-21.7221 19.004713-21.7221l8.148162-38.011425s40.721814 59.732525 51.583363 59.732525h146.609927c13.574938 0 51.585363-59.732525 51.585363-59.732525l8.147162 38.011425s-8.147162 19.005713 19.004713 21.7221c27.148876 2.714388 97.738951-46.156588 103.168727-116.745664s-32.57965-111.316888-67.876688-135.752376z m-187.33574-2.713388c-5.426776 0-70.589076-2.717387-78.733239-78.737238 2.713388-73.306463 73.306463-78.733239 78.733239-81.450626 5.430775 0 76.02385 8.144163 78.736238 81.450626-8.143163 76.019851-73.305463 78.737238-78.736238 78.737238z m0 0"
                        fill="#000000"></path>
                    <path
                        d="M423.602441 746.060699c6.47054-6.297579 12.823107-7.017417 21.629121-2.784372 34.520213 16.582259 70.232157 19.645568 107.031855 9.116944 8.118169-2.323476 15.974396-5.475765 23.598677-9.22392 13.712907-6.73648 26.003134 0.8878 26.080116 16.13936 0.109975 22.574907-0.024994 45.142816 0.080982 67.709725 0.031993 7.464316-2.277486 13.322995-9.44387 16.608254-7.277358 3.333248-13.765895 1.961558-19.526595-3.264264-3.653176-3.313253-7.063407-6.897444-10.634601-10.304675-6.563519-6.259588-6.676494-6.25259-10.625603 1.603638-8.437097 16.80121-16.821205 33.623415-25.257302 50.423625-2.489438 4.953882-5.706713 9.196925-11.411426 10.775569-8.355115 2.315478-15.772442-1.070758-20.272427-9.867774-8.774021-17.15313-17.269104-34.453228-25.918153-51.669344-3.750154-7.469315-3.9891-7.479313-10.141712-1.514658-3.715162 3.602187-7.31435 7.326347-11.142486 10.800563-5.571743 5.060858-11.934308 6.269586-18.936728 3.207277-6.82746-2.984327-9.869774-8.483086-9.892769-15.685462-0.070984-23.506697-0.041991-47.018393-0.020995-70.532089 0.007998-4.679944 1.46467-8.785018 4.803916-11.538397z"
                        fill="#000000"></path>
                </svg>
            </div>

            <div style="margin-bottom: 6px; cursor: pointer" v-if="showElement" @click="gotoContent()">
                <el-tooltip placement="left" effect="light" :teleported="false" :show-arrow="false"
                    popper-class="my-tooltip">
                    <template v-slot:content>
                        <div>返回主页</div>
                    </template>
                    <i aria-hidden="true" class="fa fa-home"></i>
                </el-tooltip>
            </div>

            <el-popover placement="left" :close-delay="500" trigger="hover" style="cursor: pointer">
                <template v-slot:reference>
                    <div>
                        <i class="fa fa-cog iconRotate" aria-hidden="true"></i>
                    </div>
                </template>
                <div class="my-setting">
                    <div>
                        <!-- 太阳按钮 -->
                        <el-icon v-if="isDark" class="iconRotate" @click="changeColor()"><Sunny /></el-icon>
                        <!-- 月亮按钮 -->
                        <i v-else class="fa fa-moon-o" aria-hidden="true" @click="changeColor()"></i>
                    </div>
                    <div>
                        <i class="fa fa-snowflake-o" aria-hidden="true" @click="changeMouseAnimation()"></i>
                    </div>
                </div>
            </el-popover>
        </div>

        <!-- 点击动画 -->
        <canvas v-if="mouseAnimation" id="mousedown"
            style="position: fixed;left: 0;top: 0;pointer-events: none;z-index: 1000;">
        </canvas>

        <!-- 图片预览 -->
        <div id="outerImg">
            <div id="innerImg" style="position: absolute">
                <img id="bigImg" src="" />
            </div>
        </div>

        <el-drawer v-model="toolbarDrawer" :show-close="false" size="65%" class="toolbarDrawer"
            title="欢迎光临" direction="ltr">
            <div>
                <ul class="small-menu">
                    <li @click="smallMenu({ path: '/' })">
                        <div>🏡 <span>首页</span></div>
                    </li>

                    <li @click="router.push({ path: '/content' })">
                        <div class="my-menu">🌏 <span>内容</span></div>
                    </li>

                    <!-- 家 -->
                    <li @click="smallMenu({ path: '/love' })">
                        <div>❤️‍🔥 <span>家</span></div>
                    </li>

                    <li>
                        <div style="display: flex" @click="hideOrShow()">
                            <div>📒 记录</div>
                            <div style="margin-left: 60px">
                                <el-icon><ArrowDown /></el-icon>
                            </div>
                        </div>
                        <div class="my-animation-hideToShow" v-show="sortMenu">
                            <div v-for="(menu, index) in sortInfo" :key="index" class="sortMenu" @click="
                                smallMenu({ path: '/sort', query: { sortId: menu.id } })
                                ">
                                {{ menu.sortName }}
                            </div>
                        </div>
                    </li>

                    <!-- 收藏夹 -->
                    <li @click="smallMenu({ path: '/favorite' })">
                        <div>🧰 <span>收藏夹</span></div>
                    </li>

                    <!-- 留言 -->
                    <li @click="smallMenu({ path: '/message' })">
                        <div>📪 <span>留言</span></div>
                    </li>

                    <!-- 关于 -->
                    <li @click="router.push({ path: '/about' })">
                        <div class="my-menu">🐟 <span>关于</span></div>
                    </li>

                    <!-- 聊天室 -->
                    <li @click="goIm()" v-show="!common.isEmpty(store.state.webInfo) &&
                        store.state.webInfo.imStatus
                        ">
                        <div>💬 <span>联系我</span></div>
                    </li>

                    <!-- 后台 -->
                    <li @click="goAdmin()" v-show="!common.isEmpty(store.state.currentUser) &&
                        (store.state.currentUser.isBoss ||
                            store.state.currentUser.isDev)
                        ">
                        <div>💻️ <span>后台</span></div>
                    </li>

                    <template v-if="common.isEmpty(store.state.currentUser)">
                        <li @click="smallMenu({ path: '/login' })">
                            <div>
                                <i class="fa fa-sign-in" aria-hidden="true"></i>
                                <span>&nbsp;登录</span>
                            </div>
                        </li>
                    </template>
                    <template v-else>
                        <li @click="smallMenu({ path: '/user' })">
                            <div>
                                <i class="fa fa-user-circle" aria-hidden="true"></i>
                                <span>&nbsp;个人中心</span>
                            </div>
                        </li>
                        <li @click="smallMenuLogout()">
                            <div>
                                <i class="fa fa-sign-out" aria-hidden="true"></i>
                                <span>&nbsp;退出</span>
                            </div>
                        </li>
                    </template>
                </ul>
            </div>
        </el-drawer>
    </div>
</template>

<script setup>
import { computed, nextTick, onMounted, onUnmounted, reactive, watch, inject, toRefs, ref } from "vue";
import mousedown from "../utils/mousedown";
import { useStore } from 'vuex';
import { useRoute, useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import {Operation,ArrowDown,Sunny} from '@element-plus/icons-vue'

// hooks
const common = inject("$common");
const constant = inject("$constant");
const http = inject("$http");

const store = useStore();
const router = useRouter();
const route = useRoute();

const data = reactive({
    toolButton: false,
    hoverEnter: false,
    mouseAnimation: false,
    isDark: false,
    scrollTop: 0,
    toolbarDrawer: false,
    mobile: false,
    showElement: false,
    sortMenu: false
});

const dropdown = ref(null)

onMounted(() => {
    if (data.mouseAnimation) {
        mousedown();
    }
    window.addEventListener("scroll", onScrollPage);
    if (isDaylight()) {
        data.isDark = true;
        let root = document.querySelector(":root");
        root.style.setProperty("--background", "#272727");
        root.style.setProperty("--fontColor", "white");
        root.style.setProperty("--borderColor", "#4F4F4F");
        root.style.setProperty("--borderHoverColor", "black");
        root.style.setProperty("--articleFontColor", "#E4E4E4");
        root.style.setProperty("--articleGreyFontColor", "#D4D4D4");
        root.style.setProperty("--commentContent", "#D4D4D4");
        root.style.setProperty("--favoriteBg", "#1e1e1e");
    }

    // 检查当前路由
    checkRoute(route);

    let toolbarStatus = {
        enter: false,
        visible: true,
    };
    store.commit("changeToolbarStatus", toolbarStatus);
    getWebInfo();
    buildCssPicture();
    getSortInfo();

    data.mobile = document.body.clientWidth < 1100;

    window.addEventListener("resize", () => {
        let docWidth = document.body.clientWidth;
        data.mobile = docWidth < 900;
    });
});

onUnmounted(() => {
    window.removeEventListener("scroll", onScrollPage);
});

watch(() => data.scrollTop, (newScrollTop, oldScrollTop) => {
    // 如果滑动距离超过屏幕高度三分之一视为进入页面，背景改为白色
    let enter = newScrollTop > window.innerHeight / 3;
    const top = newScrollTop - oldScrollTop < 0;
    let isShow = newScrollTop - window.innerHeight > 30;
    data.toolButton = isShow;

    // 导航栏显示与颜色
    let toolbarStatus = {
        enter: enter,
        visible: top,
    };
    store.commit("changeToolbarStatus", toolbarStatus);
});

const toolbar = computed(() => store.state.toolbar);
const sortInfo = computed(() => store.state.sortInfo);

const smallMenu = (data) => {
    router.push(data);
    data.toolbarDrawer = false;
};

const smallMenuLogout = () => {
    logout();
    data.toolbarDrawer = false;
};

const hideOrShow = () => {
    data.sortMenu = !data.sortMenu;
};

const checkRoute = (route) => {
    const homeRoutes = ['content']; // 根据实际需要调整
    data.showElement = homeRoutes.includes(route.name);
};

const goIm = () => {
    if (common.isEmpty(store.state.currentUser)) {
        ElMessage({
            message: "请先登录！",
            type: "error",
        });
    } else {
        let userToken = common.encrypt(localStorage.getItem("userToken"));
        window.open(constant.webURL + "/im");
    }
};


const goAdmin = () => {
    window.open(constant.webURL + "/admin");
};

const logout = () => {
    http.get(constant.baseURL + "/user/logout")
        .then((res) => { })
        .catch((error) => {
            ElMessage({
                message: error.message,
                type: "error",
            });
        });
    store.commit("loadCurrentUser", {});
    localStorage.removeItem("userToken");
    ElMessage({
        message: '当前帐号已登出！',
        type: "success",
    });
    router.push({ path: "/" });
};

const getWebInfo = () => {
    http.get(constant.baseURL + "/webInfo/getWebInfo")
        .then((res) => {
            if (!common.isEmpty(res.data)) {
                store.commit("loadWebInfo", res.data);
                localStorage.setItem("defaultStoreType", res.data.defaultStoreType);
            }
        })
        .catch((error) => {
            ElMessage({
                message: error.message,
                type: "error",
            });
        });
};

const gotoContent = () => {
    router.push({ path: '/content' });
};

const buildCssPicture = () => {
    let root = document.querySelector(":root");
    let webStaticResourcePrefix = import.meta.env.VITE_WEB_STATIC_RESOURCE_PREFIX;
    root.style.setProperty(
        "--letterBg",
        "url(" + webStaticResourcePrefix + "assets/image/letterBg.png)"
    );
    root.style.setProperty(
        "--letterStamp",
        "url(" + webStaticResourcePrefix + "assets/image/letterStamp.png)"
    );
    root.style.setProperty(
        "--letterStitch",
        "url(" + webStaticResourcePrefix + "assets/image/letterStitch.png)"
    );
    root.style.setProperty(
        "--commentURL",
        "url(" + webStaticResourcePrefix + "assets/image/commentURL.png)"
    );
    root.style.setProperty(
        "--springBg",
        "url(" + webStaticResourcePrefix + "assets/image/springBg.png)"
    );
    root.style.setProperty(
        "--bannerWave1",
        "url(" + webStaticResourcePrefix + "assets/image/bannerWave1.png) repeat-x"
    );
    root.style.setProperty(
        "--bannerWave2",
        "url(" + webStaticResourcePrefix + "assets/image/bannerWave2.png) repeat-x"
    );
    root.style.setProperty(
        "--backgroundPicture",
        "url(" + webStaticResourcePrefix + "assets/image/backgroundPicture.jpg)"
    );
    root.style.setProperty(
        "--toolbar",
        "url(" + webStaticResourcePrefix + "assets/image/toolbar.jpg)"
    );
    root.style.setProperty(
        "--love",
        "url(" + webStaticResourcePrefix + "assets/image/love.jpg)"
    );
    const font = new FontFace(
        "poetize-font",
        "url(" + webStaticResourcePrefix + "assets/font/font.woff2)"
    );
    font.load();
    document.fonts.add(font);
};

const getSortInfo = () => {
    http.get(constant.baseURL + "/webInfo/getSortInfo")
        .then((res) => {
            if (!common.isEmpty(res.data)) {
                store.commit("loadSortInfo", res.data);
            }
        })
        .catch((error) => {
            ElMessage({
                message: error.message,
                type: "error",
            });
        });
};

const changeColor = () => {
    data.isDark = !data.isDark;
    let root = document.querySelector(":root");

    if (data.isDark) {
        root.style.setProperty("--background", "#272727");
        root.style.setProperty("--fontColor", "white");
        root.style.setProperty("--borderColor", "#4F4F4F");
        root.style.setProperty("--borderHoverColor", "black");
        root.style.setProperty("--articleFontColor", "#E4E4E4");
        root.style.setProperty("--articleGreyFontColor", "#D4D4D4");
        root.style.setProperty("--commentContent", "#D4D4D4");
        root.style.setProperty("--favoriteBg", "#1e1e1e");
    } else {
        root.style.setProperty("--background", "white");
        root.style.setProperty("--fontColor", "black");
        root.style.setProperty("--borderColor", "rgba(0, 0, 0, 0.5)");
        root.style.setProperty(
            "--borderHoverColor",
            "rgba(110, 110, 110, 0.4)"
        );
        root.style.setProperty("--articleFontColor", "#1F1F1F");
        root.style.setProperty("--articleGreyFontColor", "#616161");
        root.style.setProperty("--commentContent", "#F7F9FE");
        root.style.setProperty("--favoriteBg", "#f7f9fe");
    }
};

const toTop = () => {
    window.scrollTo({
        top: 0,
        behavior: "smooth",
    });
};

const onScrollPage = () => {
    data.scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
};

const isDaylight = () => {
    let currDate = new Date();
    return currDate.getHours() > 22 || currDate.getHours() < 7;
};

const changeMouseAnimation = () => {
    data.mouseAnimation = !data.mouseAnimation;
    if (data.mouseAnimation) {
        nextTick(() => {
            mousedown();
        });
    }
};

const { toolButton, hoverEnter, mouseAnimation, isDark, scrollTop, toolbarDrawer, mobile, showElement, sortMenu } = toRefs(data)
</script>

<style>
.custom-popper {
    background-color: hsla(0, 0%, 100%, 0.3137254901960784) !important;
    border: none;
}
</style>

<style scoped>
.toolbar-content {
    width: 100%;
    height: 60px;
    color: var(--white);
    position: fixed;
    z-index: 100;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    transition: all 0.3s ease-in-out;
}

.toolbar-content.enter {
    background: var(--toolbarBackground);
    color: var(--toolbarFont);
    box-shadow: 0 1px 3px 0 rgba(0, 34, 77, 0.05);
}

.toolbar-content.hoverEnter {
    background: var(--translucent);
    box-shadow: 0 1px 3px 0 rgba(0, 34, 77, 0.05);
}

.toolbar-title {
    margin-left: 30px;
    cursor: pointer;
}

.toolbar-mobile-menu {
    font-size: 30px;
    margin-right: 15px;
    cursor: pointer;
}

.scroll-menu {
    margin: 0 25px 0 0;
    display: flex;
    justify-content: flex-end;
    padding: 0;
}

.scroll-menu li {
    list-style: none;
    margin: 0 8px;
    font-size: 17px;
    height: 60px;
    line-height: 60px;
    position: relative;
    cursor: pointer;
}

.scroll-menu li:hover .my-menu span {
    color: var(--themeBackground);
}

.scroll-menu li:hover .my-menu i {
    color: var(--themeBackground);
    -webkit-animation: scale 1.5s ease-in-out infinite;
    animation: scale 1.5s ease-in-out infinite;
}

.scroll-menu li .my-menu:after {
    content: '';
    display: block;
    position: absolute;
    bottom: 0;
    height: 6px;
    background-color: var(--themeBackground);
    width: 100%;
    max-width: 0;
    transition: max-width 0.25s ease-in-out;
}

.scroll-menu li:hover .my-menu:after {
    max-width: 100%;
}

.sortMenu {
    margin-left: 44px;
    font-size: 17px;
    position: relative;
}

.sortMenu:after {
    top: 32px;
    width: 35px;
    left: 0;
    height: 2px;
    background: var(--themeBackground);
    content: '';
    border-radius: 1px;
    position: absolute;
}

.header-avatar-wrap {
    position: relative;
    margin-top: 10px;
    width: 40px;
    height: 40px;
    cursor: pointer;
}

.default-login {
    font-size: 15px;
    border-radius: 50%;
    background-color: #ff8cb0;
    text-align: center;
    line-height: 40px;
    color: var(--white);
}

#toc-button,
.toolButton {
    -webkit-animation: slide-bottom 0.5s ease-in-out both;
    animation: slide-bottom 0.5s ease-in-out both;
    width: 30px;
}

#toc-button {
    font-size: 23px;
    margin-bottom: 4px;
}

#toc-button:hover {
    color: var(--themeBackground);
}

.toolButton {
    position: fixed;
    right: 3vh;
    bottom: 3vh;
    z-index: 100;
    font-size: 25px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.my-setting {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    cursor: pointer;
    font-size: 20px;
}

.my-setting i {
    padding: 5px;
}

.my-setting i:hover {
    color: var(--themeBackground);
}

.backTop {
    transition: all 0.3s ease-in;
    position: relative;
    top: 0;
    left: -13px;
}

.backTop:hover {
    top: -10px;
}

#outerImg {
    position: fixed;
    top: 0;
    left: 0;
    background: rgba(0, 0, 0, 0.6);
    z-index: 10;
    width: 100%;
    height: 100%;
    display: none;
}

@media screen and (max-width: 400px) {
    .toolButton {
        right: 0.5vh;
    }
}
</style>
