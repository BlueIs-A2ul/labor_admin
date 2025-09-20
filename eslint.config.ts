import { defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript'
import pluginVue from 'eslint-plugin-vue'
import skipFormatting from '@vue/eslint-config-prettier/skip-formatting'
import { globalIgnores } from 'eslint/config'

export default defineConfigWithVueTs(
  {
    name: 'app/files-to-lint',
    files: ['**/*.{ts,mts,tsx,vue}'],
    rules: {
      // Vue组件命名规则，忽略名为index的组件
      'vue/multi-word-component-names': [
        'error',
        {
          ignores: ['index'],
        },
      ],

      // ====================== 代码风格规则 ======================
      // 缩进使用2个空格，switch语句的case缩进1个级别
      indent: ['error', 2, { SwitchCase: 1 }],

      // 字符串使用单引号，允许转义字符和模板字符串
      quotes: ['error', 'single', { avoidEscape: true, allowTemplateLiterals: true }],

      // 语句结束不使用分号
      semi: ['error', 'never'],

      // 对象大括号内必须有空格，嵌套对象除外
      'object-curly-spacing': ['error', 'always', { objectsInObjects: false }],

      // 数组括号内不允许有空格
      'array-bracket-spacing': ['error', 'never'],

      // 函数括号前不允许有空格
      'space-before-function-paren': ['error', 'never'],

      // 箭头函数的箭头前后必须有空格
      'arrow-spacing': ['error', { before: true, after: true }],

      // 禁止多余的空行，最多允许1个空行
      'no-multiple-empty-lines': ['error', { max: 1 }],

      // 禁止行尾有空格
      'no-trailing-spaces': 'error',

      // 逗号后面必须有空格，前面不能有空格
      'comma-spacing': ['error', { before: false, after: true }],

      // 关键字前后必须有空格
      'keyword-spacing': ['error', { before: true, after: true }],

      // ====================== 最佳实践规则 ======================
      // 强制使用严格等于 ===（除null比较外）
      eqeqeq: ['error', 'always', { null: 'ignore' }],

      // 禁止使用eval函数
      'no-eval': 'error',

      // 禁止修改原生对象
      'no-extend-native': 'error',

      // 禁止重复声明变量
      'no-redeclare': 'error',

      // 禁止删除变量
      'no-delete-var': 'error',

      // 禁止使用未定义的变量
      'no-undef': 'error',

      // 禁止使用未使用的变量
      'no-unused-vars': ['error', { vars: 'all', args: 'none' }],

      // 禁止在循环条件中使用未修改的变量
      'no-unmodified-loop-condition': 'error',

      // 禁止直接调用eval的替代形式
      'no-implied-eval': 'error',

      // ====================== Vue特定规则 ======================
      // 允许使用v-html指令
      'vue/no-v-html': 'off',

      // 禁止在计算属性中修改data属性
      'vue/no-side-effects-in-computed-properties': 'error',

      // 禁止在v-for中使用相同的key
      'vue/no-duplicate-attributes': 'error',

      // 强制Vue组件的props定义类型
      'vue/require-prop-types': 'error',

      // 生产环境禁止使用debugger
      'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',

      // ====================== TypeScript特定规则 ======================
      // 强制使用const声明不会被修改的变量
      '@typescript-eslint/prefer-const': 'error',

      // 禁止使用any类型
      '@typescript-eslint/no-explicit-any': 'warn',

      // 强制函数参数有类型注解
      '@typescript-eslint/explicit-function-return-type': 'warn',
    },
  },

  globalIgnores(['**/dist/**', '**/dist-ssr/**', '**/coverage/**']),

  pluginVue.configs['flat/essential'],
  vueTsConfigs.recommended,
  skipFormatting,
)
