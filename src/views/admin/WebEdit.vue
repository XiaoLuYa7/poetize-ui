<template>
    <div>
        <div>
            <el-tag effect="dark" class="my-tag">
                <svg viewBox="0 0 1024 1024" width="20" height="20" style="vertical-align: -4px">
                    <path
                        d="M767.1296 808.6528c16.8448 0 32.9728 2.816 48.0256 8.0384 20.6848 7.1168 43.52 1.0752 57.1904-15.9744a459.91936 459.91936 0 0 0 70.5024-122.88c7.8336-20.48 1.0752-43.264-15.9744-57.088-49.6128-40.192-65.0752-125.3888-31.3856-185.856a146.8928 146.8928 0 0 1 30.3104-37.9904c16.2304-14.5408 22.1696-37.376 13.9264-57.6a461.27104 461.27104 0 0 0-67.5328-114.9952c-13.6192-16.9984-36.4544-22.9376-57.0368-15.8208a146.3296 146.3296 0 0 1-48.0256 8.0384c-70.144 0-132.352-50.8928-145.2032-118.7328-4.096-21.6064-20.736-38.5536-42.4448-41.8304-22.0672-3.2768-44.6464-5.0176-67.6864-5.0176-21.4528 0-42.5472 1.536-63.232 4.4032-22.3232 3.1232-40.2432 20.48-43.52 42.752-6.912 46.6944-36.0448 118.016-145.7152 118.4256-17.3056 0.0512-33.8944-2.9696-49.3056-8.448-21.0432-7.4752-44.3904-1.4848-58.368 15.9232A462.14656 462.14656 0 0 0 80.4864 348.16c-7.6288 20.0192-2.7648 43.008 13.4656 56.9344 55.5008 47.8208 71.7824 122.88 37.0688 185.1392a146.72896 146.72896 0 0 1-31.6416 39.168c-16.8448 14.7456-23.0912 38.1952-14.5408 58.9312 16.896 41.0112 39.5776 79.0016 66.9696 113.0496 13.9264 17.3056 37.2736 23.1936 58.2144 15.7184 15.4112-5.4784 32-8.4992 49.3056-8.4992 71.2704 0 124.7744 49.408 142.1312 121.2928 4.9664 20.48 21.4016 36.0448 42.24 39.168 22.2208 3.328 44.9536 5.0688 68.096 5.0688 23.3984 0 46.4384-1.792 68.864-5.1712 21.3504-3.2256 38.144-19.456 42.7008-40.5504 14.8992-68.8128 73.1648-119.7568 143.7696-119.7568z"
                        fill="#8C7BFD"></path>
                    <path
                        d="M511.8464 696.3712c-101.3248 0-183.7568-82.432-183.7568-183.7568s82.432-183.7568 183.7568-183.7568 183.7568 82.432 183.7568 183.7568-82.432 183.7568-183.7568 183.7568z m0-265.1648c-44.8512 0-81.3568 36.5056-81.3568 81.3568S466.9952 593.92 511.8464 593.92s81.3568-36.5056 81.3568-81.3568-36.5056-81.3568-81.3568-81.3568z"
                        fill="#FFE37B"></path>
                </svg>
                基础信息
            </el-tag>
            <el-form :model="webInfo" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                <el-form-item label="网站名称" prop="webName">
                    <el-input v-model:value="webInfo.webName"></el-input>
                </el-form-item>

                <el-form-item label="网站标题" prop="webTitle">
                    <el-input v-model:value="webInfo.webTitle"></el-input>
                </el-form-item>

                <el-form-item label="页脚" prop="footer">
                    <el-input v-model:value="webInfo.footer"></el-input>
                </el-form-item>

                <el-form-item label="状态" prop="status">
                    <el-switch v-model:value="webInfo.status"></el-switch>
                </el-form-item>

                <el-form-item label="背景" prop="backgroundImage">
                    <div style="display: flex">
                        <el-input v-model:value="webInfo.backgroundImage"></el-input>
                        <el-image lazy class="table-td-thumb" style="margin-left: 10px"
                            :preview-src-list="[webInfo.backgroundImage]" :src="webInfo.backgroundImage"
                            fit="cover"></el-image>
                    </div>
                    <UploadPicture :isAdmin="true" :prefix="'webBackgroundImage'" style="margin-top: 15px"
                        @addPicture="addBackgroundImage" :maxSize="3" :maxNumber="1"></UploadPicture>
                </el-form-item>

                <el-form-item label="头像" prop="avatar">
                    <div style="display: flex">
                        <el-input v-model:value="webInfo.avatar"></el-input>
                        <el-image lazy class="table-td-thumb" style="margin-left: 10px"
                            :preview-src-list="[webInfo.avatar]" :src="webInfo.avatar" fit="cover"></el-image>
                    </div>
                    <UploadPicture :isAdmin="true" :prefix="'webAvatar'" style="margin-top: 15px"
                        @addPicture="addAvatar" :maxSize="2" :maxNumber="1"></UploadPicture>
                </el-form-item>
            </el-form>
            <div class="myCenter" style="margin-bottom: 22px">
                <el-button type="primary" @click="submitForm('ruleForm')">保存基本信息</el-button>
            </div>
        </div>

        <div>
            <el-tag effect="dark" class="my-tag">
                <svg viewBox="0 0 1024 1024" width="20" height="20" style="vertical-align: -4px">
                    <path
                        d="M767.1296 808.6528c16.8448 0 32.9728 2.816 48.0256 8.0384 20.6848 7.1168 43.52 1.0752 57.1904-15.9744a459.91936 459.91936 0 0 0 70.5024-122.88c7.8336-20.48 1.0752-43.264-15.9744-57.088-49.6128-40.192-65.0752-125.3888-31.3856-185.856a146.8928 146.8928 0 0 1 30.3104-37.9904c16.2304-14.5408 22.1696-37.376 13.9264-57.6a461.27104 461.27104 0 0 0-67.5328-114.9952c-13.6192-16.9984-36.4544-22.9376-57.0368-15.8208a146.3296 146.3296 0 0 1-48.0256 8.0384c-70.144 0-132.352-50.8928-145.2032-118.7328-4.096-21.6064-20.736-38.5536-42.4448-41.8304-22.0672-3.2768-44.6464-5.0176-67.6864-5.0176-21.4528 0-42.5472 1.536-63.232 4.4032-22.3232 3.1232-40.2432 20.48-43.52 42.752-6.912 46.6944-36.0448 118.016-145.7152 118.4256-17.3056 0.0512-33.8944-2.9696-49.3056-8.448-21.0432-7.4752-44.3904-1.4848-58.368 15.9232A462.14656 462.14656 0 0 0 80.4864 348.16c-7.6288 20.0192-2.7648 43.008 13.4656 56.9344 55.5008 47.8208 71.7824 122.88 37.0688 185.1392a146.72896 146.72896 0 0 1-31.6416 39.168c-16.8448 14.7456-23.0912 38.1952-14.5408 58.9312 16.896 41.0112 39.5776 79.0016 66.9696 113.0496 13.9264 17.3056 37.2736 23.1936 58.2144 15.7184 15.4112-5.4784 32-8.4992 49.3056-8.4992 71.2704 0 124.7744 49.408 142.1312 121.2928 4.9664 20.48 21.4016 36.0448 42.24 39.168 22.2208 3.328 44.9536 5.0688 68.096 5.0688 23.3984 0 46.4384-1.792 68.864-5.1712 21.3504-3.2256 38.144-19.456 42.7008-40.5504 14.8992-68.8128 73.1648-119.7568 143.7696-119.7568z"
                        fill="#8C7BFD"></path>
                    <path
                        d="M511.8464 696.3712c-101.3248 0-183.7568-82.432-183.7568-183.7568s82.432-183.7568 183.7568-183.7568 183.7568 82.432 183.7568 183.7568-82.432 183.7568-183.7568 183.7568z m0-265.1648c-44.8512 0-81.3568 36.5056-81.3568 81.3568S466.9952 593.92 511.8464 593.92s81.3568-36.5056 81.3568-81.3568-36.5056-81.3568-81.3568-81.3568z"
                        fill="#FFE37B"></path>
                </svg>
                公告
            </el-tag>
            <el-tag :key="i" v-for="(notice, i) in notices" closable :disable-transitions="false"
                @close="handleClose(notices, notice)">
                {{ notice }}
            </el-tag>
            <el-input class="input-new-tag" v-if="inputNoticeVisible" v-model:value="inputNoticeValue"
                ref="saveNoticeInput" size="small" @keyup.enter="handleInputNoticeConfirm"
                @blur="handleInputNoticeConfirm">
            </el-input>
            <el-button v-else class="button-new-tag" size="small" @click="showNoticeInput()">+ 公告</el-button>
            <div class="myCenter" style="margin-bottom: 22px">
                <el-button type="primary" @click="saveNotice()">保存公告</el-button>
            </div>
        </div>

        <div>
            <el-tag effect="dark" class="my-tag">
                <svg viewBox="0 0 1024 1024" width="20" height="20" style="vertical-align: -4px">
                    <path
                        d="M767.1296 808.6528c16.8448 0 32.9728 2.816 48.0256 8.0384 20.6848 7.1168 43.52 1.0752 57.1904-15.9744a459.91936 459.91936 0 0 0 70.5024-122.88c7.8336-20.48 1.0752-43.264-15.9744-57.088-49.6128-40.192-65.0752-125.3888-31.3856-185.856a146.8928 146.8928 0 0 1 30.3104-37.9904c16.2304-14.5408 22.1696-37.376 13.9264-57.6a461.27104 461.27104 0 0 0-67.5328-114.9952c-13.6192-16.9984-36.4544-22.9376-57.0368-15.8208a146.3296 146.3296 0 0 1-48.0256 8.0384c-70.144 0-132.352-50.8928-145.2032-118.7328-4.096-21.6064-20.736-38.5536-42.4448-41.8304-22.0672-3.2768-44.6464-5.0176-67.6864-5.0176-21.4528 0-42.5472 1.536-63.232 4.4032-22.3232 3.1232-40.2432 20.48-43.52 42.752-6.912 46.6944-36.0448 118.016-145.7152 118.4256-17.3056 0.0512-33.8944-2.9696-49.3056-8.448-21.0432-7.4752-44.3904-1.4848-58.368 15.9232A462.14656 462.14656 0 0 0 80.4864 348.16c-7.6288 20.0192-2.7648 43.008 13.4656 56.9344 55.5008 47.8208 71.7824 122.88 37.0688 185.1392a146.72896 146.72896 0 0 1-31.6416 39.168c-16.8448 14.7456-23.0912 38.1952-14.5408 58.9312 16.896 41.0112 39.5776 79.0016 66.9696 113.0496 13.9264 17.3056 37.2736 23.1936 58.2144 15.7184 15.4112-5.4784 32-8.4992 49.3056-8.4992 71.2704 0 124.7744 49.408 142.1312 121.2928 4.9664 20.48 21.4016 36.0448 42.24 39.168 22.2208 3.328 44.9536 5.0688 68.096 5.0688 23.3984 0 46.4384-1.792 68.864-5.1712 21.3504-3.2256 38.144-19.456 42.7008-40.5504 14.8992-68.8128 73.1648-119.7568 143.7696-119.7568z"
                        fill="#8C7BFD"></path>
                    <path
                        d="M511.8464 696.3712c-101.3248 0-183.7568-82.432-183.7568-183.7568s82.432-183.7568 183.7568-183.7568 183.7568 82.432 183.7568 183.7568-82.432 183.7568-183.7568 183.7568z m0-265.1648c-44.8512 0-81.3568 36.5056-81.3568 81.3568S466.9952 593.92 511.8464 593.92s81.3568-36.5056 81.3568-81.3568-36.5056-81.3568-81.3568-81.3568z"
                        fill="#FFE37B"></path>
                </svg>
                随机名称
            </el-tag>
            <el-tag :key="i" effect="dark" v-for="(name, i) in randomName" closable :disable-transitions="false"
                :type="types[Math.floor(Math.random() * 5)]" @close="handleClose(randomName, name)">
                {{ name }}
            </el-tag>
            <el-input class="input-new-tag" v-if="inputRandomNameVisible" v-model:value="inputRandomNameValue"
                ref="saveRandomNameInput" size="small" @keyup.enter="handleInputRandomNameConfirm"
                @blur="handleInputRandomNameConfirm">
            </el-input>
            <el-button v-else class="button-new-tag" size="small" @click="showRandomNameInput">+ 随机名称</el-button>
            <div class="myCenter" style="margin-bottom: 22px">
                <el-button type="primary" @click="saveRandomName()">保存随机名称</el-button>
            </div>
        </div>

        <div>
            <el-tag effect="dark" class="my-tag">
                <svg viewBox="0 0 1024 1024" width="20" height="20" style="vertical-align: -4px">
                    <path
                        d="M767.1296 808.6528c16.8448 0 32.9728 2.816 48.0256 8.0384 20.6848 7.1168 43.52 1.0752 57.1904-15.9744a459.91936 459.91936 0 0 0 70.5024-122.88c7.8336-20.48 1.0752-43.264-15.9744-57.088-49.6128-40.192-65.0752-125.3888-31.3856-185.856a146.8928 146.8928 0 0 1 30.3104-37.9904c16.2304-14.5408 22.1696-37.376 13.9264-57.6a461.27104 461.27104 0 0 0-67.5328-114.9952c-13.6192-16.9984-36.4544-22.9376-57.0368-15.8208a146.3296 146.3296 0 0 1-48.0256 8.0384c-70.144 0-132.352-50.8928-145.2032-118.7328-4.096-21.6064-20.736-38.5536-42.4448-41.8304-22.0672-3.2768-44.6464-5.0176-67.6864-5.0176-21.4528 0-42.5472 1.536-63.232 4.4032-22.3232 3.1232-40.2432 20.48-43.52 42.752-6.912 46.6944-36.0448 118.016-145.7152 118.4256-17.3056 0.0512-33.8944-2.9696-49.3056-8.448-21.0432-7.4752-44.3904-1.4848-58.368 15.9232A462.14656 462.14656 0 0 0 80.4864 348.16c-7.6288 20.0192-2.7648 43.008 13.4656 56.9344 55.5008 47.8208 71.7824 122.88 37.0688 185.1392a146.72896 146.72896 0 0 1-31.6416 39.168c-16.8448 14.7456-23.0912 38.1952-14.5408 58.9312 16.896 41.0112 39.5776 79.0016 66.9696 113.0496 13.9264 17.3056 37.2736 23.1936 58.2144 15.7184 15.4112-5.4784 32-8.4992 49.3056-8.4992 71.2704 0 124.7744 49.408 142.1312 121.2928 4.9664 20.48 21.4016 36.0448 42.24 39.168 22.2208 3.328 44.9536 5.0688 68.096 5.0688 23.3984 0 46.4384-1.792 68.864-5.1712 21.3504-3.2256 38.144-19.456 42.7008-40.5504 14.8992-68.8128 73.1648-119.7568 143.7696-119.7568z"
                        fill="#8C7BFD"></path>
                    <path
                        d="M511.8464 696.3712c-101.3248 0-183.7568-82.432-183.7568-183.7568s82.432-183.7568 183.7568-183.7568 183.7568 82.432 183.7568 183.7568-82.432 183.7568-183.7568 183.7568z m0-265.1648c-44.8512 0-81.3568 36.5056-81.3568 81.3568S466.9952 593.92 511.8464 593.92s81.3568-36.5056 81.3568-81.3568-36.5056-81.3568-81.3568-81.3568z"
                        fill="#FFE37B"></path>
                </svg>
                随机头像
            </el-tag>
            <div :key="i" style="display: flex" v-for="(avatar, i) in randomAvatar">
                <el-tag style="white-space: normal; height: unset" closable :disable-transitions="false"
                    @close="handleClose(randomAvatar, avatar)">
                    {{ avatar }}
                </el-tag>
                <div>
                    <el-image lazy class="table-td-thumb" style="margin: 10px" :preview-src-list="[avatar]"
                        :src="avatar" fit="cover"></el-image>
                </div>
            </div>

            <el-input class="input-new-tag" v-if="inputRandomAvatarVisible" v-model:value="inputRandomAvatarValue"
                ref="saveRandomAvatarInput" size="small" @keyup.enter="handleInputRandomAvatarConfirm"
                @blur="handleInputRandomAvatarConfirm">
            </el-input>
            <el-button v-else class="button-new-tag" size="small" @click="showRandomAvatarInput">+ 随机头像</el-button>
            <UploadPicture :isAdmin="true" :prefix="'randomAvatar'" style="margin: 10px" @addPicture="addRandomAvatar"
                :maxSize="1" :maxNumber="5"></UploadPicture>
            <div class="myCenter" style="margin-bottom: 22px">
                <el-button type="primary" @click="saveRandomAvatar()">保存随机头像</el-button>
            </div>
        </div>

        <div>
            <el-tag effect="dark" class="my-tag">
                <svg viewBox="0 0 1024 1024" width="20" height="20" style="vertical-align: -4px">
                    <path
                        d="M767.1296 808.6528c16.8448 0 32.9728 2.816 48.0256 8.0384 20.6848 7.1168 43.52 1.0752 57.1904-15.9744a459.91936 459.91936 0 0 0 70.5024-122.88c7.8336-20.48 1.0752-43.264-15.9744-57.088-49.6128-40.192-65.0752-125.3888-31.3856-185.856a146.8928 146.8928 0 0 1 30.3104-37.9904c16.2304-14.5408 22.1696-37.376 13.9264-57.6a461.27104 461.27104 0 0 0-67.5328-114.9952c-13.6192-16.9984-36.4544-22.9376-57.0368-15.8208a146.3296 146.3296 0 0 1-48.0256 8.0384c-70.144 0-132.352-50.8928-145.2032-118.7328-4.096-21.6064-20.736-38.5536-42.4448-41.8304-22.0672-3.2768-44.6464-5.0176-67.6864-5.0176-21.4528 0-42.5472 1.536-63.232 4.4032-22.3232 3.1232-40.2432 20.48-43.52 42.752-6.912 46.6944-36.0448 118.016-145.7152 118.4256-17.3056 0.0512-33.8944-2.9696-49.3056-8.448-21.0432-7.4752-44.3904-1.4848-58.368 15.9232A462.14656 462.14656 0 0 0 80.4864 348.16c-7.6288 20.0192-2.7648 43.008 13.4656 56.9344 55.5008 47.8208 71.7824 122.88 37.0688 185.1392a146.72896 146.72896 0 0 1-31.6416 39.168c-16.8448 14.7456-23.0912 38.1952-14.5408 58.9312 16.896 41.0112 39.5776 79.0016 66.9696 113.0496 13.9264 17.3056 37.2736 23.1936 58.2144 15.7184 15.4112-5.4784 32-8.4992 49.3056-8.4992 71.2704 0 124.7744 49.408 142.1312 121.2928 4.9664 20.48 21.4016 36.0448 42.24 39.168 22.2208 3.328 44.9536 5.0688 68.096 5.0688 23.3984 0 46.4384-1.792 68.864-5.1712 21.3504-3.2256 38.144-19.456 42.7008-40.5504 14.8992-68.8128 73.1648-119.7568 143.7696-119.7568z"
                        fill="#8C7BFD"></path>
                    <path
                        d="M511.8464 696.3712c-101.3248 0-183.7568-82.432-183.7568-183.7568s82.432-183.7568 183.7568-183.7568 183.7568 82.432 183.7568 183.7568-82.432 183.7568-183.7568 183.7568z m0-265.1648c-44.8512 0-81.3568 36.5056-81.3568 81.3568S466.9952 593.92 511.8464 593.92s81.3568-36.5056 81.3568-81.3568-36.5056-81.3568-81.3568-81.3568z"
                        fill="#FFE37B"></path>
                </svg>
                随机封面
            </el-tag>
            <div :key="i" style="display: flex" v-for="(cover, i) in randomCover">
                <el-tag style="white-space: normal; height: unset" closable :disable-transitions="false"
                    @close="handleClose(randomCover, cover)">
                    {{ cover }}
                </el-tag>
                <div>
                    <el-image lazy class="table-td-thumb" style="margin: 10px" :preview-src-list="[cover]" :src="cover"
                        fit="cover"></el-image>
                </div>
            </div>

            <el-input class="input-new-tag" v-if="inputRandomCoverVisible" v-model:value="inputRandomCoverValue"
                ref="saveRandomCoverInput" size="small" @keyup.enter="handleInputRandomCoverConfirm"
                @blur="handleInputRandomCoverConfirm">
            </el-input>
            <el-button v-else class="button-new-tag" size="small" @click="showRandomCoverInput">+ 随机封面</el-button>
            <UploadPicture :isAdmin="true" :prefix="'randomCover'" style="margin: 10px" @addPicture="addRandomCover"
                :maxSize="2" :maxNumber="5"></UploadPicture>
            <div class="myCenter" style="margin-bottom: 40px">
                <el-button type="primary" @click="saveRandomCover()">保存随机封面</el-button>
            </div>
        </div>

        <div>
            <el-button type="danger" @click="resetForm('ruleForm')">重置所有修改</el-button>
        </div>
    </div>
