<template>
    <div>
        <div>
            <div class="handle-box">
                <span>资源聚合类型：</span>
                <el-select clearable v-model="pagination.resourceType" popper-class="custom-popper" filterable placeholder="资源聚合类型"
                    class="handle-select" style="margin-right: 10px">
                    <el-option v-for="(item, i) in resourceTypes" :key="i" :label="item.label" :value="item.value">
                    </el-option>
                </el-select>
                <span style="margin-left: 15px">状态：</span>
                <el-select clearable v-model="pagination.status" placeholder="状态" popper-class="custom-popper" filterable class="handle-select" style="margin-right: 10px">
                    <el-option key="1" label="启用" :value="true"></el-option>
                    <el-option key="2" label="禁用" :value="false"></el-option>
                </el-select>
                <el-button type="primary" :icon="Search" @click="search()" style="margin-left: 15px">搜索</el-button>
                <el-button type="success" @click="addResourcePathDialog = true">新增资源聚合</el-button>
            </div>
            <el-table :data="resourcePaths" border class="table" header-cell-class-name="table-header">
                <el-table-column prop="id" label="ID" width="55" align="center"></el-table-column>
                <el-table-column prop="title" label="标题" align="center"></el-table-column>
                <el-table-column prop="classify" label="分类" align="center"></el-table-column>
                <el-table-column prop="introduction" label="简介" align="center"></el-table-column>
                <el-table-column label="封面" align="center">
                    <template v-slot="scope">
                        <el-image lazy :preview-src-list="[scope.row.cover]" class="table-td-thumb"
                            :src="scope.row.cover" fit="cover"></el-image>
                    </template>
                </el-table-column>
                <el-table-column prop="url" label="链接" align="center"></el-table-column>

                <el-table-column prop="type" label="资源类型" align="center"></el-table-column>
                <el-table-column label="状态" align="center">
                    <template v-slot="scope">
                        <el-tag :type="scope.row.status === false ? 'danger' : 'success'" disable-transitions>
                            {{ scope.row.status === false ? '禁用' : '启用' }}
                        </el-tag>
                        <el-switch @click="changeStatus(scope.row)" v-model="scope.row.status"></el-switch>
                    </template>
                </el-table-column>

                <el-table-column prop="remark" label="备注" align="center"></el-table-column>
                <el-table-column prop="createTime" label="创建时间" align="center"></el-table-column>
                <el-table-column label="操作" width="180" align="center">
                    <template v-slot="scope">
                        <el-button text :icon="EditPen" type="primary" class="btn-p5" @click="handleEdit(scope.row)">编辑</el-button>
                        <el-button text :icon="Delete" type="warning" class="btn-p5" @click="handleDelete(scope.row)">
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

        <el-dialog title="图片" v-model="coverDialog" width="25%" :append-to-body="true"
            :close-on-click-modal="false" destroy-on-close center top="25vh">
            <div>
                <UploadPicture :isAdmin="true" :prefix="resourcePath.type + 'Cover'" @addPicture="addPicture"
                    :maxSize="2" :maxNumber="1"></UploadPicture>
            </div>
        </el-dialog>

        <el-dialog title="文件" v-model="uploadDialog" width="25%" :append-to-body="true"
            :close-on-click-modal="false" destroy-on-close center top="25vh">
            <div>
                <UploadPicture :isAdmin="true" :prefix="resourcePath.type + 'Url'" @addPicture="addFile" :maxSize="10"
                    :maxNumber="1" :listType="'text'" :accept="'image/*, video/*, audio/*'"></UploadPicture>
            </div>
        </el-dialog>

        <el-dialog title="资源聚合" v-model="addResourcePathDialog" width="40%" :before-close="clearDialog"
            :append-to-body="true" :close-on-click-modal="false" center top="25vh">
            <div>
                <div>
                    <div class="myCenter" style="margin-bottom: 12px">
                        <el-radio-group v-model="resourcePath.type">
                            <el-radio-button v-for="(item, index) in resourceTypes" :key="index" :value="item.value">{{
                                item.label }}</el-radio-button>
                        </el-radio-group>
                    </div>

                    <div>
                        <div style="margin-bottom: 5px">标题：</div>
                        <el-input maxlength="60" v-model="resourcePath.title"></el-input>
                    </div>

                    <!-- 日后打算做下拉的 -->
                    <div>
                        <div style="margin-top: 10px; margin-bottom: 5px">分类：</div>
                        <el-input maxlength="30" v-model="resourcePath.classify"></el-input>
                    </div>

                    <div v-show="['favorites'].includes(resourcePath.type)">
                        <div style="margin-top: 10px; margin-bottom: 5px">简介：</div>
                        <el-input :disabled="!['favorites'].includes(resourcePath.type)" maxlength="1000"
                            v-model="resourcePath.introduction"></el-input>
                    </div>

                    <div>
                        <div style="margin-top: 10px; margin-bottom: 5px">封面：</div>
                        <div style="display: flex">
                            <el-input v-model="resourcePath.cover"></el-input>
                            <div style="width: 66px; margin: 3.5px 0 0 10px">
                                <ProButton :info="'上传封面'" @click="addResourcePathCover()"
                                    :before="constant.before_color_1" :after="constant.after_color_1">
                                </ProButton>
                            </div>
                        </div>
                    </div>

                    <div v-show="['favorites'].includes(resourcePath.type)">
                        <div style="margin-top: 10px; margin-bottom: 5px">链接：</div>
                        <div style="display: flex">
                            <el-input :disabled="!['favorites'].includes(resourcePath.type)"
                                v-model="resourcePath.url"></el-input>
                            <div style="width: 66px; margin: 3.5px 0 0 10px" v-show="!['lovePhoto', 'albums', 'favorites'].includes(
                                resourcePath.type
                            )
                                ">
                                <ProButton :info="'上传文件'" @click="addResourcePathUrl()"
                                    :before="constant.before_color_1" :after="constant.after_color_1">
                                </ProButton>
                            </div>
                        </div>
                    </div>

                    <div>
                        <div style="margin-top: 10px; margin-bottom: 5px">备注：</div>
                        <el-input :disabled="!['lovePhoto', 'albums', 'favorites'].includes(
                            resourcePath.type
                        )
                            " maxlength="1000" v-model="resourcePath.remark" type="textarea"></el-input>
                    </div>
                </div>
                <div style="display: flex; margin-top: 30px" class="myCenter">
                    <ProButton :info="'提交'" @click="addResourcePath()" :before="constant.before_color_2"
                        :after="constant.after_color_2">
                    </ProButton>
                </div>
            </div>
        </el-dialog>
    </div>
