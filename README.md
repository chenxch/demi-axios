# demi-axios
[![NPM version](https://img.shields.io/npm/v/demi-axios?color=a1b858&label=)](https://www.npmjs.com/package/demi-axios)

- 🦾 Based on vue-demi, useAxios written by compositionApi supports vue2/vue3.

## Installation

```bash
# npm
npm i demi-axios

# yarn
yarn add demi-axios

# pnpm
pnpm i demi-axios
```
## Usage Example
### init
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
### Usage
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
<summary>1. data.value is undefined</summary><br>

The default data format returned by the server is {data:any}. If you are {}, you can do a layer of data processing in the interceptor.

```ts
axios.interceptors.response.use((response) => {
  // ...
  return { data:response }
}, (error) => {
  return Promise.reject(error)
})
```

<br></details>