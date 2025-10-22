<template>
  <div class="container">
    <el-dialog title="教师信息" :visible.sync="dialogTableVisible" width="30%" :close-on-click-modal="false"
      :before-close="close">
      <el-form :model="teacherInfo" label-width="80px">
        <el-form-item label="姓名">
          <el-input v-model="teacherInfo.name" show-word-limit style="width: 80%" />
        </el-form-item>
        <el-form-item label="职称">
          <el-input v-model="teacherInfo.title" show-word-limit style="width: 80%" />
        </el-form-item>
        <el-form-item label="联系方式">
          <el-input placeholder="请输入内容" v-model="teacherInfo.contact.电话" style="width: 80%; margin-bottom: 10px;">
            <template slot="prepend">电话 </template>
          </el-input>
          <el-input placeholder="请输入内容" v-model="teacherInfo.contact.邮箱" style="width: 80%; margin-bottom: 10px;">
            <template slot="prepend">邮箱 </template>
          </el-input>
          <el-input placeholder="请输入内容" v-model="teacherInfo.contact.QQ" style="width: 80%; margin-bottom: 10px;">
            <template slot="prepend">QQ </template>
          </el-input>
          <el-input placeholder="请输入内容" v-model="teacherInfo.contact.微信" style="width: 80%">
            <template slot="prepend">微信 </template>
          </el-input>
        </el-form-item>
        <el-form-item label="性别">
          <el-select placeholder="请选择性别" v-model="teacherInfo.sex"
            :value="teacherInfo.sex == 1 ? '男' : `${teacherInfo.sex === 0 ? '女' : ''}`" style="width: 80%;">
            <el-option label="男" value="1" />
            <el-option label="女" value="0" />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="close">取 消</el-button>
        <el-button type="primary" v-if="!isUpdate" @click="handleCreate" :disabled="createDisabled">提交</el-button>
        <el-button type="primary" v-else @click="handleUpdate" :disabled="updateDisabled">修改</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { addTeacher, updateTeacher } from '@/apis/teacher'
const props = {
  visible: {
    type: Boolean,
    default: false
  },
  teacher: {
    type: Object,
    default: () => {
      return {}
    }
  },
  isUpdate: {
    type: Boolean,
    default: false
  }
}

const teacherInfo = {
  name: '',
  title: '',
  sex: '',
  contact: {
    电话: '',
    邮箱: '',
    QQ: '',
    微信: ''
  }
}

</script>

<style lang="scss" scoped>
:deep(.el-scrollbar__wrap) {
  overflow: auto;
}

:deep(.el-input-group__prepend) {
  padding: 0 15px;
}

.dialog-footer {
  display: flex;
  flex-direction: row;
  margin-left: 60%;
}
</style>
