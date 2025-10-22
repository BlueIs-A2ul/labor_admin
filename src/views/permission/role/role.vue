<template>
  <div class="app-container">
    <div v-if="false" class="searchBar">
      <div>
        <div id="keyWords">
          <div style="width: 45%">权限关键词:&nbsp;</div>
          <el-input v-model="keyWords" placeholder="请输入内容" clearable />
        </div>
      </div>
      <div id="buttons">
        <el-button @click="keyWords = ''">重置</el-button>
        <el-button type="primary" @click="search">搜索</el-button>
      </div>
    </div>

    <div id="permissionTable" :key="refresh">
      <div id="headerPart">
        <div class="c1" style="font-size: 1.15em">权限列表</div>
        <div id="controlBox" class="c1">
          <el-button v-if="false" type="primary" icon="el-icon-circle-plus-outline"
            @click="openAddRoot">新增根级权限</el-button>
        </div>
      </div>

      <div id="table">
        <!-- 父子权限树列表 -->
        <el-table ref="table" :data="permissionsTree" style="width: 100%" :row-style="{ height: '30px' }"
          row-key="keyName" border lazy :load="load" :tree-props="{ children: 'children', hasChildren: 'hasChildren' }">
          <el-table-column label="序号" width="150" align="left">
            <template slot-scope="scope"> {{ scope.$index + 1 }} </template>
          </el-table-column>
          <el-table-column prop="permissionName" label="权限名" min-width="120" align="center" />
          <el-table-column prop="keyName" label="关键字" min-width="200" align="center" />
          <el-table-column prop="gmtCreate" label="创建时间" align="center" />
          <el-table-column label="上次更新" align="center">
            <template slot-scope="scope">
              {{ scope.row.updateBy }} - {{ scope.row.gmtModified }}
            </template>
          </el-table-column>
          <el-table-column v-if="ROOT_ALLOW_MODIFY" label="操作" align="center" width="300">
            <template slot-scope="scope">
              <div style="
                  display: flex;
                  align-items: center;
                  justify-content: flex-start;
                ">
                <el-button @click="openModify(scope.row)">编辑</el-button>
                <el-button type="primary" icon="el-icon-circle-plus-outline"
                  @click="openAddChild(scope.row)">添加子权限</el-button>
                <el-button v-if="scope.row.parentId !== 0" type="danger"
                  @click="delPermission(scope.row)">删除</el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>

        <!-- 新建根级权限 -->
        <el-dialog v-if="ROOT_ALLOW_MODIFY" :visible.sync="isShowAddRoot" title="新建根级权限" :close-on-click-modal="false"
          :close-on-press-escape="false">
          <el-form :model="role" label-width="120px" label-position="left">
            <el-form-item label="权限关键词">
              <div class="keyNameCheckBox">
                <el-button v-for="(item, index) in newRootPermission" :key="index"
                  :type="NPTag == item.id ? item.type : ''" @click="chooseNPTag(index)">
                  {{ item.name }}
                </el-button>
              </div>
            </el-form-item>
            <el-form-item label="权限名">
              <el-input v-model="newPermission.permissionName" type="text" placeholder="权限名, 例如: 用户操作或管理员权限" />
            </el-form-item>
          </el-form>
          <div style="text-align: right">
            <el-button type="danger" @click="cancelAddPermission">取消</el-button>
            <el-button type="primary" @click="addPermission">创建</el-button>
          </div>
        </el-dialog>

        <!-- 新建子级权限 -->
        <el-dialog v-if="ROOT_ALLOW_MODIFY" :visible.sync="isShowAddChild" title="新建子权限" :close-on-click-modal="false"
          :close-on-press-escape="false">
          <el-form :model="role" label-width="120px" label-position="left">
            <el-form-item label="父级权限名">
              <div id="childP">
                <el-tag type="success">{{ parent.key }}</el-tag>
                <span style="font-size: 16px; font-weight: 600">{{
                  parent.permissionName
                }}</span>
              </div>
            </el-form-item>

            <el-form-item label="权限关键词">
              <div class="keyNameCheckBox">
                <el-button v-for="(item, index) in newRootPermission" :key="index"
                  :type="NPTag == item.id ? item.type : ''" @click="chooseNPTag(index)">
                  {{ item.name }}
                </el-button>
              </div>
            </el-form-item>
            <el-form-item label="子权限名">
              <el-input v-model="newPermission.permissionName" type="text" placeholder="权限名, 例如: 用户操作或管理员权限" />
            </el-form-item>
            <el-form-item label="业务领域">
              <el-input v-model="businessArea" type="text"
                placeholder="输入该权限的业务领域(只能是英文), 示例1: teacher, 示例2: userManage" />
            </el-form-item>
          </el-form>
          <div style="text-align: right">
            <el-button type="danger" @click="cancelAddPermission">取消</el-button>
            <el-button type="primary" @click="addPermission">创建</el-button>
          </div>
        </el-dialog>

        <!-- 修改权限信息 -->
        <el-dialog v-if="ROOT_ALLOW_MODIFY" :visible.sync="isShowModify" title="编辑权限" :close-on-click-modal="false"
          :close-on-press-escape="false">
          <el-form :model="role" label-width="120px" label-position="left">
            <el-form-item label="修改权限名">
              <div id="childP">
                <el-input v-model="modifyCache.permissionName" type="text" :placeholder="modifyCache.permissionName" />
              </div>
            </el-form-item>
            <el-form-item label="修改权限关键词">
              <div class="keyNameCheckBox">
                <el-button v-for="(item, index) in newRootPermission" :key="index"
                  :type="NPTag == item.id ? item.type : ''" @click="chooseNPTag(index)">
                  {{ item.name }}
                </el-button>
              </div>
            </el-form-item>
            <el-form-item label="父权限">
              <el-input v-model="newPermission.permissionName" type="text" placeholder="这个后面会改成属性选择" />
            </el-form-item>
          </el-form>
          <div style="text-align: right">
            <el-button type="danger" @click="cancelModify">取消</el-button>
            <el-button type="primary" @click="modify">修改</el-button>
          </div>
        </el-dialog>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

