<template>
    <div>
        <el-tag effect="dark" class="my-tag">
            <svg viewBox="0 0 1024 1024" width="20" height="20" style="vertical-align: -3px">
                <path d="M0 0h1024v1024H0V0z" fill="#202425" opacity=".01"></path>
                <path
                    d="M682.666667 204.8h238.933333a34.133333 34.133333 0 0 1 34.133333 34.133333v648.533334a68.266667 68.266667 0 0 1-68.266666 68.266666h-204.8V204.8z"
                    fill="#FFAA44"></path>
                <path
                    d="M68.266667 921.6a34.133333 34.133333 0 0 0 34.133333 34.133333h785.066667a68.266667 68.266667 0 0 1-68.266667-68.266666V102.4a34.133333 34.133333 0 0 0-34.133333-34.133333H102.4a34.133333 34.133333 0 0 0-34.133333 34.133333v819.2z"
                    fill="#11AA66"></path>
                <path
                    d="M238.933333 307.2a34.133333 34.133333 0 0 0 0 68.266667h136.533334a34.133333 34.133333 0 1 0 0-68.266667H238.933333z m0 204.8a34.133333 34.133333 0 1 0 0 68.266667h409.6a34.133333 34.133333 0 1 0 0-68.266667H238.933333z m0 204.8a34.133333 34.133333 0 1 0 0 68.266667h204.8a34.133333 34.133333 0 1 0 0-68.266667H238.933333z"
                    fill="#FFFFFF"></path>
            </svg>
            文章信息
        </el-tag>
        <el-form :model="article" :rules="rules" ref="ruleForm" label-width="150px">
            <el-form-item label="标题" prop="articleTitle">
                <el-input maxlength="30" v-model="article.articleTitle"></el-input>
            </el-form-item>

            <el-form-item label="视频链接" prop="videoUrl">
                <el-input maxlength="1000" v-model="article.videoUrl"></el-input>
            </el-form-item>

            <el-form-item label="内容" prop="articleContent">
                <div id="vditor"></div>
            </el-form-item>

            <el-form-item label="是否启用评论" prop="commentStatus">
                <el-tag :type="article.commentStatus === false ? 'danger' : 'success'" disable-transitions>
                    {{ article.commentStatus === false ? '否' : '是' }}
                </el-tag>
                <el-switch v-model="article.commentStatus"></el-switch>
            </el-form-item>

            <el-form-item label="是否推荐" prop="recommendStatus">
                <el-tag :type="article.recommendStatus === false ? 'danger' : 'success'" disable-transitions>
                    {{ article.recommendStatus === false ? '否' : '是' }}
                </el-tag>
                <el-switch v-model="article.recommendStatus"></el-switch>
            </el-form-item>

            <el-form-item label="是否付费" prop="viewStatus">
                <el-tag :type="article.viewStatus === false ? 'danger' : 'success'" disable-transitions>
                    {{ article.viewStatus === false ? '否' : '是' }}
                </el-tag>
                <el-switch v-model="article.viewStatus"></el-switch>
            </el-form-item>

            <el-form-item v-if="article.viewStatus === true" label="付费时的提示信息" prop="tips">
                <el-input maxlength="255" v-model="article.tips" :min="0"></el-input>
            </el-form-item>

            <el-form-item v-if="article.viewStatus === true" label="付费金额" prop="amount">
                <el-input v-model="article.amount" step="0.01" type="number" style="width: 240px"></el-input>
            </el-form-item>

            <el-form-item label="封面" prop="articleCover">
                <div class="myCenter" style="flex-direction: column;width: 100%">
                    <div style="display: flex;width: 100%">
                        <el-input v-model="article.articleCover" disabled></el-input>
                        <el-image class="table-td-thumb" lazy style="margin-left: 10px"
                            :preview-src-list="[article.articleCover]" :src="article.articleCover"
                            fit="cover"></el-image>
                    </div>
                    <UploadPicture :isAdmin="true" :prefix="'articleCover'" style="margin-top: 10px;width: 100%"
                        @addPicture="addArticleCover" :maxSize="2" :maxNumber="1"></UploadPicture>
                </div>
            </el-form-item>
            <el-form-item label="分类" prop="sortId">
                <el-select v-model="article.sortId" popper-class="custom-popper" filterable clearable placement="bottom"
                    placeholder="请选择分类" style="width: 240px">
                    <el-option v-for="item in sorts" :key="item.id" :label="item.sortName" :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="标签" prop="labelId">
                <el-select v-model="article.labelId" popper-class="custom-popper" filterable clearable
                    placement="bottom" placeholder="请选择标签" style="width: 240px">
                    <el-option v-for="item in labelsTemp" :key="item.id" :label="item.labelName" :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
        </el-form>
        <div class="myCenter" style="margin-bottom: 22px">
            <el-button type="primary" @click="submitForm()">保存</el-button>
            <el-button type="danger" @click="resetForm()">重置所有修改</el-button>
        </div>
    </div>
