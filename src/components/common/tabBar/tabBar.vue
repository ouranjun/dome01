<template>
  <div id="tab-bar">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'tarbar'
}
</script>

<style scoped lang='scss'>
  @import '../../../style/mixin';
  #tab-bar {
    display: flex;
    background: #fff;
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    box-shadow: 0px 1px 5px rgba(0,0,0,0.05);
    z-index:99;
  }
</style>
