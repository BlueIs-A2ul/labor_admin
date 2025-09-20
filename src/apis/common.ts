/** 各页面通用api  */
import request from '@/utils/request'

export type ClearableObject = Record<string, any>

/**
 * 递归清空对象的value
 * @param obj 传入一个地址
 */
export function clearObj(obj: ClearableObject) {
  Object.keys(obj).forEach((key) => {
    if (Array.isArray(obj[key])) {
      obj[key] = []
    } else if (obj[key] === null) {
      obj[key] = null
    } else if (typeof obj[key] === 'object') {
      clearObj(obj[key])
    } else if (typeof obj[key] === 'boolean') {
      obj[key] = false
    } else if (key === 'parentId' || key === 'numberLimit') {
      // 存在指定key时的特殊处理
      obj[key] = 0
    } else {
      obj[key] = ''
    }
  })
}

/**
 * 用于权限管理中，在深度嵌套的对象数组里插入新元素
 * 嵌套的是children
 * @param arr 传入需要添加新元素的数组的指针
 * @param node 需要插入的新元素
 * @param parentId 插入的父权限的id
 */
export function deepInsertChild<
  T extends { id: number | string; children?: T[]; hasChildren?: boolean },
>(arr: T[], node: T, parentId: number | string) {
  const newArr: T[] = []

  arr.forEach((item) => {
    if (item.id == parentId) {
      if (item.children == null) {
        item.children = []
      }
      item.children.push(node)
      if (!item.hasChildren) {
        item.hasChildren = true
      }
    } else {
      if (item.children && item.children.length > 0) {
        item.children = deepInsertChild(item.children, node, parentId)
      }
    }
    newArr.push(item)
  })

  return newArr
}

/**
 * 递归删除嵌套数组中特定元素，还可以优化，目前大概想法是再传入一个数组用来存储子级权限一支的父子d，如: [1,2,3,4]
 * @param arr 进行操作的数组，传入的是指针
 * @param id 对比关键字，该项目中一般是用于删除特定id的权限，所以一般传id就行
 */
export function deepDeleteChild<
  T extends {
    id: number | string
    children?: T[]
    hasChildren?: boolean
    parentId?: number | string
  },
>(arr: T[], id: number | string) {
  const newArr: T[] = []

  arr.forEach((item) => {
    if (item.id == id) {
      if (!item.parentId && item.children && item.hasChildren && item.children.length == 1) {
        item.hasChildren = false
      }
    } else {
      if (item.children && item.children.length > 0) {
        item.children = deepDeleteChild(item.children, id)
      }
      newArr.push(item)
    }
  })

  return newArr
}

/**
 * 根据 parentId和权限名 查找嵌套数组中是否存在某元素
 * @param arr 被查找的嵌套数组
 * @param parentId  被查找的元素的父元素id
 * @param name 被查找元素的name， 权限树中可能存在创建者在同一父权限下创建名称重复的name的情况
 * @return 存在则返回true, 否则为false
 */
export function deepSearchChild<
  T extends {
    id: number | string
    children?: T[]
    hasChildren?: boolean
    parentId?: number | string
    permissionName?: string
    keyName?: string
  },
>(arr: T[], parentId: number | string, name: string, keyName: string) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].parentId == parentId && arr[i].permissionName == name && arr[i].keyName == keyName) {
      return true
    } else {
      if (arr[i].children && arr[i].children!.length > 0) {
        deepSearchChild(arr[i].children as T[], parentId, name, keyName)
      }
    }
  }
}

/**
 * 根据id深度查找目标对象，并返回，
 * @param arr 被查找的数组
 * @param id 查找id
 * @return 查找到的元素
 */
export function deepFindElement<
  T extends {
    id: number | string
    children?: T[]
    hasChildren?: boolean
    parentId?: number | string
  },
>(arr: T[], id: number | string) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].id == id) {
      return arr[i]
    } else {
      if (arr[i].children && arr[i].children!.length > 0) {
        deepFindElement(arr[i].children as T[], id)
      }
    }
  }
}

/**
 * 修改目标对象，返回新数组, 可以优化
 * @param arr 数组
 * @param newPermission 修改后新的元素
 * @return 修改后的新数组
 */
export function deepUpdateChild<
  T extends {
    id: number | string
    children?: T[]
    hasChildren?: boolean
    parentId?: number | string
  },
