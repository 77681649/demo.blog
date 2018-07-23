import { getLoginStatus, login } from "../services/user";
import { delay } from "dva/saga";
import { goHome, goLogin } from "../utils/history";

export default {
  namespace: "user",

  state: {
    logined: false,
    logining: false
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
    *login({ payload }, { call, put, race }) {
      try {
        yield call(login, payload.username, payload.password);
        yield put({ type: "login_success" });
        yield call(goHome);
      } catch (error) {
        yield put({ type: "login_fail", error });
      }
    },
    *check_status({ payload }, { call, put }) {
      try {
        const { logined } = yield call(getLoginStatus);
        debugger;
        if (!logined) {
          throw new Error("need sign in");
        }
      } catch (err) {
        yield call(goLogin);
      }
    }
  },

  reducers: {
    login(state, action) {
      return { ...state, logining: true, errmessage: null };
    },

    login_success(state, action) {
      return { ...state, logining: false, errmessage: null };
    },

    login_fail(state, action) {
      return { ...state, logining: false, errmessage: action.error.message };
    }
  }
};
