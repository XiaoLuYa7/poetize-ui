<template>
    <div>

        <!-- 用户信息 -->
        <div class="user-container myCenter my-animation-hideToShow">
            <!-- 背景图片 -->
            <el-image class="my-el-image" style="position: absolute" v-once lazy :src="store.state.webInfo.randomCover[
                Math.floor(Math.random() * store.state.webInfo.randomCover.length)
            ]
                " fit="cover">
                <template v-slot:error>
                    <div class="image-slot"></div>
                </template>
            </el-image>
            <div class="shadow-box-mini user-info" style="display: flex; color: black">
                <div class="user-left">
                    <div>
                        <el-avatar class="user-avatar" @click="editAvatar('修改头像')" :size="60"
                            :src="data.currentUser.avatar"></el-avatar>
                    </div>
                    <div class="myCenter" style="margin-top: 12px">
                        <div class="user-title">
                            <div>用户名：</div>
                            <div>密码：</div>
                            <div>邮箱：</div>
                            <div>性别：</div>
                            <div>简介：</div>
                        </div>
                        <div class="user-content">
                            <div>
                                <el-input maxlength="30" v-model="currentUser.username"></el-input>
                            </div>
                            <div>
                                ********
                                <span style="margin-left: 5px" class="changeInfo" @click="changeDialog('修改密码')">修改密码</span>
                            </div>
                            <div>
                                {{ currentUser.email }}
                                <span style="margin-left: 5px" class="changeInfo" @click="changeDialog('身份验证')">修改邮箱</span>
                            </div>
                            <div>
                                <el-radio-group v-model="currentUser.gender">
                                    <el-radio :value="0" style="margin-right: 10px">薛定谔的猫</el-radio>
                                    <el-radio :value="1" style="margin-right: 10px">男</el-radio>
                                    <el-radio :value="2">女</el-radio>
                                </el-radio-group>
                            </div>
                            <div>
                                <el-input v-model="currentUser.introduction" maxlength="60" type="textarea"
                                    show-word-limit></el-input>
                            </div>
                        </div>
                    </div>
                    <div style="margin-top: 20px">
                        <ProButton :info="'提交'" @click="submitUserInfo()" :before="constant.before_color_2"
                            :after="constant.after_color_2">
                        </ProButton>
                    </div>
                </div>
                <div class="user-right"></div>
            </div>
        </div>

        <el-dialog :title="dialogTitle" v-model="showDialog" width="30%" :before-close="clearDialog"
            :append-to-body="true" :close-on-click-modal="false" center top="25vh">
            <div class="myCenter" style="flex-direction: column">
                <el-form>
                    <div v-if="dialogTitle === '身份验证'">
                        <div style="margin-bottom: 5px">邮箱：</div>
                        <el-input v-model="email" disabled type="email" style="min-width: 240px;"></el-input>
                        <div style="margin-top: 10px; margin-bottom: 5px">邮箱验证码：</div>
                        <el-input v-model="code"></el-input>
                    </div>
                    <div v-else-if="dialogTitle === '修改密码'">
                        <div style="margin-bottom: 5px">邮箱：</div>
                        <el-input v-model="email" disabled type="email" style="min-width: 240px;"></el-input>
                        <div style="margin-top: 10px; margin-bottom: 5px">验证码：</div>
                        <el-input v-model="code"></el-input>
                        <div style="margin-top: 10px; margin-bottom: 5px">新密码：</div>
                        <el-input maxlength="30" v-model="newPasswd" type="password"></el-input>
                        <div style="margin-top: 10px; margin-bottom: 5px">确认密码：</div>
                        <el-input maxlength="30" v-model="confirmPasswd" type="password"></el-input>
                    </div>
                    <div v-else-if="dialogTitle === '修改邮箱'">
                        <div style="margin-top: 10px; margin-bottom: 5px">新邮箱：</div>
                            <el-input v-model="email" type="email"></el-input>
                            <div style="margin-top: 10px; margin-bottom: 5px">新邮箱验证码：</div>
                            <el-input v-model="code"></el-input>
                    </div>
                </el-form>
                <div style="display: inline-flex; margin-top: 30px" v-show="dialogTitle !== '修改头像'">
                    <ProButton :info="codeString" @click="getCode()" :before="constant.before_color_1"
                        :after="constant.after_color_1" style="margin-right: 20px">
                    </ProButton>
                    <ProButton :info="'提交'" @click="submitDialog()" :before="constant.before_color_2"
                        :after="constant.after_color_2">
                    </ProButton>
                </div>
            </div>
        </el-dialog>

        <el-dialog title="图片" v-model="addPictureDialog" width="25%" :append-to-body="true"
            :close-on-click-modal="false" destroy-on-close center top="25vh">
            <div>
                <UploadPicture :prefix="'userAvatar'" @addPicture="addPicture" :maxSize="2" :maxNumber="1">
                </UploadPicture>
            </div>
        </el-dialog>
    </div>
</template>

<script setup>
import ProButton from '../components/common/ProButton.vue';
import UploadPicture from '../components/common/UploadPicture.vue';
import { reactive, inject, toRefs } from 'vue';
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { ElMessage, ElMessageBox } from "element-plus";
import { da } from 'element-plus/es/locales.mjs';

