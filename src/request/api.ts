import instance from '.'
import { User } from '@/types'

type TokenData = {
    username: string
    password: string
}
const getToken = (data: TokenData) => {
    return instance({
        method: 'POST',
        url: '/token/',
        data,
    })
}

type VerifyData = {
    token: string
}
const verifyToken = (data: VerifyData) => {
    return instance({
        method: 'POST',
        url: '/token/verify/',
        data,
    })
}

type RefreshData = {
    refresh: string
}
const refreshToken = (data: RefreshData) => {
    return instance({
        method: 'POST',
        url: '/token/refresh/',
        data,
    })
}

type RegisterForm = {
    username: string
    password: string
    email: string
}

const register = (data: RegisterForm) => {
    console.log(data)
    return instance({
        method: 'POST',
        url: '/register/',
        data,
    })
}

const getCategory = () => {
    return instance({
        method: 'GET',
        url: '/categories',
    })
}

const getChapter = () => {
    return instance({
        method: 'GET',
        url: '/chapters',
    })
}

const getChapterWithFullChara = (cid: string) => {
    return instance({
        method: 'GET',
        url: `/chapters/${cid}`,
    })
}

const getSimpleCharacter = () => {
    return instance({
        method: 'GET',
        url: `/game/characters/`,
    })
}

const getUser = (id: number) => {
    return instance({
        method: 'GET',
        url: `/users/${id}`,
    })
}

const updateUser = (id: number, data: Partial<User>) => {
    return instance({
        method: 'PATCH',
        url: `/users/${id}`,
        data,
    })
}

const getAnime = () => {
    return instance({
        method: 'GET',
        url: '/animes',
    })
}

const getProfile = (id: number) => {
    return instance({
        method: 'GET',
        url: `/profiles/${id}`,
    })
}

const getAvatar = () => {
    return instance({
        method: 'GET',
        url: `/avatars`,
    })
}

type ChangePwdForm = {
    uid: number
    username: string
    pwd1: string
    pwd2: string
}
const changePassword = (data: ChangePwdForm) => {
    return instance({
        method: 'POST',
        url: '/pwd/change/',
        data,
    })
}

type LeaveForm = {
    status: string
    uid: number
    username: string
}
const LeaveWsy = (data: LeaveForm) => {
    return instance({
        method: 'POST',
        url: `/leave/`,
        data,
    })
}

export {
    getToken,
    refreshToken,
    verifyToken,
    register,
    getAnime,
    getUser,
    getCategory,
    getChapter,
    getAvatar,
    getChapterWithFullChara,
    getProfile,
    getSimpleCharacter,
    LeaveWsy,
    changePassword,
    updateUser,
}
