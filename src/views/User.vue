<template>
    <div>
        <!-- 登陆和注册 -->
        <div v-if="common.isEmpty(currentUser)" class="myCenter in-up-container my-animation-hideToShow">
            <!-- 背景图片 -->
            <el-image class="my-el-image" style="position: absolute" v-once lazy :src="store.state.webInfo.randomCover[
                Math.floor(Math.random() * store.state.webInfo.randomCover.length)
            ]
                " fit="cover">
                <template v-slot:error>
                    <div class="image-slot"></div>
                </template>
            </el-image>
            <div class="in-up" id="loginAndRegist">
                <div class="form-container sign-up-container">
                    <div class="myCenter">
                        <h1>注册</h1>
                        <el-form>
                            <input v-model="username" type="text" maxlength="30" placeholder="用户名" />
                            <input v-model="password" type="password" maxlength="30" placeholder="密码"
                                autocomplete="false" />
                            <input v-model="email" type="email" placeholder="邮箱" />
                            <input v-model="code" type="number" maxlength="6" placeholder="验证码" />
                        </el-form>
                        <a style="margin: 0" href="#" @click="sendEmail()">{{
                            registCodeString
                            }}</a>
                        <button @click="regist()">注册</button>
                    </div>
                </div>
                <div class="form-container sign-in-container">
                    <div class="myCenter">
                        <h1>登录</h1>
                        <el-form>
                            <input v-model="account" type="text" placeholder="用户名/邮箱" />
                            <input v-model="password" type="password" placeholder="密码" autocomplete="false" />
                        </el-form>
                        <a href="#" @click="changeDialog('找回密码')">忘记密码？</a>
                        <button @click="login()">登录</button>
                    </div>
                </div>
                <div class="overlay-container">
                    <div class="overlay">
                        <div class="overlay-panel myCenter overlay-left">
                            <h1>已有帐号？</h1>
                            <p>请登录🚀</p>
                            <button class="ghost" @click="signIn()">登录</button>
                        </div>
                        <div class="overlay-panel myCenter overlay-right">
                            <h1>没有帐号？</h1>
                            <p>立即注册吧😃</p>
                            <button class="ghost" @click="signUp()">注册</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- 用户信息 -->
        <div v-else class="user-container myCenter my-animation-hideToShow">
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
                            :src="currentUser.avatar"></el-avatar>
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
                                <el-input maxlength="30" v-model:value="currentUser.username"></el-input>
                            </div>
                            <div>
                                <span class="changeInfo" @click="changeDialog('修改密码')">修改密码</span>
                            </div>
                            <div>
                                <div v-if="!common.isEmpty(currentUser.email)">
                                    {{ currentUser.email }}
                                    <span class="changeInfo" @click="changeDialog('修改邮箱')">修改</span>
                                </div>
                                <div v-else>
                                    <span class="changeInfo" @click="changeDialog('绑定邮箱')">绑定邮箱</span>
                                </div>
                            </div>
                            <div>
                                <el-radio-group v-model:value="currentUser.gender">
                                    <el-radio :label="0" style="margin-right: 10px">薛定谔的猫</el-radio>
                                    <el-radio :label="1" style="margin-right: 10px">男</el-radio>
                                    <el-radio :label="2">女</el-radio>
                                </el-radio-group>
                            </div>
                            <div>
                                <el-input v-model:value="currentUser.introduction" maxlength="60" type="textarea"
                                    show-word-limit></el-input>
                            </div>
                        </div>
                    </div>
                    <div style="margin-top: 20px">
                        <proButton :info="'提交'" @click="submitUserInfo()" :before="constant.before_color_2"
                            :after="constant.after_color_2">
                        </proButton>
                    </div>
                </div>
                <div class="user-right"></div>
            </div>
        </div>

        <el-dialog :title="dialogTitle" v-model:visible="showDialog" width="30%" :before-close="clearDialog"
            :append-to-body="true" :close-on-click-modal="false" center top="25vh">
            <div class="myCenter" style="flex-direction: column">
                <div>
                    <div v-if="dialogTitle === '修改邮箱' || dialogTitle === '绑定邮箱'">
                        <div v-if="dialogTitle === '修改邮箱'" style="margin-bottom: 5px">
                            邮箱：
                        </div>
                        <div v-else style="margin-bottom: 5px">新邮箱：</div>
                        <el-input v-model:value="email" type="email"></el-input>
                        <div style="margin-top: 10px; margin-bottom: 5px">验证码：</div>
                        <el-input v-model:value="code"></el-input>
                        <div style="margin-top: 10px; margin-bottom: 5px">密码：</div>
                        <el-input v-model:value="password" maxlength="30" type="password"></el-input>
                    </div>
                    <div v-else-if="dialogTitle === '找回密码' || dialogTitle === '修改密码'">
                        <div style="margin-bottom: 5px">邮箱：</div>
                        <el-input v-model:value="email" type="email"></el-input>
                        <div style="margin-top: 10px; margin-bottom: 5px">验证码：</div>
                        <el-input v-model:value="code"></el-input>
                        <div style="margin-top: 10px; margin-bottom: 5px">新密码：</div>
                        <el-input maxlength="30" v-model:value="newPasswd" type="password"></el-input>
                        <div style="margin-top: 10px; margin-bottom: 5px">确认密码：</div>
                        <el-input maxlength="30" v-model:value="confirmPasswd" type="password"></el-input>
                        <div style="margin-top: 10px; margin-bottom: 5px" v-show="dialogTitle !== '修改密码'">
                            <a style="text-decoration: none" href="#" @click="showDialog = false">记起来了？去登陆</a>
                        </div>
                    </div>
                </div>
                <div style="display: flex; margin-top: 30px" v-show="dialogTitle !== '修改头像'">
                    <proButton :info="codeString" v-show="dialogTitle === '修改邮箱' ||
                        dialogTitle === '绑定邮箱' ||
                        dialogTitle === '找回密码' ||
                        dialogTitle === '修改密码'
                        " @click="getCode()" :before="constant.before_color_1" :after="constant.after_color_1"
                        style="margin-right: 20px">
                    </proButton>
                    <proButton :info="'提交'" @click="submitDialog()" :before="constant.before_color_2"
                        :after="constant.after_color_2">
                    </proButton>
                </div>
            </div>
        </el-dialog>

        <el-dialog title="图片" v-model:visible="addPictureDialog" width="25%" :append-to-body="true"
            :close-on-click-modal="false" destroy-on-close center top="25vh">
            <div>
                <uploadPicture :prefix="'userAvatar'" @addPicture="addPicture" :maxSize="2" :maxNumber="1">
                </uploadPicture>
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

