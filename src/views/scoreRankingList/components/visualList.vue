<template>
  <div v-if="list.length">
    <div class="guide">
      <div>排名</div>
      <div>姓名</div>
      <div>学号</div>
      <!-- <div>年级</div> -->
      <div>积分</div>
    </div>
    <div ref="container" class="container" :style="{ height: containerHeight }" @scroll="handleScroll">
      <div class="visualList" :style="{ top: listTop }">
        <div v-for="(item, index) in showList" :key="index" :style="{ height: ceilSize + 'px' }">
          <div class="ceil" :style="{ height: ceilSize }">
            <div>{{ start + index + 1 }}</div>
            <div class="avatar">
              <el-avatar :size="avatarSize" :src="item.avatar || defaultAvatar" style="margin-left: -10px;" />
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

</script>

<style lang="scss" scoped>
::-webkit-scrollbar {
  height: 0;
}

.guide {
  width: 100%;
  height: 40px;
  background: #f5f7fa;
  display: flex;
  align-items: center;
  justify-content: space-around;

  div {
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

.container {
  position: relative;
  overflow-y: auto;
  font-size: 14px;
  font-weight: 500;
  line-height: 35px;
  text-align: center;
  padding: 0;

  .visualList {
    position: absolute;
    top: 0;
    width: 100%;

    .ceil {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: space-around;
      border-bottom: 1px solid rgb(218, 218, 218);
      transition: background-color .2s ease;

      .avatar {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        text-align: left;

        div {
          flex: 1;
        }
      }

      &:hover {
        background-color: #f4f4f4;
      }

      div {
        width: 25%;
      }
    }
  }
}
</style>
