<template>
  <div v-if="list.length">
    <div class="guide">
      <div>排名</div>
      <div>姓名</div>
      <div>学号</div>
      <!-- <div>年级</div> -->
      <div>积分</div>
    </div>
    <div
      ref="container"
      class="container"
      :style="{ height: containerHeight }"
      @scroll="handleScroll"
    >
      <div class="visualList" :style="{ top: listTop }">
        <div v-for="(item, index) in showList" :key="index" :style="{ height: ceilSize + 'px' }">
          <div class="ceil" :style="{ height: ceilSize }">
            <div>{{ start + index+1 }}</div>
            <div class="avatar">
              <el-avatar :size="avatarSize" :src="item.avatar || defaultAvatar" style="margin-left: -10px;"/>
              <div style="margin-left: 165px">{{ item.name }}</div>
            </div>
            <div>{{ item.studentId }}</div>
            <!-- <div>{{ item.department }}</div -->
            <div>{{ item.score }}</div>
          </div>
        </div>
        <div class="bar" :style="{ height: barHeight }" />
      </div>
    </div>
  </div>
  <el-empty v-else :image-size="300" />
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'ScoreRankVisualList',
  props: {
    // 待渲染的列表
    list: {
      type: Array,
      required: true,
      default: []
    },
    // 视口区域内渲染出来的列表项数量
    showNumber: {
      type: Number,
      default: 20
    },
    // 单个列表项的高度
    ceilSize: {
      type: Number,
      required: true
    },
    avatarSize: {
      type: [Number, String],
      default: 38
    }
  },
  computed: {
    // 渲染在视口区域内的列表项
    showList() {
      return this.list.slice(this.start, this.end)
    },
    // 虚拟列表容器高度
    containerHeight() {
      return this.ceilSize * this.showNumber + 'px'
    },
    // 撑开容器高度
    barHeight() {
      return this.ceilSize * 4 + 'px'
    },
    // 列表滚动时动态改变的scrollTop值
    listTop() {
      return this.start * this.ceilSize + 'px'
    },
    ...mapGetters(['defaultAvatar'])
  },
  data() {
    return {
      start: 0,
      end: this.showNumber,
      vlist: []
    }
  },
  created() {
    // console.log(this.list,'list');
  },
  methods: {
    handleScroll() {
      const scrollTop = this.$refs.container.scrollTop
      this.start = Math.floor(scrollTop / this.ceilSize)
      this.end = this.start + this.showNumber
    }
  }
}
</script>

<style lang="scss" scoped>
::-webkit-scrollbar{
    height: 0;
}
.guide{
    width: 100%;
    height: 40px;
    background: #f5f7fa;
    display: flex;
    align-items: center;
    justify-content: space-around;
    div{
        display: flex;
        align-items: center;
        justify-content: center;
    }
}
.container{
    position: relative;
    overflow-y: auto;
    font-size: 14px;
    font-weight: 500;
    line-height: 35px;
    text-align: center;
    padding: 0;
    .visualList{
        position: absolute;
        top: 0;
        width: 100%;
        .ceil{
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: space-around;
            border-bottom: 1px solid rgb(218, 218, 218);
            transition: background-color .2s ease;
            .avatar{
                display: flex;
                align-items: center;
                justify-content: flex-start;
                text-align: left;
                div{
                    flex: 1;
                }
            }
            &:hover{
                background-color: #f4f4f4;
            }
            div{
                width: 25%;
            }
        }
    }
}
</style>
