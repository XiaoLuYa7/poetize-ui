import { createRouter, createWebHistory } from 'vue-router';

// Vue 3 不再使用 `Vue.use(VueRouter)`，而是直接创建路由实例
const routes = [
    {
        path: '/',
        component: () => import('../views/Home.vue'),
        children: [
            {
                path: '/',
                name: 'Index',
                component: () => import('../views/Index.vue')
            },
            {
                path: '/content',
                name: 'content',
                component: () => import('../views/Content.vue')
            },
            {
                path: '/sort',
                name: 'sort',
                component: () => import('../views/Sort.vue')
            },
            {
                path: '/article/:id',
                name: 'article',
                component: () => import('../views/Article.vue')
            },
            {
                path: '/weiYan',
                name: 'weiYan',
                component: () => import('../views/WeiYan.vue')
            },
            {
                path: '/love',
                name: 'love',
                component: () => import('../views/Love.vue')
            },
            {
                path: '/favorite',
                name: 'favorite',
                component: () => import('../views/Favorite.vue')
            },
            {
                path: '/message',
                name: 'message',
                component: () => import('../views/Message.vue')
            },
            {
                path: '/about',
                name: 'about',
                component: () => import('../views/About.vue')
            },
            {
                path: '/user',
                name: 'user',
                component: () => import('../views/User.vue')
            },
            {
                path: '/login',
                name: 'login',
                component: () => import('../views/Login.vue')
            },
            {
                path: '/letter',
                name: 'letter',
                component: () => import('../views/Letter.vue')
            }
        ]
    },
    {
        path: '/admin',
        redirect: '/welcome',
        meta: { requiresAuth: true },
        component: () => import('../views/admin/Admin.vue'),
        children: [
            {
                path: '/welcome',
                name: 'welcome',
                component: () => import('../views/admin/Welcome.vue')
            },
            {
                path: '/main',
                name: 'main',
                component: () => import('../views/admin/Main.vue')
            },
            {
                path: '/webEdit',
                name: 'webEdit',
                component: () => import('../views/admin/WebEdit.vue')
            },
            {
                path: '/userList',
                name: 'userList',
                component: () => import('../views/admin/UserList.vue')
            },
            {
                path: '/postList',
                name: 'postList',
                component: () => import('../views/admin/PostList.vue')
            },
            {
                path: '/postEdit',
                name: 'postEdit',
                component: () => import('../views/admin/PostEdit.vue')
            },
            {
                path: '/sortList',
                name: 'sortList',
                component: () => import('../views/admin/SortList.vue')
            },
            {
                path: '/commentList',
                name: 'commentList',
                component: () => import('../views/admin/CommentList.vue')
            },
            {
                path: '/treeHoleList',
                name: 'treeHoleList',
                component: () => import('../views/admin/TreeHoleList.vue')
            },
            {
                path: '/resourceList',
                name: 'resourceList',
                component: () => import('../views/admin/ResourceList.vue')
            },
            {
                path: '/loveList',
                name: 'loveList',
                component: () => import('../views/admin/LoveList.vue')
            },
            {
                path: '/resourcePathList',
                name: 'resourcePathList',
                component: () => import('../views/admin/ResourcePathList.vue')
            }
        ]
    },
    {
        path: '/verify',
        name: 'verify',
        component: () => import('../views/admin/Verify.vue')
    },
    {
        path: '/im',
        name: 'im',
        component: () => import('../views/im/Index.vue')
    }

]

// 创建路由实例
const router = createRouter({
    history: createWebHistory(),
    routes,
    scrollBehavior() {
        return { top: 0 };
    }
})

// 全局导航守卫
router.beforeEach((to, from, next) => {
    if (to.matched.some(record => record.meta.requiresAuth)) {
        if (!localStorage.getItem("adminToken")) {
            next({
                path: '/verify',
                query: { redirect: to.fullPath }
            });
        } else {
            next();
        }
    } else {
        next();
    }
})

export default router
