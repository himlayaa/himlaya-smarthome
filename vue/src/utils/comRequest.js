import axios from "axios";

const instance = axios.create({
  // baseURL: "http://whlt.51job-ideal.com", //baseURL会在发送请求时拼接在url头部
  timeout: 5000,
  headers: {
    "Content-Type": "application/json;charset=utf-8",
  },
});



axios.defaults.withCredentials = true; //true允许跨域

if (process.env.NODE_ENV === "production") {
  /*第二层if，根据.env文件中的VUE_APP_FLAG判断是生产环境还是测试环境*/
  if (process.env.VUE_APP_FLAG === "pro") {
    //production 生产环境
    axios.defaults.baseURL = "http://localhost:8080";
  } else {
    //test 测试环境
    axios.defaults.baseURL = "";
  }
} else {
  //dev 开发环境
  axios.defaults.baseURL = "http://localhost:8080";
}

//请求拦截
instance.interceptors.request.use(
  function (config) {
    console.log("全局请求拦截");
    console.log(config);
    return config;
  },
  function (err) {
    return Promise.reject(err);
  }
);

//响应拦截
instance.interceptors.response.use(
  (response) => {
    // 如果返回的状态码为200，说明接口请求成功，可以正常拿到数据
    // 否则的话抛出错误
    if (response.status === 200) {
      return Promise.resolve(response);
    } else {
      return Promise.reject(response);
    }
  },
  // 服务器状态码不是2开头的的情况
  (error) => {
    if (error.response.status) {
      switch (error.response.status) {
        // 401: 未登录
        case 401:
          router.replace({
            path: "/login",
            query: {
              redirect: router.currentRoute.fullPath,
            },
          });
          break;
        case 403:
          this.$message("管理员权限已修改请重新登录");
          // 清除sessionStorage
          // store.commit("qiut");
          // 跳转登录页面，并将要浏览的页面fullPath传过去，登录成功后跳转需要访问的页面
          setTimeout(() => {
            router.replace({
              path: "/login",
              query: {
                redirect: router.currentRoute.fullPath,
              },
            });
          }, 1000);
          break;
        // 404请求不存在
        case 404:
          this.$message("请求页面飞到火星去了");
          break;
      }
      return Promise.reject(error.response);
    }
  }
);

//封装get请求
export function get(url, params) {
  return instance.get(url, {
    params,
  });
}

//封装post请求
export function post(url, data) {
  return instance.post(url, data);
}


// import { post } from "../../utils/request";  调用
