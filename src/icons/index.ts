import SvgIcon from '@/components/SvgIcon/SvgIcon.vue' // 导入SVG图标组件

export default function registerSvgIcon(app: any) {
  // 全局注册SVG图标组件
  app.component('svg-icon', SvgIcon)

  // 使用import.meta.glob动态导入所有SVG文件
  // 第二个参数{ eager: true }表示立即导入所有匹配的模块
  const svgModules = import.meta.glob('./svg/*.svg', { eager: true })

  // 遍历所有导入的SVG模块
  Object.keys(svgModules).forEach((key) => {
    // 不需要额外处理，Vite会自动处理SVG文件
    // 这里的导入主要是为了确保SVG文件被打包进应用
  })
}
