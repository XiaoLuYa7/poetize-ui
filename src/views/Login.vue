<template>
    <!-- 登陆和注册 -->
    <div class="myCenter in-up-container my-animation-hideToShow">
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
                    <a style="margin: 0" href="#" @click="getCode()">{{ codeString }}</a>
                    <button @click="regist()">注册</button>
                </div>
            </div>
            <div class="form-container sign-in-container">
                <div class="myCenter">
                    <h1>登录</h1>
                    <el-form>
                        <input v-model="username" type="text" placeholder="用户名/邮箱" />
                        <input v-model="password" type="password" placeholder="密码" autocomplete="false" />
                    </el-form>
                    <a href="#" @click="findPassword()">忘记密码？</a>
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

    <el-dialog title="找回密码" v-model="showDialog" width="30%" :before-close="clearDialog" :append-to-body="true"
        :close-on-click-modal="false" center top="25vh">
        <div class="myCenter" style="flex-direction: column">
            <el-form>

                <div style="margin-bottom: 5px">邮箱：</div>
                <el-input v-model="email" style="width: 240px" type="email"></el-input>
                <div style="margin-top: 10px; margin-bottom: 5px">验证码：</div>
                <el-input v-model="code"></el-input>
                <div style="margin-top: 10px; margin-bottom: 5px">新密码：</div>
                <el-input maxlength="30" v-model="newPasswd" type="password"></el-input>
                <div style="margin-top: 10px; margin-bottom: 5px">确认密码：</div>
                <el-input maxlength="30" v-model="confirmPasswd" type="password"></el-input>
                <div style="margin-top: 10px; margin-bottom: 5px">
                    <a style="text-decoration: none" href="#" @click="showDialog = false">记起来了？去登陆</a>
                </div>
            </el-form>
            <div style="display: inline-flex; margin-top: 30px">
                <ProButton :info="codeString" @click="getCode()" :before="constant.before_color_1"
                    :after="constant.after_color_1" style="margin-right: 20px">
                </ProButton>
                <ProButton :info="'提交'" @click="updatePasswd()" :before="constant.before_color_2"
                    :after="constant.after_color_2">
                </ProButton>
            </div>
        </div>
    </el-dialog>
</template>

<script setup>
import ProButton from '../components/common/ProButton.vue';
import { reactive, inject, toRefs } from 'vue';
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";

//hooks
const common = inject("$common");
const constant = inject("$constant");
const http = inject("$http");

const store = useStore();
const router = useRouter();

const data = reactive({
    username: '',
    password: '',
    email: '',
    showDialog: false,
    code: '',
    codeString: '获取验证码',
    intervalCode: null,
    newPasswd: '',
    confirmPasswd: ''
});



const signUp = () => {
    data.username = '';
    data.password = '';
    data.email = '';
    data.code = '';
    document.querySelector('#loginAndRegist').classList.add('right-panel-active');
};
const signIn = () => {
    data.username = '';
    data.password = '';
    document.querySelector('#loginAndRegist').classList.remove('right-panel-active');
};

const login = () => {
    if (common.isEmpty(data.username)) {
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
        account: data.username.trim(),
        password: common.encrypt(data.password.trim()),
    };

    http.post(constant.baseURL + '/user/login', user, false, false)
        .then((res) => {
            if (!common.isEmpty(res.data)) {
                store.commit('loadCurrentUser', res.data);
                localStorage.setItem('userToken', res.data.accessToken);
                data.username = '';
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

    console.log(typeof data.code)

    if (common.isEmpty(data.code)) {
        ElMessage({
            message: '请输入验证码！',
            type: 'error',
        });
        return;
    }

    let user = {
        username: data.username.trim(),
        code: data.code,
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
const findPassword = () => {
    data.showDialog = true;
    // 清空模态框
    data.newPasswd = '';
    data.email = '';
    data.code = '';
    data.confirmPasswd = '';
    // 清空登录框
    data.username = '';
    data.password = '';

    // 清空验证码等待时间
    clearInterval(data.intervalCode)
    data.codeString = "获取验证码"
};

// 除注册之外的获取验证码的方式
const getCode = () => {
    if (data.codeString === "获取验证码") {
        // 获取验证码
        if (!checkEmail()) {
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

const updatePasswd = () => {
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
    if (common.isEmpty(data.newPasswd)) {
        ElMessage({
            message: "请输入密码！",
            type: "error"
        });
        return;
    }

    let passwdResult = validatePassword(data.newPasswd);
    if (passwdResult !== '密码有效') {
        ElMessage({
            message: passwdResult,
            type: "error"
        });
        return;
    }
    if (data.newPasswd !== data.confirmPasswd) {
        ElMessage({
            message: '两次密码输入不一致，仔细检查哦！',
            type: "error"
        });
        return;
    }

    let params = {
        email: data.email,
        code: data.code,
        newPasswd: common.encrypt(data.newPasswd.trim()),
        confirmPasswd: common.encrypt(data.confirmPasswd.trim())
    };

    http.post(constant.baseURL + "/user/updatePassword", params, false, false)
        .then((res) => {
            ElMessage({
                message: "密码修改成功，请重新登陆！",
                type: "success"
            });
            setTimeout(() => {
                clearDialog();
            }, 700)
            store.commit("loadCurrentUser", {});
            localStorage.removeItem("userToken");
        })
        .catch((error) => {
            ElMessage({
                message: error.message,
                type: "error"
            });
        });
}

const clearDialog = () => {
    data.showDialog = false;

    // 清空验证码等待时间
    clearInterval(data.intervalCode)
    data.codeString = "获取验证码"
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
    console.log(username)
    if (username.length < 3 || username.length > 15) {
        return { isValid: false, message: '用户名长度必须在3到15个字符之间！' };
    }

    return { isValid: true, message: '' };
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


const { username, password, newPasswd, email, showDialog, code, codeString, intervalCode, confirmPasswd } = toRefs(data)

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
    padding: 10px 15px;
    margin: 10px 0;
    width: 100%;
    outline: none;
    font-size: 15px;
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
</style>
