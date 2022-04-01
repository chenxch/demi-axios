export function downloadFile(blob: Blob, filename: string) {
  if ('download' in document.createElement('a')) {
    // 非IE下载
    const a = document.createElement('a')
    a.download = filename
    a.style.display = 'none'
    a.href = window.URL.createObjectURL(blob)
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(a.href)
    document.body.removeChild(a)
  } else {
    // navigator.msSaveBlob(blob, filename)
  }
}
