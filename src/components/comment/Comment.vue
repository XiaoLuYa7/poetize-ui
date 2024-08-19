<template>
    <div>
        <!-- 评论框 -->
        <div style="margin-bottom: 40px">
            <div class="comment-head">
                <i class="el-icon-edit-outline" style="font-weight: bold; font-size: 22px"></i>
                留言
            </div>
            <div>
                <!-- 文字评论 -->
                <div>
                    <commentBox @submitComment="submitComment"></commentBox>
                </div>
            </div>
        </div>

        <!-- 评论内容 -->
        <div v-if="comments.length > 0">
            <!-- 评论数量 -->
            <div class="commentInfo-title">
                <span style="font-size: 1.15rem">Comments | </span>
                <span>{{ total }} 条留言</span>
            </div>
            <div id="comment-content" class="commentInfo-detail" v-for="(item, index) in comments" :key="index">
                <!-- 头像 -->
                <el-avatar shape="square" class="commentInfo-avatar" :size="35" :src="item.avatar"></el-avatar>

                <div style="flex: 1; padding-left: 12px">
                    <!-- 评论信息 -->
                    <div style="display: flex; justify-content: space-between">
                        <div>
                            <span class="commentInfo-username">{{ item.username }}</span>
                            <span class="commentInfo-master" v-if="item.userId === userId">主人翁</span>
                            <span class="commentInfo-other">{{
                                common.getDateDiff(item.createTime)
                                }}</span>
                        </div>

                        <div class="myCenter">
                            <!-- 显示删除模块 1.当前用户必须登录 2.当前用户Id是文章作者 3.当前用户Id是当前评论者 4.当前用户是站主-->
                            <el-tooltip effect="dark" content="真的要删除嘛！" placement="top" v-if="!common.isEmpty(store.state.currentUser) &&
                                (store.state.currentUser.id === item.userId ||
                                    store.state.currentUser.id === userId ||
                                    store.state.currentUser.isBoss)">
                                <div @click="deleteComment(item.id)" class="comment-delete myCenter"
                                    style="cursor: pointer; margin-left: 10px">
                                    <svg viewBox="0 0 1024 1024" width="18" height="18" style="vertical-align: -2px">
                                        <path
                                            d="M921.1392 155.392h-270.592v-48.2816c0-22.7328-18.432-41.1648-41.1648-41.1648H426.3424a41.1648 41.1648 0 0 0-41.1648 41.1648v48.2816H110.6432c-14.1312 0-25.6 11.4688-25.6 25.6s11.4688 25.6 25.6 25.6h810.496c14.1312 0 25.6-11.4688 25.6-25.6s-11.4688-25.6-25.6-25.6zM170.8032 260.0448v592.8448c0 50.8928 41.2672 92.16 92.16 92.16h500.6848c50.8928 0 92.16-41.2672 92.16-92.16V260.0448H170.8032z m249.1392 462.7968c0 14.1312-11.4688 25.6-25.6 25.6s-25.6-11.4688-25.6-25.6V443.0848c0-14.1312 11.4688-25.6 25.6-25.6s25.6 11.4688 25.6 25.6v279.7568z m243.1488 0c0 14.1312-11.4688 25.6-25.6 25.6s-25.6-11.4688-25.6-25.6V443.0848c0-14.1312 11.4688-25.6 25.6-25.6s25.6 11.4688 25.6 25.6v279.7568z"
                                            fill="#FF623E"></path>
                                    </svg>
                                </div>
                            </el-tooltip>

                            <div class="commentInfo-reply" style="margin-left: 20px" @click="replyDialog(item, item)">
                                <span v-if="item.childComments.total > 0">{{ item.childComments.total }}
                                </span><span>回复</span>
                            </div>
                        </div>
                    </div>
                    <!-- 评论内容 -->
                    <div class="commentInfo-content">
                        <span v-html="item.commentContent"></span>
                    </div>
                    <!-- 回复模块 -->
                    <div v-if="
                        !common.isEmpty(item.childComments) &&
                        !common.isEmpty(item.childComments.records)
                    ">
                        <div class="commentInfo-detail" v-for="(childItem, i) in item.childComments.records" :key="i">
                            <!-- 头像 -->
                            <el-avatar shape="square" class="commentInfo-avatar" :size="30"
                                :src="childItem.avatar"></el-avatar>

                            <div style="flex: 1; padding-left: 12px">
                                <!-- 评论信息 -->
                                <div style="display: flex; justify-content: space-between">
                                    <div>
                                        <span class="commentInfo-username-small">{{
                                            childItem.username
                                            }}</span>
                                        <span class="commentInfo-master" v-if="childItem.userId === userId">主人翁</span>
                                        <span class="commentInfo-other">{{
                                            common.getDateDiff(childItem.createTime)
                                            }}</span>
                                    </div>
                                    <div class="myCenter">
                                        <el-tooltip effect="dark" content="真的要删除嘛！" placement="top" v-if="
                                            !common.isEmpty(store.state.currentUser) &&
                                            (store.state.currentUser.id === childItem.userId ||
                                                store.state.currentUser.id === userId ||
                                                store.state.currentUser.isBoss)
                                        ">
                                            <div @click="deleteComment(childItem.id)" class="comment-delete myCenter"
                                                style="cursor: pointer; margin-left: 10px">
                                                <svg viewBox="0 0 1024 1024" width="18" height="18"
                                                    style="vertical-align: -2px">
                                                    <path
                                                        d="M921.1392 155.392h-270.592v-48.2816c0-22.7328-18.432-41.1648-41.1648-41.1648H426.3424a41.1648 41.1648 0 0 0-41.1648 41.1648v48.2816H110.6432c-14.1312 0-25.6 11.4688-25.6 25.6s11.4688 25.6 25.6 25.6h810.496c14.1312 0 25.6-11.4688 25.6-25.6s-11.4688-25.6-25.6-25.6zM170.8032 260.0448v592.8448c0 50.8928 41.2672 92.16 92.16 92.16h500.6848c50.8928 0 92.16-41.2672 92.16-92.16V260.0448H170.8032z m249.1392 462.7968c0 14.1312-11.4688 25.6-25.6 25.6s-25.6-11.4688-25.6-25.6V443.0848c0-14.1312 11.4688-25.6 25.6-25.6s25.6 11.4688 25.6 25.6v279.7568z m243.1488 0c0 14.1312-11.4688 25.6-25.6 25.6s-25.6-11.4688-25.6-25.6V443.0848c0-14.1312 11.4688-25.6 25.6-25.6s25.6 11.4688 25.6 25.6v279.7568z"
                                                        fill="#FF623E"></path>
                                                </svg>
                                            </div>
                                        </el-tooltip>

                                        <div style="margin-left: 20px">
                                            <span class="commentInfo-reply"
                                                @click="replyDialog(childItem, item)">回复</span>
                                        </div>
                                    </div>
                                </div>
                                <!-- 评论内容 -->
                                <div class="commentInfo-content">
                                    <template v-if="
                                        childItem.parentCommentId !== item.id &&
                                        childItem.parentUserId !== childItem.userId
                                    ">
                                        <span style="color: var(--blue)">@{{ childItem.parentUsername }} </span>:
                                    </template>
                                    <span v-html="childItem.commentContent"></span>
                                </div>
                            </div>
                        </div>
                        <!-- 分页 -->
                        <div class="pagination-wrap" v-if="
                            item.childComments.records.length < item.childComments.total
                        ">
                            <div class="pagination" @click="toChildPage(item)">展开</div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="myCenter proPage" v-if="pagination.size < pagination.total">
                <el-pagination background layout="prev, pager, next" :total="pagination.total"
                    :page-size="pagination.size" :pager-count="7" @current-change="handlePageChange">
                </el-pagination>
            </div>
        </div>

        <div v-else class="myCenter" style="color: var(--greyFont)">
            <i>来发第一个留言啦~</i>
        </div>

        <el-dialog title="留言" v-model:visible="replyDialogVisible" width="40%" :before-close="handleClose"
            :append-to-body="true" :close-on-click-modal="false" destroy-on-close center top="25vh">
            <div>
                <CommentBox @submitComment="submitReply"></CommentBox>
            </div>
        </el-dialog>
    </div>
