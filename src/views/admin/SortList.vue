<template>
    <div>
        <div style="margin-bottom: 20px">
            <el-button type="primary" @click="sortDialog = true">新增分类</el-button>
        </div>
        <el-table :data="sortInfo" border class="table" header-cell-class-name="table-header">
            <el-table-column prop="id" label="ID" width="55" align="center"></el-table-column>
            <el-table-column prop="sortName" label="分类名称" align="center"></el-table-column>
            <el-table-column prop="sortDescription" label="分类描述" align="center"></el-table-column>
            <el-table-column label="分类类型" align="center">
                <template v-slot="scope">
                    <span v-if="scope.row.sortType === 0">导航栏分类</span>
                    <span v-else-if="scope.row.sortType === 1">普通分类</span>
                </template>
            </el-table-column>
            <el-table-column prop="priority" label="分类优先级" align="center"></el-table-column>
            <el-table-column prop="countOfSort" label="文章总数" align="center"></el-table-column>
            <el-table-column label="操作" width="380" align="center">
                <template v-slot="scope">
                    <el-button type="text" icon="el-icon-edit" @click="editSort(scope.row)">
                        编辑分类
                    </el-button>
                    <el-button type="text" icon="el-icon-edit" @click="sayLabel(scope.row)">
                        查看标签
                    </el-button>
                    <el-button type="text" icon="el-icon-edit" @click="insertLabel(scope.row)">
                        新增标签
                    </el-button>
                    <el-button type="text" icon="el-icon-delete" style="color: var(--orangeRed)"
                        @click="deleteHandle(scope.row.id, 1)">
                        删除
                    </el-button>
                </template>
            </el-table-column>
        </el-table>

        <el-table v-if="!common.isEmpty(sort)" :data="sort.labels" border class="table" style="margin-top: 40px"
            header-cell-class-name="table-header">
            <el-table-column prop="id" label="ID" width="55" align="center"></el-table-column>
            <el-table-column label="分类名称" align="center">
                <span>{{ sort.sortName }}</span>
            </el-table-column>
            <el-table-column prop="labelName" label="标签名称" align="center"></el-table-column>
            <el-table-column prop="labelDescription" label="标签描述" align="center"></el-table-column>
            <el-table-column prop="countOfLabel" label="文章总数" align="center"></el-table-column>
            <el-table-column label="操作" width="320" align="center">
                <template v-slot="scope">
                    <el-button type="text" icon="el-icon-edit" @click="editLabel(scope.row)">
                        编辑标签
                    </el-button>
                    <el-button type="text" icon="el-icon-delete" style="color: var(--orangeRed)"
                        @click="deleteHandle(scope.row.id, 2)">
                        删除
                    </el-button>
                </template>
            </el-table-column>
        </el-table>

        <el-dialog title="分类" v-model:visible="sortDialog" width="30%" :before-close="handleClose"
            :append-to-body="true" destroy-on-close center top="25vh">
            <div class="my-dialog">
                <div class="myCenter">
                    <el-radio-group v-model:value="sortForHttp.sortType">
                        <el-radio-button :value="0">导航栏分类</el-radio-button>
                        <el-radio-button :value="1">普通分类</el-radio-button>
                    </el-radio-group>
                </div>
                <el-input placeholder="请输入分类名称" v-model:value="sortForHttp.sortName">
                    <template v-slot:prepend>分类名称</template>
                </el-input>
                <el-input placeholder="请输入分类描述" v-model:value="sortForHttp.sortDescription">
                    <template v-slot:prepend>分类描述</template>
                </el-input>
                <el-input type="number" placeholder="请输入整数，数字小的在前面" v-model:value="sortForHttp.priority">
                    <template v-slot:prepend>分类优先级</template>
                </el-input>
            </div>

            <template v-slot:footer>
                <span class="dialog-footer">
                    <el-button @click="handleClose()">取 消</el-button>
                    <el-button type="primary" @click="saveSortEdit()">确 定</el-button>
                </span>
            </template>
        </el-dialog>

        <el-dialog title="标签" v-model:visible="labelDialog" width="30%" :before-close="handleClose"
            :append-to-body="true" destroy-on-close center top="25vh">
            <div class="my-dialog">
                <el-input placeholder="请输入标签名称" v-model:value="labelForHttp.labelName">
                    <template v-slot:prepend>标签名称</template>
                </el-input>
                <el-input placeholder="请输入标签描述" v-model:value="labelForHttp.labelDescription">
                    <template v-slot:prepend>标签描述</template>
                </el-input>
            </div>

            <template v-slot:footer>
                <span class="dialog-footer">
                    <el-button @click="handleClose()">取 消</el-button>
                    <el-button type="primary" @click="saveLabelEdit()">确 定</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script setup>
