<template>
    <div class="container">
        <div class="user">
            <div class="left">
                <div class="user-avatar">
                    <img :src="formatUrl(user.avatar_path)" alt="" />
                    <span class="change-avatar" @click="handleChangeAvatar"> <icon-edit class="pro-opr-icon" />修改头像 </span>
                </div>
                <p class="username"><span class="pre">昵称：</span>{{ user.username }}</p>
                <p class="tel"><span class="pre">电话：</span>{{ user.tel ? user.tel : '无' }}</p>
                <p class="gender"><span class="pre">性别：</span>{{ user.gender }}</p>
                <p class="email"><span class="pre">邮箱：</span>{{ user.email ? user.email : '无' }}</p>
                <p class="date_joined"><span class="pre">注册时间：</span>{{ user.date_joined }}</p>

                <div class="actions">
                    <a-button type="primary" @click="changePwd = true" class="profile-option"> <icon-edit class="pro-opr-icon" />修改密码 </a-button>
                    <a-button type="primary" @click="leaveWsyModal = true" class="profile-option">
                        <icon-face-frown-fill class="pro-opr-icon" />注销账户
                    </a-button>
                    <a-button type="primary" @click="changeUsernameModal = true" class="profile-option"> <icon-user class="pro-opr-icon" />修改昵称 </a-button>
                    <a-button type="primary" @click="changeEmailModal = true" class="profile-option"> <icon-email class="pro-opr-icon" />修改邮箱 </a-button>
                    <a-button type="primary" @click="changeTelModal = true" class="profile-option"> <icon-phone class="pro-opr-icon" />修改手机 </a-button>
                </div>
            </div>
            <div class="right">
                <div class="learned-chapters">
                    <h3>学习过的章节</h3>
                    <div class="chapters">
                        <a-scrollbar style="overflow-x: hidden; overflow-y: scroll; height: 200px; width: 400px; padding: 6px 0">
                            <div style="height: 1000px; width: 400px">
                                <template v-for="cha in user.learned_chapter" :key="cha.name" v-if="user.learned_chapter && user.learned_chapter.length > 0">
                                    <p class="chapter">
                                        {{ cha.name }}
                                    </p>
                                </template>
                                <template v-else>
                                    <p>快去开始学习吧！</p>
                                </template>
                            </div>
                        </a-scrollbar>
                    </div>
                </div>

                <div class="saved-animes">
                    <h3 class="">收藏的动漫</h3>
                    <div class="animes">
                        <a-scrollbar style="overflow-x: hidden; overflow-y: scroll; height: 200px; width: 400px; padding: 6px 0">
                            <div style="height: 2000px; width: 400px">
                                <template v-if="user.anime && user.anime.length > 0">
                                    <div class="anime" v-for="anime in user.anime" :key="anime.name">
                                        <div class="poster">
                                            <img :src="anime.poster" alt="" />
                                            <p class="animename">
                                                {{ anime.name }}
                                            </p>
                                        </div>
                                    </div>
                                </template>
                                <template v-else><p>你还没有收藏过的动漫哦！</p> </template>
                            </div>
                        </a-scrollbar>
                    </div>
                </div>
            </div>

            <a-modal v-model:visible="changeAvatar" simple :footer="false" width="400px">
                <template #title> 修改头像 </template>
                <div class="avatars">
                    <a-scrollbar style="overflow-x: hidden; overflow-y: scroll; height: 320px; width: 336px">
                        <div style="height: 320px; width: 336px; display: flex; flex-wrap: wrap; align-content: flex-start">
                            <template v-if="avatars.length > 0">
                                <div v-for="avatar in avatars" :key="avatar.path" class="avatar-box">
                                    <label :for="avatar.id + 'avatar'"> <img :src="avatar.path" alt="" class="avatar" /></label>

                                    <input type="radio" v-model="pickedAvatar" :value="avatar.id" :id="avatar.id + 'avatar'" />
                                </div>
                            </template>
                        </div>
                    </a-scrollbar>
                </div>
                <div class="btns">
                    <a-button type="primary" @click="changeavatar">确定</a-button>
                    <a-button @click="changeAvatar = false">取消</a-button>
                </div>
            </a-modal>
            <a-modal v-model:visible="changePwd" simple :footer="false">
                <template #title> 修改密码 </template>
                <div>
                    <a-input-password
                        :style="{ width: '320px', marginBottom: '20px' }"
                        placeholder="请输入新密码"
                        allow-clear
                        v-model.trim="pwd1"
                        ref="pwd1Ref" />
                    <a-input-password :style="{ width: '320px' }" placeholder="请再次输入新密码" allow-clear v-model.trim="pwd2" ref="pwd2Ref" />
                </div>
                <div class="btns">
                    <a-button type="primary" @click="changepwd">确定</a-button>
                    <a-button @click="changePwd = false">取消</a-button>
                </div>
            </a-modal>
            <a-modal v-model:visible="changeUsernameModal" simple :footer="false">
                <template #title> 修改昵称 </template>
                <div>
                    <a-input
                        :style="{ width: '320px', marginBottom: '20px' }"
                        placeholder="输入你的新昵称"
                        allow-clear
                        v-model.trim="newUname"
                        ref="newNameRef" />
                </div>
                <div class="btns">
                    <a-button type="primary" @click="changeUsername">确定</a-button>
                    <a-button @click="changeUsernameModal = false">取消</a-button>
                </div>
            </a-modal>
            <a-modal v-model:visible="leaveWsyModal" simple :footer="false">
                <template #title> 注销账户 </template>
                <div>
                    <p>注销账户将会清除您的所有学习数据以及个人数据！</p>
                </div>
                <div class="btns">
                    <a-button type="primary" @click="confirmLeave" status="danger">确定</a-button>
                    <a-button @click="leaveWsyModal = false">取消</a-button>
                </div>
            </a-modal>
            <a-modal v-model:visible="changeEmailModal" simple :footer="false">
                <template #title> 修改邮箱 </template>
                <div>
                    <a-input :style="{ width: '320px', marginBottom: '20px' }" placeholder="输入新的邮箱" allow-clear v-model.trim="newMail" ref="newMailRef" />
                </div>
                <div class="btns">
                    <a-button type="primary" @click="changeMail">确定</a-button>
                    <a-button @click="changeEmailModal = false">取消</a-button>
                </div>
            </a-modal>
            <a-modal v-model:visible="changeTelModal" simple :footer="false">
                <template #title> 修改手机 </template>
                <div>
                    <a-input :style="{ width: '320px', marginBottom: '20px' }" placeholder="输入新的手机号" allow-clear v-model.trim="newTel" ref="newTelRef" />
                </div>
                <div class="btns">
                    <a-button type="primary" @click="changeTel">确定</a-button>
                    <a-button @click="changeTelModal = false">取消</a-button>
                </div>
            </a-modal>
        </div>
    </div>