</template>

<script setup>
import UploadPicture from '../../components/common/UploadPicture.vue'
import { nextTick, reactive, inject, toRefs } from 'vue'
import { ElMessage, ElMessageBox } from "element-plus";

// hooks
const common = inject("$common");
const constant = inject("$constant");
const http = inject("$http");

const data = reactive({
    types: ['', 'success', 'info', 'danger', 'warning'],
    inputNoticeVisible: false,
    inputNoticeValue: '',
    inputRandomNameVisible: false,
    inputRandomNameValue: '',
    inputRandomAvatarVisible: false,
    inputRandomAvatarValue: '',
    inputRandomCoverVisible: false,
    inputRandomCoverValue: '',
    webInfo: {
        id: null,
        webName: '',
        webTitle: '',
        footer: '',
        backgroundImage: '',
        avatar: '',
        status: false,
    },
    notices: [],
    randomAvatar: [],
    randomName: [],
    randomCover: [],
    rules: {
        webName: [
            { required: true, message: '请输入网站名称', trigger: 'blur' },
            {
                min: 1,
                max: 10,
                message: '长度在 1 到 10 个字符',
                trigger: 'change',
            },
        ],
        webTitle: [
            { required: true, message: '请输入网站标题', trigger: 'blur' },
        ],
        footer: [{ required: true, message: '请输入页脚', trigger: 'blur' }],
        backgroundImage: [
            { required: true, message: '请输入背景', trigger: 'change' },
        ],
        status: [
            { required: true, message: '请设置网站状态', trigger: 'change' },
        ],
        avatar: [{ required: true, message: '请上传头像', trigger: 'change' }],
    }
});

