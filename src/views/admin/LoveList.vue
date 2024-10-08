<template>
    <div>
        <div>
            <div class="handle-box">
                <span>状态：</span>
                <el-select clearable v-model="pagination.status" popper-class="custom-popper" filterable placeholder="状态" class="handle-select" style="margin-right: 10px">
                    <el-option key="1" label="启用" :value="true"></el-option>
                    <el-option key="2" label="禁用" :value="false"></el-option>
                </el-select>
                <el-button type="primary" :icon="Search" @click="search()" style="margin-left: 15px">搜索</el-button>
            </div>
            <el-table :data="loves" border class="table" header-cell-class-name="table-header">
                <el-table-column prop="id" label="ID" width="55" align="center"></el-table-column>
                <el-table-column prop="userId" label="用户ID" align="center"></el-table-column>

                <el-table-column prop="manName" label="男生昵称" align="center"></el-table-column>
                <el-table-column prop="womanName" label="女生昵称" align="center"></el-table-column>

                <el-table-column label="背景封面" align="center">
                    <template v-slot="scope">
                        <el-image lazy :preview-src-list="[scope.row.bgCover]" class="table-td-thumb"
                            :src="scope.row.bgCover" fit="cover"></el-image>
                    </template>
                </el-table-column>
                <el-table-column label="男生头像" align="center">
                    <template v-slot="scope">
                        <el-image lazy :preview-src-list="[scope.row.manCover]" class="table-td-thumb"
                            :src="scope.row.manCover" fit="cover"></el-image>
                    </template>
                </el-table-column>
                <el-table-column label="女生头像" align="center">
                    <template v-slot="scope">
                        <el-image lazy :preview-src-list="[scope.row.womanCover]" class="table-td-thumb"
                            :src="scope.row.womanCover" fit="cover"></el-image>
                    </template>
                </el-table-column>

                <el-table-column label="状态" align="center">
                    <template v-slot="scope">
                        <el-tag :type="scope.row.status === false ? 'danger' : 'success'" disable-transitions>
                            {{ scope.row.status === false ? '禁用' : '启用' }}
                        </el-tag>
                        <el-switch @click="changeStatus(scope.row)" v-model="scope.row.status"></el-switch>
                    </template>
                </el-table-column>

                <el-table-column prop="timing" label="计时" align="center"></el-table-column>
                <el-table-column prop="countdownTitle" label="倒计时标题" align="center"></el-table-column>
                <el-table-column prop="countdownTime" label="倒计时时间" align="center"></el-table-column>
                <el-table-column prop="familyInfo" label="表白信" align="center" show-overflow-tooltip></el-table-column>
                <el-table-column prop="createTime" label="创建时间" align="center"></el-table-column>
                <el-table-column prop="updateTime" label="最终修改时间" align="center"></el-table-column>
                <el-table-column label="操作" width="180" align="center">
                    <template v-slot="scope">
                        <el-button text type="warning" class="btn-p5" :icon="Delete" @click="handleDelete(scope.row)">
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
    </div>
</template>

<script setup>
import { reactive, toRefs, inject } from 'vue';
import { ElMessage, ElMessageBox } from "element-plus";
import { Delete, Search } from '@element-plus/icons-vue';

// hooks
const common = inject("$common");
const constant = inject("$constant");
const http = inject("$http");

const data = reactive({
    pagination: {
        current: 1,
        size: 10,
        total: 0,
        status: null,
    },
    loves: []
});



const getLoves = () => {
    http.post(constant.baseURL + '/family/listFamily', data.pagination, true)
        .then((res) => {
            if (!common.isEmpty(res.data)) {
                data.loves = res.data.records;
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

getLoves();

const handleDelete = (item) => {
    ElMessageBox.confirm('确认删除资源？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'success',
        center: true,
    })
        .then(() => {
            http.get(constant.baseURL + '/family/deleteFamily', { id: item.id }, true)
                .then(() => {
                    data.pagination.current = 1;
                    getLoves();
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

const search = () => {
    data.pagination.total = 0;
    data.pagination.current = 1;
    getLoves();
};

const changeStatus = (item) => {
    http.get(constant.baseURL + '/family/changeLoveStatus', { id: item.id, flag: item.status }, true)
        .then(() => {
            ElMessage({
                message: '修改成功！',
                type: 'success',
            });
        })
        .catch((error) => {
            ElMessage({
                message: error.message,
                type: 'error',
            });
        });
};

const handlePageChange = (val) => {
    data.pagination.current = val;
    getLoves();
};

const { pagination, loves } = toRefs(data);

</script>

<style scoped>
.handle-box {
    margin-bottom: 20px;
}

.handle-box > span {
    font-size: 15px;
}

.handle-select {
    width: 200px;
}

.table {
    width: 100%;
    font-size: 14px;
}

.mrb10 {
    margin-right: 10px;
    margin-bottom: 10px;
}

.table-td-thumb {
    display: block;
    margin: auto;
    width: 40px;
    height: 40px;
}

.pagination {
    margin: 20px 0;
    text-align: right;
}

.el-switch {
    margin: 5px;
}
</style>
