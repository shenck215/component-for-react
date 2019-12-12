import 'whatwg-fetch';
import * as queryString from 'querystring';

/**
 * 带有timeout的_fetch
 * @param fetchPromise
 * @param timeout {number} 延迟时间
 */
const _fetch = (fetchPromise: Promise<Response>, timeout: number) => {
  let timeoutAction: any;
  const timerPromise = new Promise((resolve, reject) => {
    timeoutAction = () => {
      reject('timeout');
    };
  });
  setTimeout(() => {
    timeoutAction();
  }, timeout);
  return Promise.race([fetchPromise, timerPromise]);
};

export interface ResponeData {
  errcode: string | number;
  status: string | number;
  error?: string;
  msg?: string;
  errmsg?: string;
}

/**
 * fetchFn 对window.fetch的封装，方面统一管理
 * @param url {String<URL>} 请求地址
 * @param data {Object<JSON>} 请求参数
 * @param option {Object<JSON>} 额外的fetch可配置参数
 */
const request = (url = '', data?: {}, option?: RequestInit) => {
  let json: any = {
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    timeout: 10000,
    body: queryString.stringify(data || {}),
    credentials: 'include',
  };

  if (option) {
    const { headers, method } = option;
    if (headers && headers['Content-Type'] == 'application/json') {
      option.body = JSON.stringify(data);
      headers['dataType'] = 'json';
    }
    json = {
      ...json,
      ...option,
    };

    /**
     * 如果method为get,
     * get方式不允许body传参，
     * 只能url传参
     */
    if (method && method.toLocaleLowerCase() === 'get') {
      url = `${url}?${json.body}`;
      delete json.body;
    }
  }
  return new Promise((resolve, reject) => {
    _fetch(fetch(url, json), json.timeout)
      .then((res: Response) => {
        return res.json();
      })
      .then((data: ResponeData) => {
        if (Number(data.status) !== 0) {
          console.log(data.error || data.msg || data.errmsg || '请求失败');
        }
        resolve(data);
      })
      .catch((error) => {
        let msg;
        switch (error.toString()) {
          case 'TypeError: Failed to fetch':
            msg = '请求失败';
            break;
          case 'timeout':
            msg = '请求超时';
            break;
          default:
            msg = '请求失败';
        }
        console.log(msg);
        const data = { errcode: 1, status: 1, msg } as ResponeData;
        resolve(data);
      });
  });
};

export default request;
