<p align="center">
  <br>
  <img width="400" src="https://raw.githubusercontent.com/chenxch/pic-image/master/20220404/demixaxios.3ltif7eee300.webp" alt="logo of demi-axios repository">
  <br>
  <br>
</p>

<p align='center'>
<a href="https://github.com/chenxch/demi-axios/blob/main/README.md">English</a> | <b>简体中文</b>
</p>

# demi-axios
[![NPM version](https://img.shields.io/npm/v/demi-axios?color=a1b858&label=)](https://www.npmjs.com/package/demi-axios)

- 🦾 基于vue-demi开发的兼容vue2/vue3使用的useAxios组合式API。

## 安装

```bash
# npm
npm i demi-axios

# yarn
yarn add demi-axios

# pnpm
pnpm i demi-axios
```
## 使用样例
### 初始化
```ts
// init 
import { create } from 'demi-axios'
import type { AxiosInstance } from 'axios'

const axios: AxiosInstance = create({/* axiosOptions */})

// axios.interceptors.response.use((response) => {
//   ...
//   return response
// }, (error) => {
//   return Promise.reject(error)
// })
```
### 使用
```ts
// Usage
// use***(initialData, url, Formatter(responseData, currentData))

import { useGet } from 'demi-axios'

const { data, loading, task, error, response } = useGet(
  {}, 
  'https://jsonplaceholder.typicode.com/posts/1',
  (responseData, currentData)=>{
    // process
    return responseData
  }
)
// data : Ref<T> Return value
// loading : Ref<boolean>
// task(playload, config)
// error : Ref<T>
// response : Ref<T>

// example 1
task({params: 'demi'}).then((res) => {
  console.log(res)
})

// example 2
await task()
console.log(data.value)
consoe.log(response.value)
```


## API
### Fetch json
useGet<br/>
useHead<br/>
useDelete<br/>
useOptions<br/>

### Fetch Blob
useGetBlob<br/>
useHeadBlob<br/>
useDeleteBlob<br/>
useOptionsBlob<br/>

### Modify application/json
usePost<br/>
usePut<br/>
usePatch<br/>

### Modify application/x-www-form-urlencoded
usePostEncoded<br/>
usePutEncoded<br/>
usePatchEncoded<br/>

### Modify multipart/form-data
usePostMultipart
usePutMultipart
usePatchMultipart


FAQ
<details>
<summary>1. data.value 为 undefined</summary><br>

服务器返回的默认数据格式为 {data:any}。 如果你是{}，你可以在拦截器中做一层数据处理。

```ts
axios.interceptors.response.use((response) => {
  // ...
  return { data:response }
}, (error) => {
  return Promise.reject(error)
})
```

<br></details>