import {
  getKeyName,
  getChildrenList,
  getPermissionById,
} from '@/apis/permissionCtrl'
import {
  clearObj
} from '@/apis/common'

const defaultRole = ref({
  key: '',
  name: '',
  description: '',
  routes: [],
})

const ROOT_ALLOW_MODIFY = ref(false)
const refresh = ref(0)
const keyWords = ref('')
const isShowModify = ref(false)
const modifyCache = ref({
  parentId: 0,
  permissionName: '',
  keyName: '',
  id: '',
})

const search = async () => {
  // TODO 自己写
  if (keyWords.value) {

  }
}

const openModify = async (item) => {
  isShowModify.value = true
  modifyCache.value = JSON.parse(JSON.stringify(item))
}

const getList = async () => {
}

await getList()
</script>

<style lang="scss" scoped>
.app-container {
  .roles-table {
    margin-top: 30px;
  }

  .permission-tree {
    margin-bottom: 30px;
  }

  .searchBar {
    height: 60px;
    padding: 5px 5% 5px 10%;
    width: 100%;
    background-color: #ffffff;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    transition: box-shadow 0.25s ease-in;

    #keyWords {
      display: flex;
      flex-direction: row;
      align-items: center;
      width: 100%;
      color: #838383;
    }

    #buttons {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      width: 12%;
      height: 30px;
    }
  }

  .searchBar:hover {
    box-shadow: 0 0 20px rgba(192, 192, 192, 0.405);
  }
}

:deep(.el-button) {
  letter-spacing: 1px;
  padding: 10px 13px 10px 13px;
}

:deep(.el-input) {
  input {
    height: 30px;
  }
}

:deep(#buttons) {
  .el-button {
    height: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 13px;
  }
}

:deep(#controlBox) {
  .el-button {
    height: 35px;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 135px;
    font-size: 14px;
  }
}

:deep(#changePage) {
  .el-icon {
    line-height: 0;
  }
}

:deep(#childP) {
  .el-button {
    height: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-right: 10px;
  }
}

#childP {
  display: flex;
  flex-direction: row;
  align-items: center;
}

#permissionTable {
  margin-top: 20px;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 25px 2% 30px 2%;
  background-color: #ffffff;
  transition: box-shadow 0.25s ease-in;

  div {
    margin-bottom: 15px;
  }

  #headerPart {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 40px;

    .c1 {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    #controlBox {
      display: flex;
      align-items: center;
      flex-direction: row;
      justify-content: space-evenly;
      height: 40px;
      width: 18%;

      .icon {
        transition: color 0.2s ease-in;
        font-size: 25px;
      }

      .icon:hover {
        color: rgb(88, 241, 241);
      }
    }
  }

  #table {
    width: 100%;
    height: 100%;
  }
}

#permissionTable:hover {
  box-shadow: 0 0 20px rgba(192, 192, 192, 0.405);
}
</style>