</template>



<script setup>
import { ref, reactive, onMounted, nextTick, watch, inject, toRefs } from 'vue';
import { useStore } from 'vuex';
import { ElMessage, ElMessageBox } from 'element-plus';
import CommentBox from './CommentBox.vue';

// Inject dependencies
const http = inject('$http');
const common = inject('$common');
const constant = inject('$constant');
const store = useStore();

// Props
const props = defineProps({
    source: {
        type: Number,
        default: 0,
    },
    type: {
        type: String,
    },
    userId: {
        type: Number,
        default: 1,
    },
    sortId: {
        type: Number,
    },
});

// Reactive state
const data = reactive({
    total: 0,
    replyDialogVisible: false,
    floorComment: {},
    replyComment: {},
    comments: [],
    pagination: {
        current: 1,
        size: 10,
        total: 0,
        source: props.source,
        commentType: props.type,
        floorCommentId: null,
        userId: store.state.currentUser.id,
    }
});


// Watch for changes in props and update pagination
watch(() => props.source, (newVal) => {
    data.pagination.source = newVal;
    getComments(data.pagination);
});

watch(() => props.type, (newVal) => {
    data.pagination.commentType = newVal;
    getComments(data.pagination);
});

// Functions
const getTotal = async () => {
    try {
        const res = await http.get(`${constant.baseURL}/comment/getCommentCount`, {
            source: props.source,
            type: props.type,
        });
        if (!common.isEmpty(res.data)) {
            data.total = res.data;
        }
    } catch (error) {
        ElMessage.error(error.message);
    }
};

