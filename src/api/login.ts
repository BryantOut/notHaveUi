import { request } from '@/utils/request';

// 检测是否登录接口
export function isLogin() {
  return request.get<any>({
    url: '/Login/IsLogin',
  });
}

// 管理后台登录接口
export function logOn(data) {
  return request.post<any>({
    url: '/Login/LogOn',
    data,
  });
}