//hooks
const common = inject("$common");
const constant = inject("$constant");
const http = inject("$http");

const store = useStore();
const router = useRouter();

const data = reactive({
    currentUser: store.state.currentUser,
    email: '',
    newEmail: '',
    avatar: '',
    showDialog: false,
    code: '',
    dialogTitle: '',
    codeString: '获取验证码',
    intervalCode: null,
    addPictureDialog: false,
    newPasswd: '',
    confirmPasswd: ''
});

const addPicture = (res) => {
    data.avatar = res;
    if (common.isEmpty(data.avatar)) {
        ElMessage({
            message: '请上传头像！',
            type: 'error',
        });
    } else {
        http.post(constant.baseURL + '/user/updateUserAvatar', { avatar: data.avatar.trim() }, false, false)
            .then((res) => {
                if (!common.isEmpty(res.data)) {
                    store.commit('loadCurrentUser', res.data);
                    data.currentUser = store.state.currentUser;
                    ElMessage({
                        message: '修改成功！',
                        type: 'success',
                    });
                    setTimeout(() => {
                        clearDialog();
                    }, 700);
                }
            })
            .catch((error) => {
                ElMessage({
                    message: error.message,
                    type: 'error',
                });
            });
    }
};

const submitUserInfo = () => {
    if (common.isEmpty(data.currentUser.username)) {
        ElMessage({
            message: '请输入用户名！',
            type: 'error',
        });
        return false;
    }

    if (data.currentUser.username.indexOf(' ') !== -1) {
        ElMessage({
            message: '用户名不能包含空格！',
            type: 'error',
        });
        return false;
    }

    let result = validateUsername(data.currentUser.username);
    if (!result.isValid) {
        ElMessage({
            message: result.message,
            type: 'error',
        });
        return false;
    }

    let user = {
        username: data.currentUser.username,
        gender: data.currentUser.gender,
        introduction: data.currentUser.introduction.trim(),
    };

    ElMessageBox.confirm('确认保存？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'success',
        center: true
    }).then(() => {
        http.post(constant.baseURL + '/user/updateUserInfo', user)
            .then((res) => {
                if (!common.isEmpty(res.data)) {
                    store.commit('loadCurrentUser', res.data);
                    data.currentUser = store.state.currentUser;
                    ElMessage({
                        message: '修改成功！',
                        type: 'success',
                    });
                }
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
                message: '已取消保存!',
            });
        });
};

const changeDialog = (value) => {
    data.dialogTitle = value;
    data.showDialog = true;
    // 清空表单
    data.email = '';
    data.newEmail = '';
    data.code = '';
    data.newPasswd = '';
    data.confirmPasswd = '';
    if(data.dialogTitle === '身份验证' || data.dialogTitle === '修改密码'){
        data.email = data.currentUser.email;
    }
};

const editAvatar = () => {
    data.addPictureDialog = true;
    changeDialog('修改头像');
};

const submitDialog = () => {
    if (data.dialogTitle === '修改密码') {
        updatePasswd()
    } else if (data.dialogTitle === '身份验证') {
        verifyIdentity();
    } else if(data.dialogTitle === '修改邮箱'){
        updateEmail();
    }
}

const verifyIdentity = ()=> {
    if (!common.checkEmail(data.email)) {
        ElMessage({
            message: "请输入正确的邮箱地址",
            type: "error"
        })
        return;
    }

    if (data.email !== data.currentUser.email) {
        ElMessage({
            message: '请输入当前账户邮箱！',
            type: 'error',
        });
    }

    if (common.isEmpty(data.code)) {
        ElMessage({
            message: '请输入验证码！',
            type: 'error',
        });
        return;
    }

    let params = {
        email: data.email.trim(),
        code: data.code,
    };


    http.post(constant.baseURL + '/user/verifyIdentity', params, false, false)
        .then((res) => {
            ElMessage({
                message: '验证成功，请继续修改邮箱！',
                type: 'success',
            });
            data.dialogTitle = '修改邮箱';
            data.email = '';
            data.code = '';
        })
        .catch((error) => {
            ElMessage({
                message: error.message,
                type: 'error',
            });
        });
}

const getCode = () => {
    if (data.codeString === "获取验证码") {
        // 获取验证码
        if (!common.checkEmail(data.email)) {
            ElMessage({
                message: "请输入正确的邮箱地址",
                type: "error"
            })
            return;
        }
        http.get(constant.baseURL + '/user/getCode', {
            email: data.email,
        }).then((res) => {
            ElMessage({
                message: "验证码已发送，请注意查收！",
                type: "success"
            });
            data.code = '';
            data.codeString = "30s 后重试";
            data.intervalCode = setInterval(() => {
                if (data.codeString === "0s 后重试") {
                    clearInterval(data.intervalCode)
                    data.codeString = "获取验证码";
                } else {
                    data.codeString = (parseInt(data.codeString) - 1) + "s 后重试";
                }
            }, 1000);
        })
            .catch((error) => {
                ElMessage({
                    message: error.message,
                    type: "error"
                });
            });
    } else {
        ElMessage({
            message: "请稍后再试！",
            type: "warning"
        });
    }
}

