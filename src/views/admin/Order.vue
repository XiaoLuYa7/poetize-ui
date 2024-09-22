<template>
    <div>
        <div>
            <div class="handle-box">
                <span>支付方式：</span>
                <el-select v-model="pagination.payType" filterable clearable placeholder="用户类型" style="width: 140px"
                    class="handle-select mr10">
                    <el-option key="1" label="支付宝" :value="1"></el-option>
                    <el-option key="2" label="微信" :value="2"></el-option>
                </el-select>
                <span style="margin-left: 10px;">商户订单号：</span>
                <el-input v-model="pagination.orderNo" placeholder="商户订单号" clearable
                    class="handle-input mr10"></el-input>
                <span style="margin-left: 10px;">交易订单号：</span>
                <el-input v-model="pagination.payOrderNo" placeholder="交易订单号" clearable
                    class="handle-input mr10"></el-input>
                <el-button type="primary" :icon="Search" @click="searchOrders()"
                    style="margin-left: 10px">搜索</el-button>
                <el-button type="danger" @click="clearSearch()">清除参数</el-button>
            </div>
            <el-table :data="orders" empty-text="数据都找不到啦" border class="table" header-cell-class-name="table-header">
                <el-table-column prop="orderNo" label="商户订单号" align="center"></el-table-column>
                <el-table-column prop="username" label="用户名" align="center"></el-table-column>
                <el-table-column prop="articleTitle" label="文章标题" align="center"></el-table-column>
                <el-table-column label="支付方式" align="center">
                    <template v-slot="scope">
                        <el-tag v-if="scope.row.payType === 1" type="primary" disable-transitions>
                            支付宝
                        </el-tag>
                        <el-tag v-if="scope.row.payType === 2" type="success" disable-transitions>
                            微信
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="payOrderNo" label="交易订单号" align="center"></el-table-column>
                <el-table-column label="支付凭证" align="center">
                    <template v-slot="scope">
                        <el-image lazy class="table-td-thumb" :src="scope.row.payPicture" fit="cover"></el-image>
                    </template>
                </el-table-column>
                <el-table-column label="审核状态" align="center">
                    <template v-slot="scope">
                        <el-tag type="info" style="cursor: pointer;" @click="showCheckOrderDialog(scope.row)" v-if="scope.row.checked === 0"
                            disable-transitions>
                            待审核
                        </el-tag>
                        <el-tag type="success" v-else-if="scope.row.checked === 1" disable-transitions>
                            通过
                        </el-tag>
                        <el-tag type="danger" v-else-if="scope.row.checked === -1" disable-transitions> 不通过 </el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="checkDesc" label="审核备注" align="center"></el-table-column>
                <el-table-column prop="checkTime" label="审核时间" align="center"></el-table-column>
                <el-table-column prop="createTime" label="下单时间" align="center"></el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination background layout="total, prev, pager, next" :current-page="pagination.current"
                    :page-size="pagination.size" :total="pagination.total" @current-change="handlePageChange">
                </el-pagination>
            </div>
        </div>

        <!-- 编辑弹出框 -->
        <el-dialog draggable title="审核订单" v-model="checkOrderDialog" width="30%" :before-close="handleClose"
            :append-to-body="true" destroy-on-close show-close="false" center top="25vh">
            <div class="order-info">

                <div>
                    交易单号：
                    <el-input v-model="checkOrder.payOrderNo" disabled style="width: 300px;" class="order-input"></el-input>
                </div>
                <div style="display: flex;align-items: center; margin: 10px 5px;">
                    支付凭证：
                    <el-image class="my-el-image" style="width: 200px;height: 200px;border-radius: 5px;"
                        :src="checkOrder.payPicture" :preview-src-list="checkdPicture" :zoom-rate="1.2" :max-scale="7"
                        :min-scale="0.2" fit="cover">
                        <template v-slot:error>
                            <div class="image-slot myCenter" style="background-color: var(--lightGreen)">
                                <div class="error-text">
                                    <div>遇事不决，可问春风</div>
                                </div>
                            </div>
                        </template>
                    </el-image>
                </div>

                <div>
                    审核结果：
                    <el-radio-group v-model="checked">
                        <el-radio-button :value="1">审核通过</el-radio-button>
                        <el-radio-button :value="-1">审核不通过</el-radio-button>
                    </el-radio-group>
                </div>

                <div style="margin-top: 10px;" class="myCenter">
                    审核备注：
                    <el-input v-model="checkDesc" :autosize="{ minRows: 3 }" style="width: 300px;" type="textarea"></el-input>
                </div>

            </div>

            <template v-slot:footer>
                <span class="dialog-footer">
                    <el-button @click="handleClose()">取 消</el-button>
                    <el-button type="primary" @click="updateOrderStatus()">确 定</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script setup>
import { reactive, inject, toRefs } from 'vue';
import { useStore } from "vuex";
import { ElMessage, ElMessageBox } from "element-plus";
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
        orderNo: '',
        payOrderNo: '',
        payType: ''
    },
    orders: [],
    checkOrderDialog: false,
    checkOrder: {},
    checked: -1,
    checkdPicture: [],
    checkDesc: ''
});

const getOrders = () => {
    http.post(constant.baseURL + '/workOrder/admin/listOrder', data.pagination, true)
        .then((res) => {
            if (!common.isEmpty(res.data)) {
                data.orders = res.data.records;
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
        orderNo: '',
        payOrderNo: '',
        payType: ''
    };
    getOrders();
};

const handlePageChange = (val) => {
    data.pagination.current = val;
    getOrders();
};

const searchOrders = () => {
    data.pagination.total = 0;
    data.pagination.current = 1;
    getOrders();
}

const showCheckOrderDialog = (row) => {
    data.checkOrderDialog = true;
    data.checkOrder = row;
    data.checkdPicture.push(row.payPicture)
}

const handleClose = () => {
    data.checkOrderDialog = false;
    data.checkOrder = {};
    data.checkdPicture = [];
}

const updateOrderStatus = (order) => {
    let tips = '';
    if (data.checked === -1) {
        tips = '不通过';
    }
    if (data.checked === 1) {
        tips = '通过';
    }
    ElMessageBox.confirm('确认将该订单审核' + tips + '？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true,
    }).then(() => {
        let param = {};
        param.id = data.checkOrder.id;
        param.checked = data.checked;
        param.checkDesc = data.checkDesc;
        http.post(constant.baseURL + '/workOrder/admin/updateOrderStatus', param, true,false)
            .then((res) => {
                ElMessage({
                    message: '审核操作成功',
                    type: 'success',
                });
                handleClose();
                getOrders();
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
                message: '继续审核',
                type: 'success'
            })
        })
}

// 初始化加载
getOrders();

const { pagination, orders, checkOrderDialog, checkOrder, checked, checkdPicture,checkDesc } = toRefs(data);

</script>

<style>

.el-input.is-disabled.order-input .el-input__inner {
    -webkit-text-fill-color: red;
}
</style>

<style scoped>
.handle-box {
    margin-bottom: 30px;
}

.handle-box>span {
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


.order-info {
    display: flex;
    flex-direction: column;
    align-items: start;
    justify-content: center;
}
</style>
