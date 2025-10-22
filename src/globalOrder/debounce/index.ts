/**
 * 防抖指令, 该指令是简单实现, 默认600毫秒按钮禁用防止频繁操作
 * @param el - 指令绑定的元素
 * @param binding - 指令绑定的值和其他信息
 */

import type { Directive, DirectiveBinding } from 'vue'

function debounce(el: HTMLElement, binding: DirectiveBinding) {
  el.addEventListener('click', () => {
    if (!(el as any).disabled) {
      ;(el as any).disabled = true
      setTimeout(
        () => {
          ;(el as any).disabled = false
        },
        binding.value || 6 * 100,
      )
    }
  })
}

const debounceDirective: Directive = {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    debounce(el, binding)
  },
}

export default debounceDirective