const getWebInfo = () => {
    http.get(constant.baseURL + '/admin/webInfo/getAdminWebInfo', {}, true)
        .then((res) => {
            if (!common.isEmpty(res.data)) {
                data.webInfo.id = res.data.id
                data.webInfo.webName = res.data.webName
                data.webInfo.webTitle = res.data.webTitle
                data.webInfo.footer = res.data.footer
                data.webInfo.backgroundImage = res.data.backgroundImage
                data.webInfo.avatar = res.data.avatar
                data.webInfo.status = res.data.status
                data.notices = JSON.parse(res.data.notices)
                data.randomAvatar = JSON.parse(res.data.randomAvatar)
                data.randomName = JSON.parse(res.data.randomName)
                data.randomCover = JSON.parse(res.data.randomCover)
            }
        })
        .catch((error) => {
            ElMessage({
                message: error.message,
                type: 'error',
            })
        })
};

getWebInfo();

const addBackgroundImage = (res) => {
    data.webInfo.backgroundImage = res;
};

const addAvatar = (res) => {
    data.webInfo.avatar = res;
};

const addRandomAvatar = (res) => {
    data.randomAvatar.push(res);
};

const addRandomCover = (res) => {
    data.randomCover.push(res);
};

const submitForm = (formName) => {
    $refs[formName].validate((valid) => {
        if (valid) {
            updateWebInfo(data.webInfo);
        } else {
            ElMessage({
                message: '请完善必填项！',
                type: 'error',
            });
        }
    });
};

