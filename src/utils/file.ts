/**
 * 下载处理器
 * @param name 文件名称
 * @param data 数据
 */
export const handleDownload = (name, data) => {
  const fileUrl = window.URL.createObjectURL(
    new Blob([data], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    }),
  )
  const a = document.createElement('a')
  a.style.display = 'none'
  a.href = fileUrl
  a.setAttribute('download', name)
  document.body.appendChild(a)
  a.click()
  window.URL.revokeObjectURL(a.href)
  document.body.removeChild(a)
}
