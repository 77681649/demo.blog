import { getLoginStatus, login } from "../services/user";
import { goHome, goLogin } from "../utils/history";
import { effects } from "dva/saga";
import { save } from "../services/article";

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

  effects: {
    *save({ payload }, { call, put }) {
      try {
        yield call(save, payload);
        yield put({ type: "save_success", payload });
      } catch (err) {
        yield put({ type: "save_fail" });
      }
    }
  },

  reducers: {
    show_article_dialog(state, action) {
      return action.article;
    },

    save_success(state, action) {
      return action.article;
    },

    save_fail(state, action) {
      return null;
    }
  }
};