const updateEmail = () => {
    if (!common.checkEmail(data.email)) {
        ElMessage({
            message: "请输入正确的邮箱地址",
            type: "error"
        })
        return;
    }



    if (common.isEmpty(data.code)) {
        ElMessage({
            message: '请输入验证码！',
            type: 'error',
        });
        return;
    }


    let params = {
        email: data.email.trim(),
        code: data.code,
    };


    http.post(constant.baseURL + '/user/updatePassword', params, false, false)
        .then((res) => {
            ElMessage({
                message: '修改成功，请重新登录！',
                type: 'success',
            });
            store.commit('clearUserData');
            data.currentUser = {};
            router.push({ path: '/login' });
            clearDialog();
        })
        .catch((error) => {
            ElMessage({
                message: error.message,
                type: 'error',
            });
        });
};

const updatePasswd = () => {
    if (!checkEmail(data.email)) {
        return;
    }

    if (data.email !== data.currentUser.email) {
        ElMessage({
            message: '不能修改其他账号！',
            type: 'error',
        });
    }

    if (common.isEmpty(data.code)) {
        ElMessage({
            message: '请输入验证码！',
            type: 'error',
        });
        return;
    }

    if (common.isEmpty(data.newPasswd)) {
        ElMessage({
            message: '请输入新密码！',
            type: 'error',
        });
        return;
    }

    if (common.isEmpty(data.confirmPasswd)) {
        ElMessage({
            message: '请再次输入新密码！',
            type: 'error',
        });
        return;
    }

    let passwdResult = validatePassword(data.newPasswd);
    if (passwdResult !== '密码有效') {
        ElMessage({
            message: passwdResult,
            type: 'error',
        });
        return;
    }

    if (data.newPasswd !== data.confirmPasswd) {
        ElMessage({
            message: '两次输入的密码不一致！',
            type: 'error',
        });
        return;
    }


    let params = {
        email: data.email.trim(),
        code: data.code,
        newPasswd: common.encrypt(data.newPasswd.trim()),
        confirmPasswd: common.encrypt(data.confirmPasswd.trim())
    };


    http.post(constant.baseURL + '/user/updatePassword', params, false, false)
        .then((res) => {
            ElMessage({
                message: '修改成功，请重新登录！',
                type: 'success',
            });
            store.commit('clearUserData');
            data.currentUser = {};
            router.push({ path: '/login' });
            clearDialog();
        })
        .catch((error) => {
            ElMessage({
                message: error.message,
                type: 'error',
            });
        });
};

const checkEmail = (email) => {
    let pattern = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
    if (!pattern.test(email)) {
        return false;
    }
    return true;
};
const clearDialog = () => {
    data.showDialog = false;
    data.addPictureDialog = false;
};

const validatePassword = (password) => {
    if (password.length < 6) {
        return '密码长度不能小于6位！';
    }

    if (!/\d/.test(password) || !/[a-zA-Z]/.test(password)) {
        return '密码必须包含字母和数字！';
    }

    return '密码有效';
};
const validateUsername = (username) => {
    if (username.length < 3 || username.length > 15) {
        return { isValid: false, message: '用户名长度必须在3到15个字符之间！' };
    }

    return { isValid: true, message: '' };
};

const { currentUser, username, password, email, avatar, showDialog, code, newCode, dialogTitle, codeString,
    registCodeString, intervalCode, addPictureDialog, newPasswd, confirmPasswd } = toRefs(data)
</script>

<style scoped>
.user-container {
    width: 100vw;
    height: 100vh;
    position: relative;
}

.user-info {
    width: 80%;
    z-index: 10;
    margin-top: 70px;
    height: calc(100vh - 90px);
    margin-bottom: 20px;
    border-radius: 10px;
    overflow: hidden;
}

.user-left {
    width: 50%;
    background: var(--maxMaxWhiteMask);
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow-y: auto;
    padding: 20px;
}

.user-right {
    width: 50%;
    background: var(--maxWhiteMask);
    padding: 20px;
}

.user-title {
    text-align: right;
    user-select: none;
}

.user-content {
    text-align: left;
}

.user-title div {
    height: 55px;
    line-height: 55px;
    text-align: center;
}

.user-content>div {
    height: 55px;
    display: flex;
    align-items: center;
}

:deep(.el-input__inner) {
    color: #252629
}

.user-content :deep(.el-input__inner),
.user-content :deep(.el-textarea__inner) {
    border: none;
    background: var(--whiteMask);
}

.user-content :deep(.el-input__count) {
    background: var(--transparent);
    user-select: none;
}

.changeInfo {
    color: var(--white);
    font-size: 0.75rem;
    cursor: pointer;
    background: var(--themeBackground);
    padding: 3px;
    border-radius: 0.2rem;
    user-select: none;
}

@media screen and (max-width: 920px) {
    .user-info {
        width: 90%;
    }

    .user-left {
        width: 100%;
    }

    .user-right {
        display: none;
    }
}
</style>
