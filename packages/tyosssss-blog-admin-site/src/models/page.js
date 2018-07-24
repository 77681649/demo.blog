import { getLoginStatus, login } from "../services/user";
import { goHome, goLogin } from "../utils/history";

export default {
  namespace: "page",

  state: {
    index: {
      showArticleDialog: false
    }
  },

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
      return { ...state, index: { ...state.index, showArticleDialog: true } };
    },

    hidden_article_dialog(state, action) {
      return { ...state, index: { ...state.index, showArticleDialog: false } };
    }
  }
};