import { reactive, inject, toRefs } from 'vue';
import { ElMessage, ElMessageBox } from "element-plus";

// hooks
const common = inject("$common");
const constant = inject("$constant");
const http = inject("$http");

const data = reactive({
    sortDialog: false,
    labelDialog: false,
    sortInfo: [],
    sort: {},
    sortForHttp: {
        id: null,
        sortName: '',
        sortDescription: '',
        sortType: null,
        priority: null,
    },
    labelForHttp: {
        id: null,
        sortId: null,
        labelName: '',
        labelDescription: '',
    }
});

const getSortInfo = () => {
    http.get(constant.baseURL + '/webInfo/getSortInfo')
        .then((res) => {
            if (!common.isEmpty(res.data)) {
                data.sortInfo = res.data;
            }
        })
        .catch((error) => {
            ElMessage({
                message: error.message,
                type: 'error',
            });
        });
};

const deleteHandle = (id, flag) => {
    let url;
    if (flag === 1) {
        url = '/webInfo/deleteSort';
    } else if (flag === 2) {
        url = '/webInfo/deleteLabel';
    } else {
        return;
    }
    ElMessageBox.confirm('确认删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'success',
        center: true,
    })
        .then(() => {
            http.get(constant.baseURL + url, { id: id }, true)
                .then(() => {
                    ElMessage({
                        message: '删除成功！',
                        type: 'success',
                    });
                    getSortInfo();
                    data.sort = {}; // 修改 reactive 数据
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

const saveSortEdit = () => {
    if (
        common.isEmpty(data.sortForHttp.sortType) ||
        common.isEmpty(data.sortForHttp.priority) ||
        common.isEmpty(data.sortForHttp.sortName) ||
        common.isEmpty(data.sortForHttp.sortDescription)
    ) {
        ElMessage({
            message: '请完善所有分类信息！',
            type: 'error',
        });
        return;
    }

    let url;
    if (common.isEmpty(data.sortForHttp.id)) {
        url = '/webInfo/saveSort';
    } else {
        url = '/webInfo/updateSort';
    }
    http.post(constant.baseURL + url, data.sortForHttp, true)
        .then(() => {
            ElMessage({
                message: '保存成功！',
                type: 'success',
            });
            getSortInfo();
            handleClose();
        })
        .catch((error) => {
            ElMessage({
                message: error.message,
                type: 'error',
            });
        });
};

const saveLabelEdit = () => {
    if (common.isEmpty(data.labelForHttp.labelName) || common.isEmpty(data.labelForHttp.labelDescription)) {
        ElMessage({
            message: '请完善所有标签信息！',
            type: 'error',
        });
        return;
    }

    let url;
    if (common.isEmpty(data.labelForHttp.id)) {
        url = '/webInfo/saveLabel';
    } else {
        url = '/webInfo/updateLabel';
    }
    http.post(constant.baseURL + url, data.labelForHttp, true)
        .then(() => {
            ElMessage({
                message: '保存成功！',
                type: 'success',
            });
            getSortInfo();
            handleClose();
            data.sort = {}; // 修改 reactive 数据
        })
        .catch((error) => {
            ElMessage({
                message: error.message,
                type: 'error',
            });
        });
};

const editSort = (sortItem) => {
    data.sortDialog = true;
    data.sortForHttp.id = sortItem.id;
    data.sortForHttp.sortName = sortItem.sortName;
    data.sortForHttp.sortDescription = sortItem.sortDescription;
    data.sortForHttp.sortType = sortItem.sortType;
    data.sortForHttp.priority = sortItem.priority;
};

const editLabel = (label) => {
    data.labelDialog = true;
    data.labelForHttp.id = label.id;
    data.labelForHttp.sortId = label.sortId;
    data.labelForHttp.labelName = label.labelName;
    data.labelForHttp.labelDescription = label.labelDescription;
};

const insertLabel = (sortItem) => {
    data.labelForHttp.sortId = sortItem.id;
    data.labelDialog = true;
};

const handleClose = () => {
    data.labelForHttp = {
        id: null,
        sortId: null,
        labelName: '',
        labelDescription: '',
    };
    data.sortForHttp = {
        id: null,
        sortName: '',
        sortDescription: '',
        sortType: null,
        priority: null,
    };
    data.sortDialog = false;
    data.labelDialog = false;
};

const sayLabel = (sortItem) => {
    data.sort = sortItem;
};

// 初始化加载
getSortInfo();

const { sortDialog, labelDialog, sortInfo, sort, sortForHttp, labelForHttp } = toRefs(data);

</script>
<style scoped>
.my-dialog>div {
    margin: 12px;
}

.my-dialog>>>input::-webkit-inner-spin-button {
    appearance: none;
}
</style>
