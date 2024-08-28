<template>
    <div>
        <div>
            <div class="handle-box">
                <span>用户类型：</span>
                <el-select popper-class="custom-popper" v-model="pagination.userType" filterable clearable placeholder="用户类型" style="width: 140px" class="handle-select mr10">
                    <el-option key="1" label="站长" :value="0"></el-option>
                    <el-option key="2" label="管理员" :value="1"></el-option>
                    <el-option key="3" label="普通用户" :value="2"></el-option>
                </el-select>
                <span style="margin-left: 10px">用户状态：</span>
                <el-select popper-class="custom-popper" v-model="pagination.userStatus" filterable clearable placeholder="用户状态" style="width: 140px" class="handle-select mr10">
                    <el-option key="1" label="启用" :value="true"></el-option>
                    <el-option key="2" label="禁用" :value="false"></el-option>
                </el-select>
                <span style="margin-left: 10px">用户名/手机号/邮箱：</span>
                <el-input v-model="pagination.searchKey" placeholder="用户名/手机号/邮箱" class="handle-input mr10"></el-input>
                <el-button type="primary" :icon="Search" @click="searchUser()" style="margin-left: 10px">搜索</el-button>
                <el-button type="danger" @click="clearSearch()">清除参数</el-button>
            </div>
            <el-table :data="users" empty-text="数据都找不到啦" border class="table" header-cell-class-name="table-header">
                <el-table-column prop="id" label="ID" width="55" align="center"></el-table-column>
                <el-table-column prop="username" label="用户名" align="center"></el-table-column>
                <el-table-column prop="email" label="邮箱" align="center"></el-table-column>
                <el-table-column label="用户状态" align="center">
                    <template v-slot="scope">
                        <el-tag :type="scope.row.userStatus === false ? 'danger' : 'success'" disable-transitions>
                            {{ scope.row.userStatus === false ? '禁用' : '启用' }}
                        </el-tag>
                        <el-switch v-if="scope.row.id !== store.state.currentAdmin.id"
                            @click="changeUserStatus(scope.row)" v-model="scope.row.userStatus"></el-switch>
                    </template>
                </el-table-column>
                <el-table-column label="头像" align="center">
                    <template v-slot="scope">
                        <el-image lazy class="table-td-thumb" :src="scope.row.avatar" fit="cover"></el-image>
                    </template>
                </el-table-column>
                <el-table-column label="性别" align="center">
                    <template v-slot="scope">
                        <el-tag type="success" v-if="scope.row.gender === 1" disable-transitions>
                            男
                        </el-tag>
                        <el-tag type="success" v-else-if="scope.row.gender === 2" disable-transitions>
                            女
                        </el-tag>
                        <el-tag type="success" v-else disable-transitions> 保密 </el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="introduction" label="简介" align="center"></el-table-column>
                <el-table-column label="用户类型" width="100" align="center">
                    <template v-slot="scope">
                        <el-tag type="success" v-if="scope.row.userType === 0" disable-transitions>
                            站长
                        </el-tag>
                        <el-tag type="success" v-else-if="scope.row.userType === 1" style="cursor: pointer"
                            @click="editUser(scope.row)" disable-transitions>
                            管理员
                        </el-tag>
                        <el-tag type="success" v-else style="cursor: pointer" @click="editUser(scope.row)"
                            disable-transitions>
                            普通用户
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="createTime" label="注册时间" align="center"></el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination :hide-on-single-page="true" background layout="total, prev, pager, next" :current-page="pagination.current"
                    :page-size="pagination.size" :total="pagination.total" @current-change="handlePageChange">
                </el-pagination>
            </div>
        </div>

        <!-- 编辑弹出框 -->
        <el-dialog title="修改用户类型" v-model="editVisible" width="30%" :before-close="handleClose" :append-to-body="true"
            destroy-on-close center top="25vh">
            <div class="myCenter">
                <el-radio-group v-model="changeUser.userType">
                    <el-radio-button :value="1">管理员</el-radio-button>
                    <el-radio-button :value="2">普通用户</el-radio-button>
                </el-radio-group>
            </div>

            <template v-slot:footer>
                <span class="dialog-footer">
                    <el-button @click="handleClose()">取 消</el-button>
                    <el-button type="primary" @click="saveEdit()">确 定</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script setup>
import { reactive, inject, toRefs } from 'vue';
import { useStore } from "vuex";
import { ElMessage } from "element-plus";
import { Search } from '@element-plus/icons-vue';

// hooks
const common = inject("$common");
const constant = inject("$constant");
const http = inject("$http");

const store = useStore();

const data = reactive({
    pagination: {
        current: 1,
        size: 10,
        total: 0,
        searchKey: '',
        userStatus: null,
        userType: null,
    },
    users: [],
    changeUser: {
        id: null,
        userType: null,
    },
    editVisible: false
});

const getUsers = () => {
    http.post(constant.baseURL + '/admin/user/list', data.pagination, true)
        .then((res) => {
            if (!common.isEmpty(res.data)) {
                data.users = res.data.records;
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

const clearSearch = () => {
    data.pagination = {
        current: 1,
        size: 10,
        total: 0,
        searchKey: '',
        userStatus: null,
        userType: null,
    };
    getUsers();
};

const changeUserStatus = (user) => {
    http.get(constant.baseURL + '/admin/user/changeUserStatus', {
        userId: user.id,
        flag: user.userStatus,
    }, true)
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

const editUser = (user) => {
    data.changeUser.id = user.id;
    data.changeUser.userType = user.userType;
    data.editVisible = true;
};

const handlePageChange = (val) => {
    data.pagination.current = val;
    getUsers();
};

const searchUser = () => {
    data.pagination.total = 0;
    data.pagination.current = 1;
    getUsers();
};

const handleClose = () => {
    data.changeUser = {
        id: null,
        userType: null,
    };
    data.editVisible = false;
};

const saveEdit = () => {
    http.get(constant.baseURL + '/admin/user/changeUserType', {
        userId: data.changeUser.id,
        userType: data.changeUser.userType
    }, true)
        .then(() => {
            handleClose();
            getUsers();
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

// 初始化加载
getUsers();

const { pagination, users, changeUser, editVisible } = toRefs(data);

</script>

<style scoped>
.handle-box {
    margin-bottom: 30px;
}

.handle-box > span {
    font-size: 15px;
}

.handle-select {
    width: 120px;
}

.handle-input {
    width: 160px;
    display: inline-block;
}

.table {
    width: 100%;
    font-size: 14px;
}

.mr10 {
    margin-right: 10px;
}

.mb10 {
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