const resetForm = (formName) => {
    $refs[formName].resetFields();
    getWebInfo();
};

const handleClose = (array, item) => {
    array.splice(array.indexOf(item), 1);
};

const handleInputNoticeConfirm = () => {
    if (data.inputNoticeValue) {
        data.notices.push(data.inputNoticeValue);
    }
    data.inputNoticeVisible = false;
    data.inputNoticeValue = '';
};

const showNoticeInput = () => {
    data.inputNoticeVisible = true;
    nextTick(() => {
        $refs.saveNoticeInput.$refs.input.focus();
    });
};

const saveNotice = () => {
    let param = {
        id: data.webInfo.id,
        notices: JSON.stringify(data.notices),
    };
    updateWebInfo(param);
};

const handleInputRandomNameConfirm = () => {
    if (data.inputRandomNameValue) {
        data.randomName.push(data.inputRandomNameValue);
    }
    data.inputRandomNameVisible = false;
    data.inputRandomNameValue = '';
};

const showRandomNameInput = () => {
    data.inputRandomNameVisible = true;
    nextTick(() => {
        $refs.saveRandomNameInput.$refs.input.focus();
    });
};

const saveRandomName = () => {
    let param = {
        id: data.webInfo.id,
        randomName: JSON.stringify(data.randomName),
    };
    updateWebInfo(param);
};

