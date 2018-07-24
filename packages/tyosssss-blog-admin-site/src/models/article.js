import { getLoginStatus, login } from "../services/user";
import { goHome, goLogin } from "../utils/history";
import { effects } from "dva/saga";

export default {
  namespace: "article",

  state: null,

  subscriptions: {
    setup({ dispatch, history }) {
      // eslint-disable-line
      // history.listen(() => {
      //   if (history.location.pathname !== "/secret/admin/login") {
      //     dispatch({ type: "check_status" });
      //   }
      // });
    }
  },

  effects: {},

  reducers: {
    show_article_dialog(state, action) {
      return action.article;
    }
  }
};