</template>

<script setup lang="ts">
import formatUrl from '@/plugin/fn'
import { useUserStore } from '@/stores'
import { ref, onMounted } from 'vue'
import { getAvatar, getProfile, updateUser, changePassword, LeaveWsy } from '@/request/api'
import { infoNotify, successNotify, errorNotify } from '@/plugin/notification'
import { useRouter } from 'vue-router'
import { UserSpace, Avatar } from '@/types'
import { isAxiosError } from 'axios'
import { handleResError } from '@/plugin/ff'

const router = useRouter()
const userStore = useUserStore()
const user = ref<Partial<UserSpace>>({})
const avatars = ref<Array<Avatar>>([])

// 弹窗
const changeAvatar = ref(false),
    changePwd = ref(false),
    leaveWsyModal = ref(false),
    changeUsernameModal = ref(false),
    changeEmailModal = ref(false),
    changeTelModal = ref(false)

const pwd1 = ref(''),
    pwd2 = ref(''),
    pwd1Ref = ref<HTMLInputElement>(),
    pwd2Ref = ref<HTMLInputElement>()

// 修改密码
const changepwd = async () => {
    if (pwd1.value === '' || pwd2.value === '') {
        pwd1Ref.value?.focus()
        infoNotify('注意', '请先输入新的密码！')
        return
    }
    if (pwd1.value !== pwd2.value) {
        pwd1Ref.value?.focus()
        infoNotify('注意', '两次输入的密码不一致')
        return
    }
    try {
        const res = await changePassword({
            uid: user.value.id!,
            username: user.value.username!,
            pwd1: pwd1.value,
            pwd2: pwd2.value,
        })
        console.log(res.data)
        if (res.data.verified) {
            successNotify('修改成功！')
            changePwd.value = false
            localStorage.removeItem('wsy-token')
            userStore.clearUser()
            router.push({ name: 'category' })
        } else {
            pwd1Ref.value!.focus()
            errorNotify(res.data.msg)
        }
    } catch (err) {
        if (isAxiosError(err)) {
            handleResError(err)
        } else {
            console.log(err)
            errorNotify('出错啦！请稍后重试')
        }
    }
}

