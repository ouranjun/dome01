<template>
  <tab-bar>
    <tab-bar-item v-for="item in tabbarLists" :path='item.path' :hasParams='item.hasParams' :hasQuery='item.hasQuery' :geohash="geohash" :key="item.id" class="tab_bar_item">
      <span slot="item-icon" class="iconfont" :class="[item.className, {'active': isActive(item.path)}]"></span>
      <span slot="item-text" class="item_text" :class="{'active': isActive(item.path)}">{{item.txetName}}</span>
    </tab-bar-item>
  </tab-bar>
</template>

<script>
import TabBar from '../common/tabBar/tabBar'
import TabBarItem from '../common/tabBar/tabBarItem.vue'
import { cityGuess } from '@/http/api'
import { mapMutations, mapState } from 'vuex'

export default {
  name: 'mainTabBar',
  data () {
    return {
      tabbarLists: [
        {
          path: '/msite',
          hasQuery: true,
          className: 'icon-zhuye',
          txetName: '外卖',
          id: 1
        },
        {
          path: '/search',
          hasQuery: false,
          hasParams: true,
          className: 'icon-faxian',
          txetName: '搜索',
          id: 2
        },
        {
          path: '/order',
          hasQuery: false,
          className: 'icon-dingdan',
          txetName: '订单',
          id: 3
        },
        {
          path: '/profile',
          hasQuery: false,
          className: 'icon-kehu',
          txetName: '我的',
          id: 4
        }
      ],
      newGeohash: ''
    }
  },
  components: {
    TabBar,
    TabBarItem
  },
  computed: {
    ...mapState([
      'geohash'
    ])
  },
  methods: {
    ...mapMutations(['SAVE_GEOHASH']),
    isActive (path) {
      return this.$route.path.indexOf(path) !== -1
    }
  },
  async beforeMount () {
    if (!this.geohash) {
      const address = await cityGuess({ type: 'guess' })
      this.newGeohash = address.latitude + ',' + address.longitude
    }
    this.SAVE_GEOHASH(this.newGeohash)
  }
}
</script>

<style scoped lang="scss">
  @import '../../style/mixin';
  .tab_bar_item {
    .active {
      color: #3190e8;
    }
    .iconfont {
      font-size: 0.85rem;
    }
  }
</style>
