import { ElMessage, ElMessageBox } from "element-plus";

import { reactive, inject } from 'vue';

export default function () {
    const http = inject("$http")
    const constant = inject("$constant")
    const common = inject("$common")

    let friendCircleData = reactive({
        showFriendCircle: false,
        treeHoleList: [],
        weiYanDialogVisible: false,
        isPublic: true,
        weiYanAvatar: '',
        weiYanUsername: '',
        pagination: {
            current: 1,
            size: 10,
            total: 0,
            userId: null,
            classify: 'friend'
        }
    })

    function launch() {
        friendCircleData.weiYanDialogVisible = true;
    }

    function openFriendCircle(userId, avatar, username) {
        friendCircleData.pagination.userId = userId;
        friendCircleData.weiYanAvatar = avatar;
        friendCircleData.weiYanUsername = username;
        getWeiYan();
    }

    function deleteTreeHole(id) {
        ElMessageBox.confirm('确定删除?', '警告', {
            confirmButtonText: '确定',
            type: 'warning'
        }).then(() => {
            http.get(constant.baseURL + "/weiYan/deleteWeiYan", {
                id: id
            })
                .then((res) => {
                    ElMessage({
                        message: "删除成功！",
                        type: 'success'
                    });
                    friendCircleData.pagination.current = 1;
                    friendCircleData.pagination.size = 10;
                    friendCircleData.treeHoleList = [];
                    getWeiYan();
                })
                .catch((error) => {
                    ElMessage({
                        message: error.message,
                        type: 'error'
                    });
                });
        }).catch(() => { });
    }

    function getWeiYan() {
        http.post(constant.baseURL + "/weiYan/listWeiYan", friendCircleData.pagination)
            .then((res) => {
                if (!common.isEmpty(res.data)) {
                    res.data.records.forEach(c => {
                        c.content = c.content.replace(/\n{2,}/g, '<div style="height: 12px"></div>');
                        c.content = c.content.replace(/\n/g, '<br/>');
                        c.content = common.faceReg(c.content);
                        c.content = common.pictureReg(c.content);
                    });
                    friendCircleData.treeHoleList = friendCircleData.treeHoleList.concat(res.data.records);
                    friendCircleData.pagination.total = res.data.total;
                    friendCircleData.showFriendCircle = true;
                }
            })
            .catch((error) => {
                ElMessage({
                    message: error.message,
                    type: 'error'
                });
            });
    }

    function submitWeiYan(content) {
        let weiYan = {
            content: content,
            isPublic: friendCircleData.isPublic
        };

        http.post(constant.baseURL + "/weiYan/saveWeiYan", weiYan)
            .then((res) => {
                friendCircleData.pagination.current = 1;
                friendCircleData.pagination.size = 10;
                friendCircleData.treeHoleList = [];
                closeWeiYanDialog()
                getWeiYan();
            })
            .catch((error) => {
                ElMessage({
                    message: error.message,
                    type: 'error'
                });
            });
    }

    function closeWeiYanDialog() {
        friendCircleData.weiYanDialogVisible = false;
    }

    function cleanFriendCircle() {
        friendCircleData.pagination = {
            current: 1,
            size: 10,
            total: 0,
            userId: null,
            classify: 'friend'
        };
        friendCircleData.weiYanAvatar = '';
        friendCircleData.weiYanUsername = '';
        friendCircleData.treeHoleList = [];
        friendCircleData.showFriendCircle = false;
    }

    function pageWeiYan() {
        friendCircleData.pagination.current = friendCircleData.pagination.current + 1;
        getWeiYan();
    }

    function addFriend() {
        ElMessageBox.confirm('确认提交好友申请，添加 ' + friendCircleData.weiYanUsername + ' 为好友？', '好友申请', {
            type: 'success',
            confirmButtonText: '确定',
        }).then(() => {
            http.get(constant.baseURL + "/imChatUserFriend/addFriend", {
                friendId: friendCircleData.pagination.userId
            })
                .then((res) => {
                    ElMessage({
                        message: "提交成功！",
                        type: 'success'
                    });
                })
                .catch((error) => {
                    ElMessage({
                        message: error.message,
                        type: 'error'
                    });
                });
        }).catch(() => { });
    }

    return {
        friendCircleData,
        launch,
        openFriendCircle,
        deleteTreeHole,
        submitWeiYan,
        pageWeiYan,
        cleanFriendCircle,
        addFriend,
        closeWeiYanDialog
    }
}
