import {ElMessage} from "element-plus";

import {reactive,inject} from 'vue';

export default function () {
    const http = inject("$http")
    const constant = inject("$constant")
    const common = inject("$common")


    let groupData = reactive({
        //群组列表
        groups: {},
        //当前群信息
        currentGroupId: null
    })

    function exitGroup(currentGroupId) {
        http.get(constant.baseURL + "/imChatGroupUser/quitGroup", {
                id: currentGroupId
            })
            .then((res) => {
                delete groupData.groups[currentGroupId];
                groupData.currentGroupId = null;
                ElMessage({
                    message: "退群成功！",
                    type: 'success'
                });
            })
            .catch((error) => {
                ElMessage({
                    message: error.message,
                    type: 'error'
                });
            });
    }

    function dissolveGroup(currentGroupId) {
        http.get(constant.baseURL + "/imChatGroup/deleteGroup", {
                id: currentGroupId
            })
            .then((res) => {
                delete groupData.groups[currentGroupId];
                groupData.currentGroupId = null;
                ElMessage({
                    message: "解散群成功！",
                    type: 'success'
                });
            })
            .catch((error) => {
                ElMessage({
                    message: error.message,
                    type: 'error'
                });
            });
    }

    async function getImGroup() {
        await http.get(constant.baseURL + "/imChatGroup/listGroup")
            .then((res) => {
                if (!common.isEmpty(res.data)) {
                    res.data.forEach(group => {
                        groupData.groups[group.id] = group;
                    });
                }
            })
            .catch((error) => {
                ElMessage({
                    message: error.message,
                    type: 'error'
                });
            });
    }

    function addGroupTopic() {
        http.get(constant.baseURL + "/imChatGroup/addGroupTopic", {
                id: groupData.currentGroupId
            })
            .then((res) => {})
            .catch((error) => {
                ElMessage({
                    message: error.message,
                    type: 'error'
                });
            });
    }

    return {
        groupData,
        getImGroup,
        addGroupTopic,
        exitGroup,
        dissolveGroup
    }
}
