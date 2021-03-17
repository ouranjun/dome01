<template>
  <div class="food_container">
    <div class="clearfixed">
    <head-top goBack='true' :headTitle="$route.query.title">
    </head-top>
    </div>
    <dropdown-menu>
      <dropdown-item v-model="value1" :options="option1" />
      <dropdown-item v-model="value2" :options="option2" />
    </dropdown-menu>
    <!-- 商家列表 -->
    <section class="shop_list_container">
      <shoplist v-if="latitude" :geohash="geohash" :restaurantCategoryId="restaurant_category_id" :restaurantCategoryIds="restaurant_category_ids" :sortByType="sortByType" :deliveryMode="delivery_mode" :confirmSelect="confirmStatus" :supportIds="support_ids"></shoplist>
    </section>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import headTop from '@/components/header/header'
import { DropdownMenu, DropdownItem } from 'vant'
import Shoplist from '../../components/shoplist/shoplist.vue'
import { msiteAddress } from '@/http/api'

export default {
  name: 'food',
  data () {
    return {
      geohash: '', // city传递过来的地址geohash
      foodTitle: '', // 排列左侧头部标题
      restaurant_category_id: '', // 食品类型id值
      restaurant_category_ids: '', // 筛选类型的id
      sortBy: '', // 筛选条件
      category: null, // category分类左侧数据
      categoryDetail: null, // category分类右侧的详细数据
      sortByType: null, // 根据何种方式排序
      Delivery: null, // 配送方式根据
      Activity: null, // 商家支持活动数据
      delivery_mode: null, // 选中的配送方式
      support_ids: [], // 选中的商铺活动列表
      filterNum: 0, // 所选中的所有样式的集合
      confirmStatus: false, // 所选中的所有样式的集合
      value1: 0,
      value2: 'a',
      option1: [
        { text: '全部商品', value: 0 },
        { text: '新款商品', value: 1 },
        { text: '活动商品', value: 2 }
      ],
      option2: [
        { text: '智能排序', value: 'a' },
        { text: '距离最近', value: 'b' },
        { text: '销量最高', value: 'c' },
        { text: '起送价最低', value: 'd' },
        { text: '配送速度最快', value: 'e' },
        { text: '评价最高', value: 'f' }
      ]
    }
  },
  components: {
    headTop,
    DropdownMenu,
    DropdownItem,
    Shoplist
  },
  created () {
    this.initData()
  },
  computed: {
    ...mapState(['latitude', 'longitude'])
  },
  methods: {
    ...mapMutations(['RECORD_ADDRESS']),
    // 初始化获取数据
    async initData () {
      // 获取从msite页面传递过来的参数
      this.geohash = this.$route.query.geohash
      this.restaurant_category_id = this.$route.query.restaurant_category_id
      // 防止刷新vuex状态管理消失 重新请求
      if (!this.latitude) {
        const res = await msiteAddress(this.geohash)
        this.RECORD_ADDRESS(res)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .clearfixed {
    height: 1.8rem;
  }
</style>
