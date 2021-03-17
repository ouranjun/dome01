<template>
  <div class="tab_bar_item" @click="goItem(path, geohash)">
    <slot class="item_icon" name="item-icon"></slot>
    <slot class="item_text" name="item-text"></slot>
  </div>
</template>

<script>
export default {
  name: 'tabBarItem',
  methods: {
    goItem (path, geohash) {
      if (this.$route.path !== path) {
        if (this.hasQuery) {
          this.$router.push({ path, query: { geohash } })
        } else if (this.hasParams) {
          this.$router.push(path + '/' + geohash)
        } else {
          this.$router.push(path)
        }
      }
    }
  },
  props: ['path', 'geohash', 'hasQuery', 'hasParams']
}
</script>

<style lang='scss' scoped>
  @import '../../../style/mixin';
  .tab_bar_item {
    flex: 1;
    text-align: center;
    height: 1.95rem;
    font-size: 0.55rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin-top: 0.1rem;
  }
</style>