// 修改头像
const pickedAvatar = ref()
const changeavatar = async () => {
    const res = await updateUser(user.value.id!, {
        avatar: pickedAvatar.value,
    })
    userStore.setUser(res.data)
    successNotify('修改成功！')
    user.value.avatar_path = res.data.avatar_path
    changeAvatar.value = false
}

// 修改昵称
const newUname = ref(''),
    newNameRef = ref<HTMLInputElement>()

const changeUsername = async () => {
    if (newUname.value === '' || !newUname.value) {
        infoNotify('注意', '请先输入新的用户名！')
        newNameRef.value!.focus()
        return
    }
    try {
        const res = await updateUser(user.value.id!, {
            username: newUname.value,
        })
        userStore.setUser(res.data)
        user.value.username = res.data.username
        successNotify('修改成功！')
        changeUsernameModal.value = false
    } catch (err) {
        if (isAxiosError(err)) {
            handleResError(err, '昵称被占用！')
            newNameRef.value?.focus()
        } else errorNotify('出错啦！')
    }
}

// 注销账号
const confirmLeave = async () => {
    const res = await LeaveWsy({
        status: 'leaved',
        uid: user.value.id!,
        username: user.value.username!,
    })
    if (!res.data.verified) {
        errorNotify('注销失败，请稍后重试！')
        leaveWsyModal.value = false
        return
    }
    userStore.clearUser()
    localStorage.removeItem('wsy-token')
    leaveWsyModal.value = false
    successNotify('注销成功！')
    router.push({
        name: 'category',
    })
}

// 修改邮箱
const newMail = ref(''),
    newMailRef = ref<HTMLInputElement>()
const changeMail = async () => {
    const rule = `^[a-zA-Z0-9]([._+-]?[a-zA-Z0-9])*@[a-zA-Z0-9]([._+-]?[a-zA-Z0-9])*\.[a-zA-Z]{2,4}$`
    const re = new RegExp(rule)
    if (!re.test(newMail.value)) {
        errorNotify('请输入合法邮箱！')
        newMailRef.value?.focus()
        return
    }
    try {
        const res = await updateUser(user.value.id!, {
            email: newMail.value,
        })
        userStore.setUser(res.data)
        user.value.email = res.data.email
        successNotify('修改成功！')
        changeEmailModal.value = false
    } catch (err) {
        if (isAxiosError(err)) {
            handleResError(err, '请输入新的合法邮箱！！')
            newTelRef.value?.focus()
        } else errorNotify('出错啦！')
    }
}

// 修改手机号
const newTel = ref(''),
    newTelRef = ref<HTMLInputElement>()
