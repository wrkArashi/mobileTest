import Vue from 'vue'
import Router from 'vue-router'
import Tabbar from '../components/Tabbar.vue'
Vue.use(Router)
let router = new Router({
	routes: [{
		path: '/Login',
		alias: '/',
		name: 'Login',
		component: () => import('../views/Login.vue')
	}, {
		path: '/test/',
		name: 'Tabbar',
		component: Tabbar,
		children: [{
			path: 'User',
			name: 'User',
			component: () => import('../views/User.vue')
		}, {
			path: 'Histoary',
			name: 'Histoary',
			component: () => import('../views/Histoary.vue')
		}, {
			path: 'Appointment',
			name: 'Appointment',
			component: () => import('../views/Appointment.vue')
		}, {
			path: 'Manager',
			name: 'Manager',
			component: () => import('../views/Manager.vue')
		}, {
			path: 'Group',
			name: 'Group',
			component: () => import('../views/Group.vue')
		}, {
			path: 'UserList',
			name: 'UserList',
			component: () => import('../views/UserList.vue')
		}, {
			path: 'Bank',
			name: 'Bank',
			component: () => import('../views/Bank.vue')
		}, {
			path: 'SignUp',
			name: 'SignUp',
			component: () => import('../views/SignUp.vue')
		}]
	}, {
		path: '/testStart',
		name: 'testStart',
		component: () => import('../views/Start.vue')
	}, {
		path: '/testDetail/:id',
		name: 'testDetail',
		props: true,
		component: () => import('../views/Detail.vue')
	}]
})

export default router
