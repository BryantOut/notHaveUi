import MD5 from 'js-md5';
import { defineStore } from 'pinia';
import { MessagePlugin } from 'tdesign-vue-next';

import { isLogin, logOn } from '@/api/login';
// import { TOKEN_NAME } from '@/config/global';
// import { store, usePermissionStore } from '@/store';
import { store } from '@/store';

const InitUserInfo = {
  roles: [], // 前端权限模型使用 如果使用请配置modules/permission-fe.ts使用
};

interface isRememberAccountAndPasswordInfoType {
  isRemember: boolean;
  account: string;
}

export const useUserStore = defineStore('user', {
  state: () => ({
    isRememberAccountAndPasswordInfo: {
      isRemember: false,
      account: undefined,
    }, // 是否记住账号密码
    firstEnter: true, // 第一次进入
    isLogin: false, // 是否登录
    LoginName: '暂无登录名', // 管理员登录名
    token: '', // 默认token不走权限
    userInfo: { ...InitUserInfo },
    uploadUrl: undefined,
  }),
  getters: {
    roles: (state) => {
      return state.userInfo?.roles;
    },
  },
  actions: {
    setIsFirstEnter(firstEnter) {
      this.firstEnter = firstEnter;
    },
    async checkLogin() {
      try {
        const res = await isLogin();
        const { IsLogin, TokenId } = res.Data;
        this.isLogin = IsLogin;
        if (!IsLogin) {
          this.token = TokenId;
          // this.logout();
          // localStorage.setItem(TOKEN_NAME, TokenId);
        }
      } catch (e) {
        MessagePlugin.error(e.message);
      }
    },
    async login(userInfo: Record<string, unknown>) {
      try {
        const { account: Name, password: Password, chartCodeIsNone: CodeIsNone, chartCode: Code } = userInfo;
        const res = await logOn({ Name, Password: MD5.hex(Password), CodeIsNone, Code });
        const { Data } = res;
        if (Data) {
          const { IsLogin, TokenId, LoginName } = Data;
          this.isLogin = IsLogin;
          this.token = TokenId;
          this.LoginName = LoginName;
          this.firstEnter = false;
        }
        return Data;
      } catch (e) {
        throw new Error(e.message);
      }
    },
    async getUserInfo() {
      const mockRemoteUserInfo = async (token: string) => {
        if (token === 'main_token') {
          return {
            name: 'td_main',
            roles: ['all'], // 前端权限模型使用 如果使用请配置modules/permission-fe.ts使用
          };
        }
        return {
          name: 'td_dev',
          roles: ['UserIndex', 'DashboardBase', 'login'], // 前端权限模型使用 如果使用请配置modules/permission-fe.ts使用
        };
      };
      const res = await mockRemoteUserInfo(this.token);

      this.userInfo = res;
    },
    async logout() {
      this.token = '';
      this.isLogin = false;
      this.userInfo = { ...InitUserInfo };
    },
    async removeToken() {
      this.token = '';
    },
    setIsRememberAccountAndPasswordInfo(isRememberAccountAndPasswordInfo: isRememberAccountAndPasswordInfoType) {
      this.isRememberAccountAndPasswordInfo = isRememberAccountAndPasswordInfo;
    }
  },
  persist: {
    storage: localStorage,
    paths: ['token', 'userInfo', 'isRememberAccountAndPasswordInfo', 'LoginName'],
    // afterRestore: () => {
    //   const permissionStore = usePermissionStore();
    //   permissionStore.initRoutes();
    // },
  },
});

export function getUserStore() {
  return useUserStore(store);
}
