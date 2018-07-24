import { fetch } from "../services/articles";
import { goHome, goLogin } from "../utils/history";

export default {
  namespace: "articles",

  state: {
    data: null,
    pageSize: 1,
    err: null
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

  effects: {
    *fetch({ payload }, { call, put, select }) {
      try {
        const { articles: state } = yield select();

        const articles = yield call(fetch, {
          pageIndex: payload.pageIndex,
          pageSize: state.pageSize
        });
        yield put({ type: "fetch_success", articles });
      } catch (err) {
        yield put({ type: "fetch_fail", err });
      }
    }
  },

  reducers: {
    fetch_success(state, action) {
      return { ...state, data: action.articles };
    },
    fetch_fail(state, action) {
      return { ...state, err: action.articles, data: null };
    }
  }
};