</template>

<script setup>
import UploadPicture from '../../components/common/UploadPicture.vue';

import Vditor from 'vditor'
import 'vditor/dist/index.css'
import emojis from './../../utils/emoji.json'
import { inject, onMounted, reactive, toRefs, watch, ref } from 'vue';
import { useStore } from "vuex";
import { useRouter, useRoute } from "vue-router";
import { ElMessage, ElMessageBox } from 'element-plus';

// hooks
const common = inject("$common");
const constant = inject("$constant");
const http = inject("$http");

const store = useStore();
const router = useRouter();
const route = useRoute();

const ruleForm = ref(null);

const data = reactive({
    id: route.query.id,
    article: {
        articleTitle: '',
        articleContent: '',
        commentStatus: true,
        recommendStatus: false,
        viewStatus: false,
        amount: 0,
        tips: '该篇文章是付费内容，可以为您提供更深入的见解和高质量的信息。如有需要，请选择支付方式并支付！',
        articleCover: '',
        videoUrl: '',
        sortId: null,
        labelId: null,
    },
    sorts: [],
    labels: [],
    labelsTemp: [],
    rules: {
        articleTitle: [
            { required: true, message: '请输入标题', trigger: 'change' },
        ],
        articleContent: [
            { required: true, message: '请输入内容', trigger: 'change' },
        ],
        commentStatus: [
            { required: true, message: '是否启用评论', trigger: 'change' },
        ],
        recommendStatus: [
            { required: true, message: '是否推荐', trigger: 'change' },
        ],
        viewStatus: [
            { required: true, message: '是否付费', trigger: 'change' },
        ],
        articleCover: [{ required: true, message: '封面', trigger: 'change' }],
        sortId: [{ required: true, message: '分类', trigger: 'change' }],
        labelId: [{ required: true, message: '标签', trigger: 'blur' }],
    },
    vditor: null,
    webInfo: common.isEmpty(store.state.webInfo) ? {} : store.state.webInfo
})


watch(() => data.article.sortId, (newVal, oldVal) => {
    if (oldVal !== null) {
        data.article.labelId = null
    }
    if (!common.isEmpty(newVal) && !common.isEmpty(data.labels)) {
        data.labelsTemp = data.labels.filter((l) => l.sortId === newVal)
    }
})

onMounted(async () => {
    await getSortAndLabel()
    await initVditor()
})

const verifyAmount = (value) => {
    // 使用正则表达式只允许输入大于0且最多两位小数的数字
    const regex = /^(?!0(\.0{1,2})?$)([1-9]\d*|0)(\.\d{1,2})?$/;
    if (regex.test(value)) {
        // 确保金额大于0
        const amount = parseFloat(value);
        return amount > 0;
    } else {
        // 输入不符合要求
        return false;
    }
};

