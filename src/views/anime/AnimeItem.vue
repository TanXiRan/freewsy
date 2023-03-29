<template>
    <div class="anime" @click="handleClick">
        <div class="poster">
            <img :src="anime.poster" alt="" />
        </div>
        <div class="info">
            <h3>{{ anime.name }}</h3>
            <div class="actions">
                <icon-thumb-up @click="handleThume" :class="thumed ? 'active-btn' : ''" class="thume" />
                <icon-heart @click="handleLike(anime.id)" :class="userStore.animes.indexOf(anime.id) !== -1 ? 'active-btn' : ''" class="like" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { updateUser } from '@/request/api'
import { successNotify, infoNotify } from '@/plugin/notification'
import { useUserStore } from '@/stores'
import { Anime } from '@/types'

defineProps<{
    anime: Anime
}>()

const userStore = useUserStore()

const handleClick = () => {
    console.log('click')
}

const liked = ref(false)
const thumed = ref(false)

const handleThume = () => {
    thumed.value = !thumed.value
    infoNotify('注意', '点赞成功！')
}

const handleLike = async (id: number) => {
    const res = await updateUser(userStore.user.id!, {
        anime: [id],
    })

    console.log(res.data)
    userStore.setUser(res.data)
    const index = userStore.animes.indexOf(id)

    if (index === -1) {
        infoNotify('注意', '取消收藏成功！')
        return
    }
    successNotify('收藏成功！')
}
</script>

<style lang="scss" scoped>
.anime {
    width: 220px;
    background-color: #fff;
    margin-right: 20px;
    margin-bottom: 20px;
    box-shadow: -11px 9px 14px rgba(0, 0, 0, 0.2);
    display: flex;
    flex-direction: column;
    color: #fff;
    position: relative;
    transition: all 0.3s ease;

    &:hover {
        cursor: pointer;
        box-shadow: -11px 9px 14px transparent;
    }
    .poster {
        width: 100%;
        overflow: hidden;
        height: 340px;
        img {
            height: 100%;
            object-fit: cover;
            transition: all 0.3s ease;
            &:hover {
                filter: blur(0.5px);
                filter: brightness(0.9);
            }
        }
    }

    .info {
        position: absolute;
        bottom: 20px;
        left: 10px;
        right: 10px;

        h3 {
            font-size: 20px;
        }
    }

    .actions {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        .thume,
        .like {
            display: flex;
            align-items: center;
        }

        svg {
            width: 20px;
            height: 20px;
            z-index: 5;
            margin-right: 5px;
            color: rgba(239, 239, 239);
            transition: all 0.3s;
            fill: rgb(239, 239, 239);
            &:hover {
                cursor: pointer;
                transform: scale(1.2);
                color: rgb(252, 40, 7);
                fill: rgb(252, 40, 7);
            }

            &.active-btn {
                color: rgb(252, 40, 7);
                fill: rgb(252, 40, 7);
            }
        }
    }
}
</style>
