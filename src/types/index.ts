export interface AxiosRequestConfig {
    url: string
    method?: string
    token?: boolean
    data?: any
    params?: any
}

type CatChapter = {
    id: number
    name: string
}

type Category = {
    id: number
    name: string
    en_name: string
    chapter_set: Array<CatChapter>
}

type SimpleCharacter = {
    ping: string
    pian: string
    spelling: string
    spelling_path: string
}

type Chapter = {
    id: number
    name: string
    category: string
    en_category: string
    path: string
    character_set: Array<SimpleCharacter>
}

type ChapterWithFullChara = {
    id: number
    name: string
    category: string
    en_category: string
    path: string
    character_set: Array<FullCharacter>
}

type Anime = {
    id: number
    name: string
    abstract: string
    poster: string
    score: string
    categories: Array<string>
}

// type Hiragana = {
//     ping: string
//     pian: string
//     spelling: string
//     spelling_path: string
// }

type Word = {
    name: string
    explanation: string
    pronounce_url: string
}

type FullCharacter = {
    id: number
    chapter: string
    ping: string
    pian: string
    pian_path: string
    ping_path: string
    pro_skill: string
    pro_skill_image_path: string
    spelling: string
    spelling_path: string
    memory: string
    memory_path: string
    scene_gif_path: string
    scene_text: string
    scene_cn_text: string
    scene_text_from: string
    scene_spelling_path: string
    word_set: Array<Word>
}

type User = {
    id?: number
    username?: string
    gender?: string
    tel?: string
    avatar?: string
    avatar_path?: string
    max_score?: number
    email?: string
    min_time?: number
    date_joined?: string
    learned_chapter: Array<number>
    anime: Array<number>
}

type UserSpace = {
    id?: number
    username?: string
    gender?: string
    tel?: string
    avatar?: string
    avatar_path?: string
    max_score?: number
    email?: string
    min_time?: number
    date_joined?: string
    learned_chapter: Array<Chapter>
    anime: Array<Anime>
}

type Avatar = {
    id: number
    path: string
}

type ResError = {
    msg: string
    code: number | undefined
}
export type {
    CatChapter,
    Chapter,
    Category,
    Anime,
    // Hiragana,
    User,
    UserSpace,
    Avatar,
    FullCharacter,
    SimpleCharacter,
    ChapterWithFullChara,
    Word,
    ResError,
}
// export { type Anime }