const imgAdd = (file) => {
    let suffix = ''
    if (file.name.lastIndexOf('.') !== -1) {
        suffix = file.name.substring(file.name.lastIndexOf('.'))
    }
    let key =
        'articlePicture' +
        '/' +
        store.state.currentAdmin.username.replace(/[^a-zA-Z]/g, '') +
        store.state.currentAdmin.id +
        new Date().getTime() +
        Math.floor(Math.random() * 1000) + suffix

    let storeType = localStorage.getItem('defaultStoreType')

    let fd = new FormData()
    fd.append('file', file)
    fd.append('originalName', file.name)
    fd.append('key', key)
    fd.append('relativePath', key)
    fd.append('type', 'articlePicture')
    fd.append('storeType', storeType)

    if (storeType === 'local') {
        saveLocal(fd, file.type)
    } else if (storeType === 'qiniu') {
        saveQiniu(fd, file.type)
    }
}
const saveLocal = (fd) => {
    http.upload(constant.baseURL + '/resource/upload', fd, true)
        .then((res) => {
            if (!common.isEmpty(res.data)) {
                let url = res.data
                let file = fd.get('file')
                if (file.type.indexOf('image/') === 0) {
                    data.vditor.insertValue(`![${file.name}](${url})`)
                }
                if (file.type.indexOf('video/') === 0) {
                    data.vditor.insertValue(`[${file.name}](${url})`)
                }
                if (file.type.indexOf('audio/') === 0) {
                    data.vditor.insertValue(`[${file.name}](${url})`)
                }
            }
        })
        .catch((error) => {
            ElMessage({
                message: error.message,
                type: 'error',
            })
        })
}
const saveQiniu = (fd) => {
    http
        .get(
            constant.baseURL + '/qiniu/getUpToken',
            { key: fd.get('key') },
            true
        )
        .then((res) => {
            if (!common.isEmpty(res.data)) {
                fd.append('token', res.data)

                http
                    .uploadQiniu(import.meta.env.VITE_QINIU_UPLOAD_URL, fd)
                    .then((res) => {
                        if (!common.isEmpty(res.key)) {
                            let url = import.meta.env.VITE_QINIU_DOWNLOAD_URL + res.key
                            let file = fd.get('file')
                            common.saveResource(
                                'articlePicture',
                                url,
                                file.size,
                                file.type,
                                file.name,
                                'qiniu',
                                true
                            )
                            if (file.type.indexOf('image/') === 0) {
                                data.vditor.insertValue(`![${file.name}](${url})`)
                            }
                            if (file.type.indexOf('video/') === 0) {
                                data.vditor.insertValue(`[${file.name}](${url})`)
                            }
                            if (file.type.indexOf('audio/') === 0) {
                                data.vditor.insertValue(`[${file.name}](${url})`)
                            }
                        }
                    })
                    .catch((error) => {
                        ElMessage({
                            message: error.message,
                            type: 'error',
                        })
                    })
            }
        })
        .catch((error) => {
            ElMessage({
                message: error.message,
                type: 'error',
            })
        })
}
const addArticleCover = (res) => {
    data.article.articleCover = res
}