const handleInputRandomAvatarConfirm = () => {
    if (data.inputRandomAvatarValue) {
        data.randomAvatar.push(data.inputRandomAvatarValue);
    }
    data.inputRandomAvatarVisible = false;
    data.inputRandomAvatarValue = '';
};

const showRandomAvatarInput = () => {
    data.inputRandomAvatarVisible = true;
    nextTick(() => {
        $refs.saveRandomAvatarInput.$refs.input.focus();
    });
};

const saveRandomAvatar = () => {
    let param = {
        id: data.webInfo.id,
        randomAvatar: JSON.stringify(data.randomAvatar),
    };
    updateWebInfo(param);
};

const handleInputRandomCoverConfirm = () => {
    if (data.inputRandomCoverValue) {
        data.randomCover.push(data.inputRandomCoverValue);
    }
    data.inputRandomCoverVisible = false;
    data.inputRandomCoverValue = '';
};

const showRandomCoverInput = () => {
    data.inputRandomCoverVisible = true;
    nextTick(() => {
        $refs.saveRandomCoverInput.$refs.input.focus();
    });
};

const saveRandomCover = () => {
    let param = {
        id: data.webInfo.id,
        randomCover: JSON.stringify(data.randomCover),
    };
    updateWebInfo(param);
};

const updateWebInfo = (value) => {
    ElMessageBox.confirm('确认保存？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'success',
        center: true,
    })
        .then(() => {
            http.post(constant.baseURL + '/webInfo/updateWebInfo', value, true)
                .then((res) => {
                    getWebInfo();
                    ElMessage({
                        message: '保存成功！',
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
                message: '已取消保存!',
            });
        });
};

const {inputNoticeVisible,inputNoticeValue,inputRandomNameValue,inputRandomNameVisible,
    inputRandomAvatarValue,inputRandomAvatarVisible,inputRandomCoverValue,inputRandomCoverVisible,
    webInfo,notices,randomAvatar,randomName,randomCover,rules
} = toRefs(data)

</script>
<style scoped>
.my-tag {
    margin-bottom: 20px !important;
    width: 100%;
    text-align: left;
    background: var(--lightYellow);
    border: none;
    height: 40px;
    line-height: 40px;
    font-size: 16px;
    color: var(--black);
}

.el-tag {
    margin: 10px;
}

.button-new-tag {
    margin: 10px;
    height: 32px;
    line-height: 32px;
    padding-top: 0;
    padding-bottom: 0;
}

.input-new-tag {
    width: 200px;
    margin: 10px;
}

.my-icon {
    cursor: pointer;
    margin-left: 10px;
    font-size: 18px;
    font-weight: bold;
    color: var(--blue);
}

.table-td-thumb {
    border-radius: 2px;
    width: 40px;
    height: 40px;
}
</style>
