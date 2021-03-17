<template>
  <div id="app">
      <transition name="router-fade" mode="out-in">
        <keep-alive>
          <router-view v-if="$route.meta.keepAlive"></router-view>
        </keep-alive>
      </transition>
      <transition name="router-fade" mode="out-in">
          <router-view v-if="!$route.meta.keepAlive"></router-view>
      </transition>
  <main-tab-bar v-if="$route.meta.footer"></main-tab-bar>
  <svg-icon></svg-icon>
  </div>
</template>

<script>
import mainTabBar from './components/mainTabBar/mainTabBar.vue'
import svgIcon from './components/common/svg/svg.vue'

export default {
  name: 'App',
  components: {
    mainTabBar,
    svgIcon
  }
}
</script>

<style lang="scss">
  @import './style/common';
.router-fade-enter-active, .router-fade-leave-active {
 transition: opacity .3s;
}
.router-fade-enter, .router-fade-leave-active {
 opacity: 0;
}
.icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
</style>
