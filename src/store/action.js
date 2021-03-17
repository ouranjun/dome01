import { getAddressList, getUser } from '../http/api'
import {
  GET_USERINFO,
  SAVE_ADDRESS
} from './mutation-type'

export default {
  async getUserInfo ({
    commit
  }) {
    const res = await getUser()
    commit(GET_USERINFO, res)
  },
  async saveAddress ({
    commit,
    state
  }) {
    if (state.removeAddress.length > 0) return
    const address = await getAddressList(state.userInfo.user_id)
    commit(SAVE_ADDRESS, address)
  }
}