const getComments = async (paginationData, floorCommentData = {}, isToPage = false) => {
    try {
        const res = await http.post(`${constant.baseURL}/comment/listComment`, paginationData);
        if (!common.isEmpty(res.data)) {
            if (common.isEmpty(floorCommentData)) {
                data.comments = res.data.records;
                paginationData.total = res.data.total;
                emoji(data.comments, true);
            } else {
                if (!isToPage) {
                    floorCommentData.childComments = res.data;
                } else {
                    floorCommentData.childComments.total = res.data.total;
                    floorCommentData.childComments.records.push(...res.data.records);
                }
                emoji(floorCommentData.childComments.records, false);
            }
            nextTick(() => common.imgShow('#comment-content .pictureReg'));
        }
    } catch (error) {
        ElMessage.error(error.message);
    }
};

const emoji = (commentsList, flag) => {
    commentsList.forEach((c) => {
        c.commentContent = c.commentContent.replace(/\n/g, '<br/>');
        c.commentContent = common.faceReg(c.commentContent);
        c.commentContent = common.pictureReg(c.commentContent);
        if (flag && c.childComments?.records) {
            c.childComments.records.forEach((cc) => {
                cc.commentContent = cc.commentContent.replace(/\n/g, '<br/>');
                cc.commentContent = common.faceReg(cc.commentContent);
                cc.commentContent = common.pictureReg(cc.commentContent);
            });
        }
    });
};

const deleteComment = async (id) => {
    if (common.isEmpty(store.state.currentUser)) {
        ElMessage.error('请先登录！');
        return;
    }
    try {
        await ElMessageBox.confirm('删除评论后，所有该评论的回复均被删除。确认删除？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            center: true,
        });
        await http.get(`${constant.baseURL}/comment/deleteComment`, { id, articleId: props.source });
        ElMessage.success('删除成功!');
        await getComments(data.pagination);
        await getTotal();
    } catch (error) {
        ElMessage.error(error.message);
    }
};

