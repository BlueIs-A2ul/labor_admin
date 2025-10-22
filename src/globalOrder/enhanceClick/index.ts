//TODO deepseek重构代码鲁棒性待测试
import type { DirectiveBinding, ObjectDirective } from 'vue'

interface ClickOutsideElement extends HTMLElement {
  __vueClickOutside__?: (event: MouseEvent) => void
}

function handleClickOutside(
  el: ClickOutsideElement,
  binding: DirectiveBinding,
  event: MouseEvent,
): void {
  const target = event.target as Node
  let currentNode: Node | null = target

  // 检查是否点击了允许穿透的元素
  while (currentNode && currentNode !== document.body) {
    if (
      currentNode.nodeType === Node.ELEMENT_NODE &&
      (currentNode as Element).classList?.contains('allow-click-through')
    ) {
      return
    }
    currentNode = currentNode.parentNode
  }

  // 如果点击的是元素外部，则调用绑定的方法
  if (!el.contains(target)) {
    if (typeof binding.value === 'function') {
      binding.value(event)
    } else {
      console.warn('v-click-outside 指令应该绑定一个函数')
    }
  }
}

const ClickOutsideDirective: ObjectDirective<ClickOutsideElement> = {
  beforeMount(el: ClickOutsideElement, binding: DirectiveBinding) {
    // 创建事件处理函数
    const handler = (event: MouseEvent) => handleClickOutside(el, binding, event)

    // 保存引用以便卸载时使用
    el.__vueClickOutside__ = handler

    // 添加事件监听
    document.addEventListener('mousedown', handler)
  },

  unmounted(el: ClickOutsideElement) {
    // 移除事件监听
    if (el.__vueClickOutside__) {
      document.removeEventListener('mousedown', el.__vueClickOutside__)
      delete el.__vueClickOutside__
    }
  },
}

export default ClickOutsideDirective