const changeTel = async () => {
    const rule = `/^(13[0-9]|14[01456879]|15[0-3,5-9]|16[2567]|17[0-8]|18[0-9]|19[0-3,5-9])d{8}$/`
    const re = new RegExp(rule)
    if (!re.test(newTel.value)) {
        errorNotify('请输入合法手机号！')
        newTelRef.value?.focus()
        return
    }
    try {
        const res = await updateUser(user.value.id!, {
            tel: newTel.value,
        })
        userStore.setUser(res.data)
        user.value.tel = res.data.tel
        successNotify('修改成功！')
        changeTelModal.value = false
    } catch (err) {
        if (isAxiosError(err)) {
            handleResError(err, '手机号被占用！')
            newTelRef.value?.focus()
        } else errorNotify('出错啦！')
    }
}

onMounted(async () => {
    const res = await getProfile(userStore.user.id!)
    // console.log(res.data)
    user.value = res.data
})

const handleChangeAvatar = async () => {
    const res = await getAvatar()
    // console.log(res.data)
    avatars.value = res.data
    changeAvatar.value = true
}
</script>

<style lang="scss" scoped>
.container {
    width: 100%;
    height: calc(100vh - 70px);
    margin: 0 auto;
    display: flex;
    justify-content: center;
    align-items: center;

    .user {
        max-width: 800px;
        // background-color: #fff;
        background-color: var(--chapterbg);
        border-radius: 10px;
        padding: 30px;
        box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
        display: flex;

        .user-avatar {
            width: 140px;
            overflow: hidden;
            margin: 0 auto;
            display: flex;
            justify-content: center;
            flex-direction: column;
            align-items: center;

            img {
                border-radius: 50%;
                // box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
            }
            .change-avatar {
                font-size: 12px;
                margin-top: 5px;
                margin-bottom: 5px;
                padding: 2px 6px;
                &:hover {
                    cursor: pointer;
                    // background-color: #f3f3f3;
                    background-color: var(--sidebaropthoverbg);
                    border-radius: 3px;
                }
            }
        }

        .left p {
            font-size: 16px;
            margin-bottom: 6px;
            &:last-child {
                margin-bottom: 0;
            }
        }

        .actions {
            display: flex;
            // justify-content: space-between;
            margin-top: 10px;
            flex-wrap: wrap;

            .pro-opr-icon {
                margin-right: 3px;
            }

            button {
                padding: 2px 12px;
                font-size: 12px;
                margin-bottom: 10px;
                margin-right: 8px;
                display: flex;
                align-items: center;
                background-color: #395cec;
                &:nth-child(3n) {
                    margin-right: 0;
                }
            }
        }
    }

    .right {
        margin-left: 30px;

        h3 {
            font-weight: 400;
            font-size: 16px;
            padding-bottom: 6px;
            border-bottom: 1px solid #333;
        }
    }
    .saved-animes {
        margin-top: 20px;
    }

    .chapters {
        // width: 400px;
        // height: 200px;
        // margin-bottom: 20px;
        // padding-top: 6px;
        // overflow-y: scroll;
        // overflow-x: hidden;

        .chapter {
            margin-bottom: 5px;
        }
    }

    .animes {
        display: flex;
        // width: 400px;
        // height: 200px;
        // overflow-x: scroll;
        // overflow-y: hidden;
        flex-wrap: wrap;
        justify-content: space-between;
        // padding-top: 6px;

        .poster {
            margin-right: 4px;
            margin-bottom: 4px;
            overflow: hidden;
            width: 60px;
            height: 80px;
            position: relative;
            img {
                width: 60px;
                height: 80px;
                border-radius: 2px;
                object-fit: cover;
            }

            .animename {
                position: absolute;
                bottom: 4px;
                left: 4px;
                color: #fff;
                font-size: 12px;
            }
        }
    }
}
.avatars {
    display: flex;
    flex-wrap: wrap;
    align-content: flex-start;
    width: 100%;
    // height: 360px;
    // overflow-y: scroll;
    // overflow-x: hidden;
}

.avatar-box {
    width: 70px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-right: 14px;
    margin-bottom: 14px;

    .avatar {
        margin-bottom: 6px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        border-radius: 4px;
        &:hover {
            filter: brightness(0.8);
        }
    }

    input {
        border-color: #333;
    }
}

.btns {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 20px;
    button {
        margin-right: 20px;
        padding: 4px 22px;
    }
}
</style>
