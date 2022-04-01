import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosRequestHeaders,
  AxiosResponse,
  ResponseType,
} from 'axios'
import qs from 'qs'
import { ref, Ref } from 'vue-demi'
import { downloadFile } from './utils'

interface CompositionCollection<T, _R = AxiosResponse> {
  data: Ref<T>
  response: Ref<AxiosResponse>
  loading: Ref<boolean>
  error: Ref<Error | undefined>
  task: (payload?: Record<string, any>, config?: AxiosRequestConfig) => Promise<AxiosResponse>
}

type DemiAxiosRequestConfig<T> = AxiosRequestConfig & { formatter: Formatter<T> }

type Formatter<T> = (responseData: any, currentData: T) => T

type AdapterTask = <T>(
  url: string,
  initialData: T,
  formatter?: Formatter<T>
) => CompositionCollection<T>

let service: AxiosInstance
export const customHeaders: Record<string, any> = {}
export const customHeaderBlackMap: Record<string, string[]> = {}

export function create(config: AxiosRequestConfig) {
  service = service != null ? service : axios.create(config)

  service.interceptors.request.use((config) => {
    Object.keys(customHeaders).forEach((key) => {
      if (!(customHeaderBlackMap[key] ?? []).includes(config.url as string)) {
        ;(config.headers as AxiosRequestHeaders)[key] = customHeaders[key]
      }
    })
    return config
  }, Promise.reject)

  return service
}

function getPayloadConfig<T>(
  preConfig: DemiAxiosRequestConfig<T>,
  payload: Record<string, any> = {},
  type: 'fetch' | 'modify',
  urlencoded = false,
  multipart = false
): DemiAxiosRequestConfig<T> {
  if (type === 'modify') {
    if (urlencoded) {
      payload = qs.stringify(payload)
    }

    if (multipart) {
      const formData = new FormData()
      Object.keys(payload).forEach((key) => formData.append(key, payload[key]))
      payload = formData
    }

    preConfig.data = payload
  }

  if (type === 'fetch') {
    preConfig.params = payload
    preConfig.params._t = Date.now()
  }

  return preConfig
}

function createTask<T>(
  type: 'fetch' | 'modify',
  initialData: T,
  preConfig: DemiAxiosRequestConfig<T>,
  urlencoded = false,
  multipart = false
): CompositionCollection<T> {
  const loading = ref(true)
  const error = ref()
  const data = ref(initialData) as Ref<T>
  const response = ref()

  const task = (
    payload?: Record<string, any>,
    config: AxiosRequestConfig = {}
  ): Promise<AxiosResponse> => {
    const taskConfig = Object.assign(
      getPayloadConfig(preConfig, payload, type, urlencoded, multipart),
      config
    )

    return service
      .request(taskConfig)
      .then((res) => {
        response.value = res
        data.value = taskConfig.formatter(res.data.data, data.value)
        loading.value = false

        return res
      })
      .catch((err) => {
        error.value = err
        loading.value = false

        throw err
        // return err
      })
  }

  return {
    loading,
    data,
    error,
    response,
    task
  }
}

const createFetchMethod = (
  method: 'get' | 'head' | 'delete' | 'options',
  responseType: ResponseType = 'json'
): AdapterTask => {
  return <T>(url: string, initialData: T, formatter: Formatter<T> = (v) => v) => {
    const config = {
      url,
      responseType,
      method,
      formatter
    }

    return createTask('fetch', initialData, config)
  }
}

const createModifyMethod = (
  method: 'post' | 'put' | 'patch',
  urlencoded = false,
  multipart = false
): AdapterTask => {
  return <T>(url: string, initialData: T, formatter: Formatter<T> = (v) => v) => {
    const getHeaders = () => {
      if (multipart) return { 'Content-Type': 'multipart/form-data' }
      if (urlencoded) return { 'Content-Type': 'application/x-www-form-urlencoded' }
      return { 'Content-Type': 'application/json' }
    }

    const config: DemiAxiosRequestConfig<T> = {
      url,
      headers: getHeaders(),
      method,
      formatter
    }

    return createTask('modify', initialData, config, urlencoded, multipart)
  }
}

export const useGet = createFetchMethod('get')
export const useHead = createFetchMethod('head')
export const useDelete = createFetchMethod('delete')
export const useOptions = createFetchMethod('options')

export const useGetBlob = createFetchMethod('get', 'blob')
export const useHeadBlob = createFetchMethod('head', 'blob')
export const useDeleteBlob = createFetchMethod('delete', 'blob')
export const useOptionsBlob = createFetchMethod('options', 'blob')

export const usePost = createModifyMethod('post', true)
export const usePut = createModifyMethod('put', true)
export const usePatch = createModifyMethod('patch', true)

export const usePostJSON = createModifyMethod('post')
export const usePutJSON = createModifyMethod('put')
export const usePatchJSON = createModifyMethod('patch')

export const usePostMultipart = createModifyMethod('post', false, true)
export const usePutMultipart = createModifyMethod('put', false, true)
export const usePatchMultipart = createModifyMethod('patch', false, true)

export const download = downloadFile
