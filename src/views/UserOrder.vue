<template>
    <div class="order-container">
        <div class="handle-box">
            <span>支付方式：</span>
            <el-select v-model="pagination.payType" filterable clearable placeholder="用户类型" style="width: 140px" class="handle-select mr10">
                <el-option key="1" label="支付宝" :value="1"></el-option>
                <el-option key="2" label="微信" :value="2"></el-option>
            </el-select>
            <span style="margin-left: 10px;">商户订单号：</span>
            <el-input v-model="pagination.orderNo" placeholder="商户订单号" clearable class="handle-input mr10"></el-input>
            <span style="margin-left: 10px;">交易订单号：</span>
            <el-input v-model="pagination.payOrderNo" placeholder="交易订单号" clearable class="handle-input mr10"></el-input>
            <el-button type="primary" :icon="Search" @click="searchUserOrders()"
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
                    <el-tag type="info" v-if="scope.row.checked === 0" disable-transitions>
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
            <el-pagination background layout="total, prev, pager, next"
                :current-page="pagination.current" :page-size="pagination.size" :total="pagination.total"
                @current-change="handlePageChange">
            </el-pagination>
        </div>
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
        userId: common.isEmpty(store.state.currentUser) ? '' : store.state.currentUser.id,
        orderNo: '',
        payOrderNo: '',
        payType: ''
    },
    orders: []
});

const getUserOrders = () => {
    http.post(constant.baseURL + '/workOrder/listUserOrder', data.pagination, false)
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
        userId: common.isEmpty(store.state.currentUser)? '' : store.state.currentUser.id,
        orderNo: '',
        payOrderNo: '',
        payType:''
    };
    getUserOrders();
};


const handlePageChange = (val) => {
    data.pagination.current = val;
    getUserOrders();
};

const searchUserOrders = () => {
    data.pagination.total = 0;
    data.pagination.current = 1;
    getUserOrders();
};

// 初始化加载
getUserOrders();

const { pagination, orders } = toRefs(data);

</script>

<style>

.table.el-table .el-table__cell {
    padding: 14px 0;
    min-width: 0;
    box-sizing: border-box;
    text-overflow: ellipsis;
    vertical-align: middle;
    position: relative;
    text-align: center;
}
</style>
<style scoped>
.order-container {
    padding: 100px 20px 20px 20px;
    background: #eaedf3;
    min-height: 100vh;
}

.order-container .handle-box , .table{
    border-radius: 12px;
    box-shadow: 0 0 .375rem .25rem rgba(161, 172, 184, .15);
}


.handle-box {
    margin: 0px 30px 30px 0px;
    width: 100%;
    padding: 40px;
    background-color: #fff;
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
</style>