>(arr: T[], newPermission: T) {
  const newArr: T[] = []

  arr.forEach((item) => {
    if (item.id == newPermission.id) {
      item = newPermission
    } else {
      if (item.children && item.children.length > 0) {
        item.children = deepUpdateChild(item.children, newPermission)
      }
    }
    newArr.push(item)
  })

  return newArr
}

/**
 * 树状数组扁平化
 * @param arr 需要扁平化的树状数组
 * @return 处理后的扁平化数组
 */

export function flatten<
  T extends {
    id: number | string
    children?: T[]
    hasChildren?: boolean
    parentId?: number | string
  },
>(arr: T[]): T[] {
  let res: T[] = []
  const out = []

  res = res.concat(arr)
  while (res.length) {
    const fir = res.shift() as T
    if (fir!.children!.length) {
      res = res.concat(fir.children as T[])
    }
    out.push(fir)
  }

  return out
}

/**
 * 快速检查对象的属性值是否存在未填值
 * @param 待检查的对象
 * @return 存在空值则为false，否则为true
 */
export function isObjHasEmpty(obj: ClearableObject) {
  let hasEmpty = false
  Object.keys(obj).forEach((v) => {
    if (obj[v] == '' || obj[v].length == 0) {
      hasEmpty = true
    }
  })
  return hasEmpty
}

/**
 * 获取当前时间的yyyy-mm-dd格式，
 * @param 不需要参数
 * @return yyyy-mm-dd 格式日期字符串
 */
export function getTimeNow() {
  return new Date().toISOString().slice(0, 19).replaceAll('T', ' ')
}

/**
 * 上传图片，传入file，api会自动append进formData， 接口返回OSS里对应的url
 * @param file 上传的图片，类型为file
 * @return res.data --> 上传的文件在OSS中可供访问的url
 */
export function uploadFile(file: File) {
  const fd = new FormData()
  fd.append('file', file)
  return request({
    url: '/data/file/upload',
    method: 'POST',
    data: fd,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}

/**
 * 删除已经上传的文件
 * @param url 已经上传的文件在OSS中的url
 * @return
 */
export function deleteFile(url: string) {
  return request({
    url: '/data/file/removeObject',
    method: 'DELETE',
    data: {
      body: url,
    },
  })
}

/**
 * 从 对象数组 arr1中过滤去除arr2中的元素
 * @param {T[]} arr1 源数组
 * @param {T[]} arr2 被剔除的数组
 * @param {string} keyName 根据指定属性进行过滤的键名
 */
export function filterArrByArr<T extends Record<string, any>>(
  arr1: T[],
  arr2: T[],
  keyName: string,
) {
  let newArr: T[] = []
  newArr = arr1.filter((item) => {
    return !arr2.some((each) => {
      return each[keyName] === item[keyName]
    })
  })
  return newArr
}

/**
 * 计算两个yyyy-mm-dd格式日期相隔多少天
 * @param {string} day1 yyyy-mm-dd 格式日期
 * @param {string} day2 yyyy-mm-dd 格式日期
 * @returns 两个yyyy-mm-dd格式日期相隔多少天
 */
export function calculate(day1: string, day2: string) {
  const msPerDay = 1000 * 60 * 60 * 24 // 一天的毫秒数
  const newDay1 = new Date(day1)
  const newDay2 = new Date(day2)
  const utc1 = Date.UTC(newDay1.getFullYear(), newDay1.getMonth(), newDay1.getDate())
  const utc2 = Date.UTC(newDay2.getFullYear(), newDay2.getMonth(), newDay2.getDate())
  const result = Math.floor((utc2 - utc1) / msPerDay)
  return result
}

/**
 * 生成由字母和数字组成的随机码, 默认6位
 * @param {number} num 生成的随机码位数
 */
export function getRandomCode(num = 6) {
  const base = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let res = ''
  let i = 0

  do {
    const randomCode = Math.floor(Math.random() * base.length)
    res += base[randomCode]
    i++
  } while (i < num)

  return res
}

/**
 * 判断两个数组是否含有的元素相同, 顺序无关
 * @param {Array} arr1
 * @param {Array} arr2
 * @returns
 */
export function isArrEqual<T>(arr1: T[], arr2: T[]) {
  return arr1.length === arr2.length && arr1.every((role) => arr2.includes(role))
}
