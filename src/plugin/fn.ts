const formatUrl = (baseUrl: string | undefined) => {
    return baseUrl ? `http://www.tanhong.cc${baseUrl}` : '#'
}
// return baseUrl ? `http://127.0.0.1:8000${baseUrl}` : '#'
// function awaitWrap<T, U = any>(
//     promise: Promise<T>
// ): Promise<[U | null, T | null]> {
//     return promise
//         .then<[null, T]>((res: T) => [null, res])
//         .catch<[U, null]>((err) => [err, null])
// }
// export { formatUrl, awaitWrap }
export default formatUrl