const submitComment = async (commentContent) => {
    try {
        await http.post(`${constant.baseURL}/comment/saveComment`, {
            source: props.source,
            type: props.type,
            sortId: props.sortId,
            commentContent,
        });
        data.pagination.current = 1;
        data.pagination.total = 0;
        data.pagination.floorCommentId = null;
        await getComments(data.pagination);
        await getTotal();
        ElMessage.success('保存成功！');
    } catch (error) {
        ElMessage.error(error.message);
    }
};

const submitReply = async (commentContent) => {
    try {
        await http.post(`${constant.baseURL}/comment/saveComment`, {
            source: props.source,
            type: props.type,
            sortId: props.sortId,
            floorCommentId: data.floorComment.id,
            commentContent,
            parentCommentId: data.replyComment.id,
            parentUserId: data.replyComment.userId,
        });
        const paginationData = {
            current: 1,
            size: 5,
            total: 0,
            source: props.source,
            commentType: props.type,
            floorCommentId: data.floorComment.id,
        };
        await getComments(paginationData, data.floorComment);
        await getTotal();
        handleClose();
    } catch (error) {
        ElMessage.error(error.message);
    }
};

const replyDialog = (comment, floorCommentData) => {
    data.replyComment = comment;
    data.floorComment = floorCommentData;
    data.replyDialogVisible = true;
};

const handlePageChange = async (currentPage) => {
    data.pagination.current = currentPage;
    await getComments(data.pagination);
    document.querySelector('.comment-head').scrollIntoView({
        behavior: 'smooth',
        block: 'start',
        inline: 'nearest',
    });
};

const handleClose = () => {
    data.replyDialogVisible = false;
    data.floorComment = {};
    data.replyComment = {};
};

// Lifecycle hooks
onMounted(() => {
    getComments(data.pagination);
    getTotal();
});

const { total, replyDialogVisible, replyComment, floorComment, comments, pagination } = toRefs(data)

</script>

<style scoped>
.comment-delete {
    font-size: 14px;
    cursor: pointer;
}

.comment-head {
    display: flex;
    align-items: center;
    font-size: 20px;
    font-weight: bold;
    margin: 40px 0 20px 0;
    user-select: none;
    color: var(--themeBackground);
}

.commentInfo-title {
    margin-bottom: 20px;
    color: var(--greyFont);
    user-select: none;
}

#comment-content {
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    margin-bottom: 20px;
}

.commentInfo-detail {
    display: flex;
}

.commentInfo-avatar {
    border-radius: 5px;
}

.commentInfo-username {
    color: var(--orangeRed);
    font-size: 16px;
    font-weight: 600;
    margin-right: 5px;
}

.commentInfo-username-small {
    color: var(--orangeRed);
    font-size: 14px;
    font-weight: 600;
    margin-right: 5px;
}

.commentInfo-master {
    color: var(--green);
    border: 1px solid var(--green);
    border-radius: 0.2rem;
    font-size: 12px;
    padding: 2px 4px;
    margin-right: 5px;
}

.commentInfo-other {
    font-size: 12px;
    color: var(--greyFont);
    user-select: none;
}

.commentInfo-reply {
    font-size: 12px;
    cursor: pointer;
    user-select: none;
    color: var(--white);
    background: var(--themeBackground);
    border-radius: 0.2rem;
    padding: 3px 6px;
}

.commentInfo-content {
    margin: 15px 0 25px;
    padding: 18px 20px;
    background: var(--commentContent);
    border-radius: 12px;
    color: var(--black);
    word-break: break-word;
}

.pagination-wrap {
    display: flex;
    justify-content: center;
    margin: 25px 0 30px;
}

.pagination {
    padding: 6px 20px;
    color: var(--greyFont);
    user-select: none;
    cursor: pointer;
    text-align: center;
    font-size: 12px;
}
</style>
