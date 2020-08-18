import Vue from 'vue'
import axios from 'axios'
import { Toast } from 'mint-ui';

// import { Loading, Message } from 'element-ui';
// 引入路由实例
import router from '@/router/index.js'

// let loading;
axios.defaults.baseURL = 'http://27.223.90.126:9860';
// 请求拦截器
axios.interceptors.request.use(function(config) {
	// 获取token
	if (config.url == '/api/OEP/Login' || config.url == '/api/OEP/ChgPwd') {
		return config;
	}
	if (!sessionStorage.token) {
		Toast({
			message: 'token失效，请重新登录系统！',
			duration: 5000
		});
		// Message.error({
		// 	message: 'token失效，请重新登录系统！',
		// 	onClose: () => {
		// 		router.replace('/login');
		// 		loading.close();
		// 	}
		// });
	}
	config.headers['token'] = sessionStorage.token;
	return config;
}, function(error) {
	// 对请求错误做些什么
	return Promise.reject(error);
});
// 添加响应拦截器
axios.interceptors.response.use(({
	status,
	data
}) => {
	//在这里你可以判断后台返回数据携带的请求码
	// loading.close();
	if (status === 200) {
		return data;
	} else {
		// 非200请求抱错
		Toast('服务异常');
		// throw Error(data.msg || '服务异常');
	}
}, function(error) {
	// 对响应错误做点什么
	return Promise.reject(error);
});