</template>

<script setup>
import UploadPicture from '../../components/common/UploadPicture.vue'
import ProButton from '../../components/common/ProButton.vue'
import { reactive, inject, toRefs } from 'vue';
import { ElMessage, ElMessageBox } from "element-plus";
import { Delete, EditPen, Search } from '@element-plus/icons-vue';

// hooks
const common = inject("$common");
const constant = inject("$constant");
const http = inject("$http");

const data = reactive({
    resourceTypes: [
        { label: '时光相册', value: 'lovePhoto' },
        { label: '相册集', value: 'albums' },
        { label: '收藏夹', value: 'favorites' },
    ],
    pagination: {
        current: 1,
        size: 10,
        total: 0,
        resourceType: '',
        status: null,
    },
    resourcePaths: [],
    coverDialog: false,
    uploadDialog: false,
    addResourcePathDialog: false,
    isUpdate: false,
    resourcePath: {
        title: '',
        classify: '',
        introduction: '',
        cover: '',
        url: '',
        type: 'lovePhoto',
        remark: ''
    }
});

const getResourcePaths = () => {
    http.post(constant.baseURL + '/webInfo/listResourcePath', data.pagination, true)
        .then((res) => {
            if (!common.isEmpty(res.data)) {
                data.resourcePaths = res.data.records;
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

const addPicture = (res) => {
    data.resourcePath.cover = res;
    data.coverDialog = false;
};

const addFile = (res) => {
    data.resourcePath.url = res;
    data.uploadDialog = false;
};

const addResourcePathUrl = () => {
    if (!data.addResourcePathDialog) {
        return;
    }
    data.uploadDialog = true;
};

const addResourcePathCover = () => {
    if (!data.addResourcePathDialog) {
        return;
    }
    if (common.isEmpty(data.resourcePath.type)) {
        ElMessage({
            message: '请选择资源类型！',
            type: 'error',
        });
        return;
    }
    data.coverDialog = true;
};

const addResourcePath = async () => {
    if (common.isEmpty(data.resourcePath.type)) {
        ElMessage({
            message: '请选择资源类型！',
            type: 'error',
        });
        return;
    }
    if (common.isEmpty(data.resourcePath.title)) {
        ElMessage({
            message: '标题不能为空！',
            type: 'error',
        });
        return;
    }
    if (common.isEmpty(data.resourcePath.classify)) {
        ElMessage({
            message: '分类不能为空！',
            type: 'error',
        });
        return;
    }
    if (common.isEmpty(data.resourcePath.cover)) {
        ElMessage({
            message: '封面不能为空！',
            type: 'error',
        });
        return;
    }

    if (data.resourcePath.type === 'favorites') {
        if (common.isEmpty(data.resourcePath.introduction)) {
            ElMessage({
                message: '简介不能为空！',
                type: 'error',
            });
            return;
        }
        if (common.isEmpty(data.resourcePath.url)) {
            ElMessage({
                message: '链接不能为空！',
                type: 'error',
            });
            return;
        }
    }

    const coverResult = await common.checkLink(data.resourcePath.cover);
    if (!coverResult.status) {
        ElMessage({
            message: '封面：' + coverResult.message,
            type: 'error',
        });
        return;
    }
    if (data.resourcePath.type === 'favorites') {
        const urlResult = await common.checkLink(data.resourcePath.url);
        if (!urlResult.status) {
            ElMessage({
                message: '链接：' + urlResult.message,
                type: 'error',
            });
            return;
        }
    }
    http.post(constant.baseURL + '/webInfo/' + (data.isUpdate ? 'updateResourcePath' : 'saveResourcePath'), data.resourcePath, true)
        .then(() => {
            ElMessage({
                message: '保存成功！',
                type: 'success',
            });
            data.addResourcePathDialog = false;
            clearDialog();
            search();
        })
        .catch((error) => {
            ElMessage({
                message: error.message,
                type: 'error',
            });
        });
};

const search = () => {
    data.pagination.total = 0;
    data.pagination.current = 1;
    getResourcePaths();
};

const changeStatus = (item) => {
    http.post(constant.baseURL + '/webInfo/updateResourcePath', item, true)
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
    getResourcePaths();
};

const handleDelete = (item) => {
    ElMessageBox.confirm('确认删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'success',
        center: true,
    })
        .then(() => {
            http.get(constant.baseURL + '/webInfo/deleteResourcePath', { id: item.id }, true)
                .then(() => {
                    search();
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

const handleEdit = (item) => {
    data.resourcePath = JSON.parse(JSON.stringify(item));
    data.addResourcePathDialog = true;
    data.isUpdate = true;
};

const clearDialog = () => {
    data.isUpdate = false;
    data.addResourcePathDialog = false;
    data.resourcePath = {
        title: '',
        classify: '',
        introduction: '',
        cover: '',
        url: '',
        type: 'lovePhoto',
        remark: ''
    };
};

// 初始化加载
getResourcePaths();

const { resourceTypes, pagination, resourcePaths, coverDialog, uploadDialog, addResourcePathDialog, isUpdate, resourcePath } = toRefs(data);

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
