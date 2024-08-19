<template>
    <div>
        <div style="margin-bottom: 20px">
            <el-select v-if="isBoss" v-model:value="pagination.commentType" placeholder="评论来源类型"
                style="margin-right: 10px">
                <el-option key="1" label="文章评论" value="article"></el-option>
                <el-option key="2" label="树洞留言" value="message"></el-option>
                <el-option key="3" label="家庭祝福" value="love"></el-option>
            </el-select>
            <el-input class="my-input" type="number" style="width: 140px; margin-right: 10px"
                v-model:value="pagination.source" placeholder="评论来源标识"></el-input>
            <el-button type="primary" icon="el-icon-search" @click="searchComments()">搜索</el-button>
            <el-button type="danger" @click="clearSearch()">清除参数</el-button>
        </div>
        <el-table :data="comments" border class="table" header-cell-class-name="table-header">
            <el-table-column prop="id" label="ID" width="55" align="center"></el-table-column>
            <el-table-column prop="source" label="评论来源标识" align="center"></el-table-column>
            <el-table-column prop="type" label="评论来源类型" align="center"></el-table-column>
            <el-table-column prop="userId" label="发表用户ID" align="center"></el-table-column>
            <el-table-column prop="commentContent" label="评论内容" align="center"></el-table-column>
            <el-table-column prop="createTime" label="创建时间" align="center"></el-table-column>
            <el-table-column label="操作" width="180" align="center">
                <template v-slot="scope">
                    <el-button type="text" icon="el-icon-delete" style="color: var(--orangeRed)"
                        @click="handleDelete(scope.row)">
                        删除
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="pagination">
            <el-pagination background layout="total, prev, pager, next" :current-page="pagination.current"
                :page-size="pagination.size" :total="pagination.total" @current-change="handlePageChange">
            </el-pagination>
        </div>
    </div>
</template>

<script setup>
import { reactive, inject , toRefs} from 'vue';
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
    isBoss: store.state.currentAdmin.isBoss,
    pagination: {
        current: 1,
        size: 10,
        total: 0,
        source: null,
        commentType: '',
    },
    comments: []
});

// 获取评论列表
const getComments = () => {
    let url = data.isBoss ? '/admin/comment/boss/list' : '/admin/comment/user/list';
    http.post(constant.baseURL + url, data.pagination, true)
        .then((res) => {
            if (!common.isEmpty(res.data)) {
                data.comments = res.data.records;
                data.pagination.total = res.data.total;
            }
        })
        .catch((error) => {
            ElMessage({
                message: error.message,
                type: 'error',
            });
        });
};

// 清除搜索条件
const clearSearch = () => {
    data.pagination = {
        current: 1,
        size: 10,
        total: 0,
        source: null,
        commentType: '',
    };
    getComments();
};

// 处理分页变化
const handlePageChange = (val) => {
    data.pagination.current = val;
    getComments();
};

// 搜索评论
const searchComments = () => {
    data.pagination.total = 0;
    data.pagination.current = 1;
    getComments();
};

// 处理删除评论
const handleDelete = (item) => {
    let url = data.isBoss ? '/admin/comment/boss/deleteComment' : '/admin/comment/user/deleteComment';
    ElMessageBox.confirm(
        '删除评论后，所有该评论的回复均被删除。确认删除？',
        '提示',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'success',
            center: true,
        }
    )
        .then(() => {
            http.get(constant.baseURL + url, { id: item.id }, true)
                .then(() => {
                    data.pagination.current = 1;
                    getComments();
                    ElMessage({
                        message: '删除成功！',
                        type: 'success',
                    });
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
};

// 初始化获取评论
getComments();

const { isBoss, pagination, comments } = toRefs(data);

</script>

<style scoped>
.pagination {
    margin: 20px 0;
    text-align: right;
}

.my-input>>>input::-webkit-inner-spin-button {
    appearance: none;
}
</style>