//hooks
const common = inject("$common");
const constant = inject("$constant");
const http = inject("$http");

const store = useStore();
const router = useRouter();

const data = reactive({
    currentUser: store.state.currentUser,
    username: '',
    account: '',
    password: '',
    email: '',
    avatar: '',
    showDialog: false,
    code: '',
    dialogTitle: '',
    codeString: '验证码',
    registCodeString: '获取验证码',
    intervalCode: null,
    addPictureDialog: false,
    newPasswd: '',
    confirmPasswd: ''
});


const addPicture = (res) => {
    data.avatar = res;
    submitDialog();
};
const signUp = () => {
    data.username = '';
    data.password = '';
    data.email = '';
    data.code = '';
    document.querySelector('#loginAndRegist').classList.add('right-panel-active');
};
const signIn = () => {
    data.account = '';
    data.password = '';
    document.querySelector('#loginAndRegist').classList.remove('right-panel-active');
};
const login = () => {
    if (common.isEmpty(data.account)) {
        ElMessage({
            message: `请输入用户名/邮箱！`,
            type: 'error',
        });
        return;
    }

    if (common.isEmpty(data.password)) {
        ElMessage({
            message: `请输入密码！`,
            type: 'error',
        });
        return;
    }

    let user = {
        account: data.account.trim(),
        password: common.encrypt(data.password.trim()),
    };

    http.post(constant.baseURL + '/user/login', user, false, false)
        .then((res) => {
            if (!common.isEmpty(res.data)) {
                store.commit('loadCurrentUser', res.data);
                localStorage.setItem('userToken', res.data.accessToken);
                data.account = '';
                data.password = '';
                router.push({ path: '/' });
            }
        })
        .catch((error) => {
            ElMessage({
                message: error.message,
                type: 'error',
            });
        });
};
const regist = () => {
    if (common.isEmpty(data.username) || common.isEmpty(data.password)) {
        ElMessage({
            message: '请输入用户名或密码！',
            type: 'error',
        });
        return;
    }

    if (data.username.indexOf(' ') !== -1 || data.password.indexOf(' ') !== -1) {
        ElMessage({
            message: '用户名或密码不能包含空格！',
            type: 'error',
        });
        return;
    }

    let result = validateUsername(data.username);
    if (!result.isValid) {
        ElMessage({
            message: result.message,
            type: 'error',
        });
        return false;
    }

    let passwdResult = validatePassword(data.password);
    if (passwdResult !== '密码有效') {
        ElMessage({
            message: passwdResult,
            type: 'error',
        });
        return;
    }

    if (common.isEmpty(data.email)) {
        ElMessage({
            message: '请输入邮箱！',
            type: 'error',
        });
        return false;
    }

    if (!checkEmail()) {
        return;
    }

    if (common.isEmpty(data.code)) {
        ElMessage({
            message: '请输入验证码！',
            type: 'error',
        });
        return;
    }

    let user = {
        username: data.username.trim(),
        code: data.code.trim(),
        password: common.encrypt(data.password.trim()),
        email: data.email,
    };

    if (!checkEmail()) {
        return;
    }

    http.post(constant.baseURL + '/user/regist', user)
        .then((res) => {
            if (!common.isEmpty(res.data)) {
                data.username = '';
                data.account = '';
                data.password = '';
                ElMessage({
                    message: '注册成功，快去登陆吧！',
                    type: 'success',
                });
                document.querySelector('#loginAndRegist').classList.remove('right-panel-active');
            }
        })
        .catch((error) => {
            ElMessage({
                message: error.message,
                type: 'error',
            });
        });
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

    let result = validateUsername(data.username);
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
        center: true,
    })
        .then(() => {
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

const sendEmail = () => {
    if (data.registCodeString === '获取验证码') {
        if (!checkEmail()) {
            return;
        }
        http.get(constant.baseURL + '/user/getCodeForForgetPassword', {
            email: data.email,
        })
            .then((res) => {
                ElMessage({
                    message: '验证码已发送，请注意查收！',
                    type: 'success',
                });
                data.registCodeString = '30s 后重试';
                data.intervalCode = setInterval(() => {
                    if (data.registCodeString === '0s 后重试') {
                        clearInterval(data.intervalCode);
                        data.registCodeString = '获取验证码';
                    } else {
                        data.registCodeString = parseInt(data.registCodeString) - 1 + 's 后重试';
                    }
                }, 1000);
            })
            .catch((error) => {
                ElMessage({
                    message: error.message,
                    type: 'error',
                });
            });
    } else {
        ElMessage({
            message: '请稍后再试！',
            type: 'warning',
        });
    }
};
const changeDialog = (value) => {
    data.dialogTitle = value;
    data.showDialog = true;
    if (
        value === '修改邮箱' ||
        value === '绑定邮箱' ||
        value === '找回密码'
    ) {
        data.password = '';
        data.email = '';
        data.code = '';
        data.account = '';
        data.newPasswd = '';
        data.confirmPasswd = '';
    }
};

const editAvatar = () => {
    data.addPictureDialog = true;
    data.dialogTitle = '修改头像';
};
const submitDialog = () => {
    if (data.dialogTitle === '修改头像') {
        if (common.isEmpty(data.avatar)) {
            ElMessage({
                message: '请上传头像！',
                type: 'error',
            });
        } else {
            let user = {
                avatar: data.avatar.trim(),
            };

            http.post(constant.baseURL + '/user/updateUserInfo', user)
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
    } else if (
        data.dialogTitle === '修改邮箱' ||
        data.dialogTitle === '绑定邮箱' ||
        data.dialogTitle === '找回密码' ||
        data.dialogTitle === '修改密码'
    ) {
        updateSecretInfo();
    }
};
const updateSecretInfo = () => {
    if (common.isEmpty(data.code)) {
        ElMessage({
            message: '请输入验证码！',
            type: 'error',
        });
        return;
    }

    let params = {
        email: data.email,
        code: data.code.trim(),
        password: common.encrypt(data.password.trim()),
    };

    if (data.dialogTitle === '找回密码' || data.dialogTitle === '修改密码') {
        if (common.isEmpty(data.password)) {
            ElMessage({
                message: '请输入当前密码！',
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

        if (data.newPasswd !== data.confirmPasswd) {
            ElMessage({
                message: '两次输入的密码不一致！',
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

        params.password = common.encrypt(data.password.trim());
        params.newPassword = common.encrypt(data.newPasswd.trim());
    }

    http.post(constant.baseURL + '/user/updateSecretInfo', params)
        .then((res) => {
            if (!common.isEmpty(res.data)) {
                ElMessage({
                    message: '修改成功，请重新登录！',
                    type: 'success',
                });
                store.commit('clearUserData');
                data.currentUser = {};
                router.push({ path: '/login' });
                clearDialog();
            }
        })
        .catch((error) => {
            ElMessage({
                message: error.message,
                type: 'error',
            });
        });
};
const checkEmail = () => {
    let pattern = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
    if (!pattern.test(data.email)) {
        ElMessage({
            message: '请输入正确的邮箱地址！',
            type: 'error',
        });
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

const { currentUser, username, account, password, email, avatar, showDialog, code, dialogTitle, codeString,
    registCodeString, intervalCode, addPictureDialog, newPasswd, confirmPasswd } = toRefs(data)
</script>

<style scoped>
.in-up-container {
    height: 100vh;
    position: relative;
}

.in-up {
    opacity: 0.9;
    border-radius: 10px;
    box-shadow: 0 15px 30px var(--miniMask), 0 10px 10px var(--miniMask);
    position: relative;
    overflow: hidden;
    width: 750px;
    max-width: 100%;
    min-height: 450px;
    margin: 10px;
}

.in-up p {
    font-size: 14px;
    letter-spacing: 1px;
    margin: 20px 0 30px 0;
}

.in-up a {
    color: var(--black);
    font-size: 14px;
    text-decoration: none;
    margin: 15px 0;
}

.form-container {
    position: absolute;
    height: 100%;
    transition: all 0.5s ease-in-out;
}

.sign-in-container {
    left: 0;
    width: 50%;
}

.sign-up-container {
    left: 0;
    width: 50%;
    opacity: 0;
}

.form-container div {
    background: var(--white);
    flex-direction: column;
    padding: 0 20px;
    height: 100%;
}

.form-container input {
    background: var(--maxLightGray);
    border-radius: 2px;
    border: none;
    padding: 12px 15px;
    margin: 10px 0;
    width: 100%;
    outline: none;
}

.in-up button {
    border-radius: 2rem;
    border: none;
    background: var(--lightRed);
    color: var(--white);
    font-size: 16px;
    font-weight: bold;
    padding: 12px 45px;
    letter-spacing: 2px;
    cursor: pointer;
}

.in-up button:hover {
    animation: scale 0.8s ease-in-out;
}

.in-up button.ghost {
    background: transparent;
    border: 1px solid var(--white);
}

.sign-up-container button {
    margin-top: 20px;
}

.overlay-container {
    position: absolute;
    left: 50%;
    width: 50%;
    height: 100%;
    overflow: hidden;
    transition: all 0.5s ease-in-out;
}

.overlay {
    background: var(--gradualRed);
    color: var(--white);
    position: relative;
    left: -100%;
    height: 100%;
    width: 200%;
}

.overlay-panel {
    position: absolute;
    top: 0;
    flex-direction: column;
    height: 100%;
    width: 50%;
    transition: all 0.5s ease-in-out;
}

.overlay-right {
    right: 0;
    transform: translateY(0);
}

.overlay-left {
    transform: translateY(-20%);
}

.in-up.right-panel-active .sign-in-container {
    transform: translateY(100%);
}

.in-up.right-panel-active .overlay-container {
    transform: translateX(-100%);
}

.in-up.right-panel-active .sign-up-container {
    transform: translateX(100%);
    opacity: 1;
}

.in-up.right-panel-active .overlay {
    transform: translateX(50%);
}

.in-up.right-panel-active .overlay-left {
    transform: translateY(0);
}

.in-up.right-panel-active .overlay-right {
    transform: translateY(20%);
}

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

.user-content>>>.el-input__inner,
.user-content>>>.el-textarea__inner {
    border: none;
    background: var(--whiteMask);
}

.user-content>>>.el-input__count {
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
