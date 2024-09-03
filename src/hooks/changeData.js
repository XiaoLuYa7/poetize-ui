import {useStore} from 'vuex';

import {ElMessage} from "element-plus";

import {reactive, inject} from 'vue';

export default function (friendData, groupData) {
    const http = inject("$http")
    const constant = inject("$constant")
    const common = inject("$common")
    const store = useStore();

    let changeDataData = reactive({
        //修改信息
        changeDataInfo: '',
        changeType: null,
        changeModal: false,

        avatarType: null,
        avatarPrefix: '',
        showAvatarDialog: false
    })

    function closeModal() {
        changeDataData.avatarType = null;
        changeDataData.avatarPrefix = '';

        changeDataData.changeDataInfo = '';
        changeDataData.changeType = null;
    }

    function changeAvatar(type) {
        if (type === 1 || (type === 2 && groupData.groups[groupData.currentGroupId].masterFlag)) {
            closeModal();
            changeDataData.showAvatarDialog = true;
            changeDataData.avatarType = type;
            if (type === 1) {
                changeDataData.avatarPrefix = 'userAvatar';
            } else if (type === 2) {
                changeDataData.avatarPrefix = 'im/groupAvatar';
            }
        }
    }

    function changeDataType(type) {
        closeModal();
        changeDataData.changeType = type;
        changeDataData.changeModal = true;
    }

    function submitAvatar(avatar) {
        if (common.isEmpty(avatar)) {
            ElMessage({
                message: "请上传头像！",
                type: 'warning'
            });
            return;
        }
        if (changeDataData.avatarType === 1) {
            let user = {
                avatar: avatar
            };
            http.post(constant.baseURL + "/user/updateUserInfo", user)
                .then((res) => {
                    if (!common.isEmpty(res.data)) {
                        ElMessage({
                            message: "修改成功！",
                            type: 'success'
                        });
                        store.commit("loadCurrentUser", res.data);
                        closeModal();
                        changeDataData.showAvatarDialog = false;
                    }
                })
                .catch((error) => {
                    ElMessage({
                        message: error.message,
                        type: 'error'
                    });
                });
        } else if (changeDataData.avatarType === 2) {
            http.post(constant.baseURL + "/imChatGroup/updateGroup", {
                id: groupData.currentGroupId,
                avatar: avatar
            })
                .then((res) => {
                    ElMessage({
                        message: "修改成功！",
                        type: 'success'
                    });
                    groupData.groups[groupData.currentGroupId].avatar = avatar;
                    closeModal();
                    changeDataData.showAvatarDialog = false;
                })
                .catch((error) => {
                    ElMessage({
                        message: error.message,
                        type: 'error'
                    });
                });
        }
    }

    function submitChange() {
        if (changeDataData.changeType === 1) {
            if (common.isEmpty(changeDataData.changeDataInfo)) {
                ElMessage({
                    message: "请输入备注！",
                    type: 'warning'
                });
                return;
            }
            http.get(constant.baseURL + "/imChatUserFriend/changeFriend", {
                friendId: friendData.currentFriendId,
                remark: changeDataData.changeDataInfo
            })
                .then((res) => {
                    ElMessage({
                        message: "修改成功！",
                        type: 'success'
                    });
                    friendData.friends[friendData.currentFriendId].remark = changeDataData.changeDataInfo;
                    closeModal();
                    changeDataData.changeModal = false;
                })
                .catch((error) => {
                    ElMessage({
                        message: error.message,
                        type: 'error'
                    });
                });
        } else if (changeDataData.changeType === 2) {
            if (common.isEmpty(changeDataData.changeDataInfo)) {
                ElMessage({
                    message: "请输入群名称！",
                    type: 'warning'
                });
                return;
            }
            http.post(constant.baseURL + "/imChatGroup/updateGroup", {
                id: groupData.currentGroupId,
                groupName: changeDataData.changeDataInfo
            })
                .then((res) => {
                    ElMessage({
                        message: "修改成功！",
                        type: 'success'
                    });
                    groupData.groups[groupData.currentGroupId].groupName = changeDataData.changeDataInfo;
                    closeModal();
                    changeDataData.changeModal = false;
                })
                .catch((error) => {
                    ElMessage({
                        message: error.message,
                        type: 'error'
                    });
                });
        } else if (changeDataData.changeType === 3) {
            if (common.isEmpty(changeDataData.changeDataInfo)) {
                ElMessage({
                    message: "请输入群公告！",
                    type: 'warning'
                });
                return;
            }
            http.post(constant.baseURL + "/imChatGroup/updateGroup", {
                id: groupData.currentGroupId,
                notice: changeDataData.changeDataInfo
            })
                .then((res) => {
                    ElMessage({
                        message: "修改成功！",
                        type: 'success'
                    });
                    groupData.groups[groupData.currentGroupId].notice = changeDataData.changeDataInfo;
                    closeModal();
                    changeDataData.changeModal = false;
                })
                .catch((error) => {
                    ElMessage({
                        message: error.message,
                        type: 'error'
                    });
                });
        } else if (changeDataData.changeType === 4) {
            if (common.isEmpty(changeDataData.changeDataInfo)) {
                ElMessage({
                    message: "请输入群简介！",
                    type: 'warning'
                });
                return;
            }
            http.post(constant.baseURL + "/imChatGroup/updateGroup", {
                id: groupData.currentGroupId,
                introduction: changeDataData.changeDataInfo
            })
                .then((res) => {
                    ElMessage({
                        message: "修改成功！",
                        type: 'success'
                    });
                    groupData.groups[groupData.currentGroupId].introduction = changeDataData.changeDataInfo;
                    closeModal();
                    changeDataData.changeModal = false;
                })
                .catch((error) => {
                    ElMessage({
                        message: error.message,
                        type: 'error'
                    });
                });
        }
    }

    return {
        changeDataData,
        changeAvatar,
        changeDataType,
        submitAvatar,
        submitChange
    }
}