const getSortAndLabel = async () => {
    try {
        const res = await http.get(
            constant.baseURL + '/webInfo/listSortAndLabel'
        )
        if (!common.isEmpty(res.data)) {
            data.sorts = res.data.sorts
            data.labels = res.data.labels
            if (!common.isEmpty(data.id)) {
                await getArticle()
            }
        }
    } catch (error) {
        ElMessage({
            message: error.message,
            type: 'error',
        })
    }
}
const getArticle = async () => {
    try {
        const res = await http.get(constant.baseURL + '/admin/article/getArticleById', { id: data.id }, true)
        if (!common.isEmpty(res.data)) {
            data.article = res.data
        }
    } catch (error) {
        ElMessage({
            message: error.message,
            type: 'error',
        })
    }
}
const submitForm = () => {
    if (data.article.viewStatus === true) {
        if (common.isEmpty(data.article.tips)) {
            ElMessage({
                message: '文章付费时必须输入提示信息！',
                type: 'error',
            })
            return
        }
        if (common.isEmpty(data.article.amount)) {
            ElMessage({
                message: '文章付费时必须输入付款金额',
                type: 'error',
            })
            return
        }
        if (!verifyAmount(data.article.amount)) {
            ElMessage({
                message: '请输入合法的付费金额（金额大于0并且最多两位小数哦）！',
                type: 'error',
            })

        }
        return
    }

    ruleForm.value.validate((valid) => {
        if (valid) {
            data.article.articleContent = data.vditor.getValue()
            if (common.isEmpty(data.id)) {
                saveArticle(data.article, '/article/saveArticle')
            } else {
                data.article.id = data.id
                saveArticle(data.article, '/article/updateArticle')
            }
        } else {
            ElMessage({
                message: '请完善必填项！',
                type: 'error',
            })
        }
    })
}
const resetForm = () => {
    ruleForm.value.resetFields()
    if (!common.isEmpty(data.id)) {
        getArticle()
    }
}
const saveArticle = (value, url) => {
    ElMessageBox.confirm('确认保存？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'success',
        center: true,
    })
        .then(() => {
            http
                .post(constant.baseURL + url, value, true)
                .then((res) => {
                    ElMessage({
                        message: '保存成功！',
                        type: 'success',
                    })
                    router.push({ path: '/postList' })
                })
                .catch((error) => {
                    ElMessage({
                        message: error.message,
                        type: 'error',
                    })
                })
        })
        .catch(() => {
            ElMessage({
                type: 'success',
                message: '已取消保存!',
            })
        })
}
const initVditor = async () => {
    data.vditor = new Vditor('vditor', {
        height: 500,
        width: '100%',
        placeholder: '开始书写文章吧....',
        theme: 'classic',
        value: data.article.articleContent,
        icon: 'material',
        tab: '\t',
        input: (value) => {
            data.article.articleContent = value
            ruleForm.value.validateField('articleContent')
        },
        counter: {
            enable: true,
            type: 'text',
        },
        preview: {
            delay: 0,
            hljs: {
                style: 'monokai',
                lineNumber: true,
            },
        },
        typewriterMode: true,
        cache: {
            enable: false,
        },
        mode: 'sv',
        upload: {
            url: '', // 留空，因为我们使用自定义上传
            headers: {},
            handler: (files) => {
                files.forEach((file) => {
                    if (file.type.indexOf('image/') === 0) {
                        if (file.size > 2 * 1024 * 1024) {
                            ElMessage({
                                type: 'error',
                                message: '图片大小不能超过2MB!',
                            })
                            return
                        }
                        imgAdd(file)
                    }
                    if (file.type.indexOf('video/') === 0) {
                        imgAdd(file)
                    }
                    if (file.type.indexOf('audio/') === 0) {
                        imgAdd(file)
                    }
                })
            },
        },
        preview: {
            markdown: {
                toc: true, // 启用目录功能
                mark: true, // 启用标记功能
                footnotes: true, // 启用脚注功能
                autoSpace: true, // 启用自动空格
                codeBlockPreview: false,
            },
            math: {
                engine: 'KaTeX', // 使用 KaTeX 引擎渲染数学公式
                inlineDigit: true, // 启用行内数字格式化
            },
            render: {
                media: {
                    enable: true,
                },
            },
        },
        outline: {
            enable: true,
            position: 'left',
        },
        hint: {
            emoji: emojis,
            parse: true,
            extend: [
                {
                    key: '@',
                    hint: (key) => {
                        if ('vanessa'.indexOf(key.toLocaleLowerCase()) > -1) {
                            return [
                                {
                                    value: '@Lucky',
                                    html: `<img src="${data.webInfo.avatar}"/> ${data.webInfo.webName}`,
                                },
                            ]
                        }
                        return []
                    },
                },
            ],
        },
        toolbar: [
            'emoji',
            'headings',
            'bold',
            'italic',
            'strike',
            'link',
            '|',
            'list',
            'ordered-list',
            'check',
            'outdent',
            'indent',
            '|',
            'quote',
            'line',
            'code',
            'inline-code',
            'insert-before',
            'insert-after',
            '|',
            'upload',
            'table',
            '|',
            'undo',
            'redo',
            '|',
            'edit-mode',
            'content-theme',
            'code-theme',
            'export',
            {
                name: 'more',
                toolbar: ['fullscreen', 'both', 'preview', 'info', 'help'],
            },
        ],
    })
}

const { id, article, sorts, labels, labelsTemp, rules, vditor, webInfo } = toRefs(data)

</script>

<style>
.vditor-sv {
    font-family: var(--globalFont), serif;
}

.vditor-reset {
    font-family: var(--globalFont), serif;
}

.vditor-reset pre>code {
    font-family: var(--globalFont), serif;
}

.vditor-reset code:not(.hljs):not(.highlight-chroma) {
    font-family: var(--globalFont), serif;
}
</style>


<style scoped>
.my-tag {
    margin-bottom: 20px;
    width: 100%;
    text-align: left;
    background: var(--lightYellow);
    border: none;
    height: 40px;
    line-height: 40px;
    font-size: 16px;
    color: var(--black);
}

.table-td-thumb {
    border-radius: 2px;
    width: 40px;
    height: 40px;
}

.el-switch {
    margin-left: 10px;
}

.el-form-item {
    margin-bottom: 40px;
}
</style>
