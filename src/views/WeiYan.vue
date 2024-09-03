<template>
    <div>
        <!-- 两句诗 -->
        <div class="my-animation-slide-top">
            <TwoPoem :isHitokoto="false"></TwoPoem>
        </div>

        <div style="background: var(--background); animation: hideToShow 2.5s">
            <div id="treeHole">
                <TreeHole :treeHoleList="treeHoleList" style="min-height: 70vh" :avatar="!common.isEmpty(store.state.currentUser)
                    ? store.state.currentUser.avatar
                    : store.state.webInfo.avatar" :showName="true" :showPlane="true" @launch="launch"  @deleteTreeHole="deleteTreeHole">
                </TreeHole>
                <div class="myCenter proPage" v-if="pagination.size < pagination.total"
                    style="margin: 10px 0px 30px 0px">
                    <el-pagination background layout="prev, pager, next" :total="pagination.total"
                        :page-size="pagination.size" :pager-count="5" @current-change="handlePageChange">
                    </el-pagination>
                </div>
            </div>

            <!-- 页脚 -->
            <MyFooter :showFooter="showFooter"></MyFooter>
        </div>

        <el-dialog draggable title="朋友圈" v-model="weiYanDialogVisible" width="40%" :before-close="handleClose"
            :append-to-body="true" destroy-on-close :close-on-click-modal="false" center top="25vh">
            <div>
                <div class="myCenter" style="padding-bottom: 20px; position: relative">
                    <el-radio-group v-model="isPublic" class="radio-group-center">
                        <el-radio-button :value="true">公开</el-radio-button>
                        <el-radio-button :value="false">私密</el-radio-button>
                    </el-radio-group>
                </div>
                <CommentBox @submitComment="submitWeiYan"></CommentBox>
            </div>
        </el-dialog>
    </div>
</template>

<script setup>
import TwoPoem from '../components/common/TwoPoem.vue'
import MyFooter from '../components/common/MyFooter.vue'
import TreeHole from '../components/common/TreeHole.vue'
import CommentBox from '../components/comment/CommentBox.vue'
import { nextTick, reactive, toRefs, inject, onMounted } from 'vue';
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { ElMessage, ElMessageBox } from "element-plus";

// hooks
const common = inject("$common");
const constant = inject("$constant");
const http = inject("$http");

const store = useStore();
const router = useRouter();

const data = reactive({
    treeHoleList: [],
    pagination: {
        current: 1,
        size: 12,
        total: 0,
        classify: 'friend',
        userId: common.isEmpty(store.state.currentUser)
            ? 1
            : store.state.currentUser.id,
    },
    weiYanDialogVisible: false,
    isPublic: true,
    showFooter: false
})



onMounted(()=>{
    getWeiYan();
})

const handlePageChange = async (currentPage) => {
    data.pagination.current = currentPage;
    await getWeiYan();
    document.querySelector('.my-animation-slide-top').scrollIntoView({
        behavior: 'smooth',
        block: 'start',
        inline: 'nearest',
    });
}

const launch = () => {
    if (common.isEmpty(store.state.currentUser)) {
        ElMessage({
            message: '请先登录！',
            type: 'error',
        });
        return;
    }
    data.weiYanDialogVisible = true;
}

const handleClose = () => {
    data.weiYanDialogVisible = false;
}

const submitWeiYan = (content) => {
    let weiYan = {
        content: content,
        isPublic: data.isPublic,
        type: 'friend',
        userId: store.state.currentUser.id,
    };

    http.post(constant.baseURL + '/weiYan/saveWeiYan', weiYan)
        .then(() => {
            getWeiYan();
        })
        .catch((error) => {
            ElMessage({
                message: error.message,
                type: 'error',
            });
        });
    handleClose();
}

const deleteTreeHole = (id) => {
    if (common.isEmpty(store.state.currentUser)) {
        ElMessage({
            message: '请先登录！',
            type: 'error',
        });
        return;
    }

    ElMessageBox.confirm('确认删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'success',
        center: true,
    })
        .then(() => {
            http.get(constant.baseURL + '/weiYan/deleteWeiYan', { id: id })
                .then(() => {
                    ElMessage({
                        type: 'success',
                        message: '删除成功!',
                    });
                    data.pagination.current = 1;
                    getWeiYan();
                })
                .catch((error) => {
                    ElMessage({
                        message: error.message,
                        type: 'error',
                    });
                });
        })
        .catch(() => {
            ElMessage({
                type: 'success',
                message: '已取消删除!',
            });
        });
}

const getWeiYan = async () => {
    await http.post(constant.baseURL + '/weiYan/listWeiYan', data.pagination)
        .then((res) => {
            data.showFooter = false;
            if (!common.isEmpty(res.data)) {
                res.data.records.forEach((c) => {
                    c.content = c.content.replace(
                        /\n{2,}/g,
                        '<div style="height: 12px"></div>'
                    );
                    c.content = c.content.replace(/\n/g, '<br/>');
                    c.content = common.faceReg(c.content);
                    c.content = common.pictureReg(c.content);
                });
                data.treeHoleList = res.data.records;
                data.pagination.total = res.data.total;
            }
            nextTick(() => {
                data.showFooter = true;
                common.imgShow('.tree-hole-box .pictureReg');
            });
        })
        .catch((error) => {
            ElMessage({
                message: error.message,
                type: 'error',
            });
        });
}

const {treeHoleList , pagination ,weiYanDialogVisible,isPublic,showFooter} = toRefs(data)

</script>

<style>
.warning-icon {
    position: absolute;
    right: 0;
    cursor: pointer;
}

.box-width {
    width: 35%;
}
</style>
