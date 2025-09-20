import * as fs from 'fs'
import * as path from 'path'

// 读取路由文件
const routerFilePath = path.join(path.resolve(), 'src/router/index.ts')
const routerContent = fs.readFileSync(routerFilePath, 'utf-8')

// 提取所有组件路径
const componentImportRegex = /import\s*\(\s*['"]@\/views\/([^'"]+)['"]\s*\)/g
let match
const componentPaths = new Set()

while ((match = componentImportRegex.exec(routerContent)) !== null) {
  componentPaths.add(match[1])
}

// 转换 @/views 路径为实际的 src/views 路径
const baseDir = path.join(path.resolve(), 'src/views')

// 创建目录和文件
componentPaths.forEach((componentPath) => {
  const fullPath = path.join(baseDir, componentPath)
  const fileExt = path.extname(fullPath) || '.vue'
  const filePath = fileExt === '.vue' ? fullPath : `${fullPath}.vue`
  const dirPath = path.dirname(filePath)

  // 确保目录存在
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true })
    console.log(`创建目录: ${dirPath}`)
  }

  // 确保文件存在
  if (!fs.existsSync(filePath)) {
    // 创建基本的 Vue 组件内容
    const componentName = path.basename(filePath, '.vue')
    const componentContent = `<template>
  <div class="${componentName}">
    <h1>${componentName} 页面</h1>
  </div>
</template>

<script setup lang="ts">
// 组件逻辑
</script>

<style scoped>
/* 组件样式 */
</style>
`

    fs.writeFileSync(filePath, componentContent, 'utf-8')
    console.log(`创建文件: ${filePath}`)
  }
})

console.log('所有页面文件生成完成！')
