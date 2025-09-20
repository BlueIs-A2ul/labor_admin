<script setup lang="ts"></script>

<template>
  <h1>You did it!</h1>
  <p>
    Visit <a href="https://vuejs.org/" target="_blank" rel="noopener">vuejs.org</a> to read the
    documentation
  </p>
</template>

<style lang="scss">
.el-table--scrollable-x .el-table__body-wrapper {
  overflow-x: hidden;
}
::-webkit-scrollbar {
  width: 4px;
  height: 0;
  background-color: rgba(202, 202, 202, 0.185);
}
::-webkit-scrollbar-corner {
  background-color: transparent;
}
::-webkit-scrollbar-thumb {
  border-radius: 5px;
  background-color: #206be6;
}
::-webkit-scrollbar-button {
  display: none;
}
::-webkit-scrollbar-track {
  background-color: #83838300;
}
.el-picker-panel__footer {
  display: flex;
  justify-content: right;
}
.el-message-box__btns {
  display: flex;
  justify-content: right;
}
.el-table__body-wrapper {
  height: 100%;
}
</style>
