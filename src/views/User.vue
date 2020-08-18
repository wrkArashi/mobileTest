<template>
	<div class="user">
		<mt-header fixed title="我的信息"></mt-header>
		<mt-cell title="编号">{{userInfo.ID}}</mt-cell>
		<mt-cell title="姓名">{{userInfo.Name}}</mt-cell>
		<mt-cell title="手机号">{{userInfo.Mobile}}</mt-cell>
		<mt-cell title="品牌">{{userInfo.Brand}}</mt-cell>
		<mt-cell title="产品">{{userInfo.Product}}</mt-cell>
		<mt-cell title="模块">{{userInfo.Module}}</mt-cell>
		<mt-cell title="分组">{{userInfo.Groups}}</mt-cell>
		<mt-cell title="角色">{{userInfo.Roles}}</mt-cell>
		<mt-cell title="语言">{{userInfo.Lng}}</mt-cell>
		<mt-cell title="可用次数">{{userInfo.Num}}</mt-cell>
		<mt-cell title="创建日期">{{userInfo.CreateDate}}</mt-cell>
		<mt-cell title="失效日期">{{userInfo.InvalidDate}}</mt-cell>
		<div class="item" @click="clear">
			<router-link to="/Login" style="color: white;">
				<div class="text">退出系统</div>
			</router-link>
		</div>
	</div>
</template>

<script>
	import { Joggle } from '@/api/index.js';
	export default {
		data() {
			return {
				userInfo: []
			};
		},
		created() {
			this.loadInfo()
		},
		methods: {
			clear() {
				sessionStorage.clear()
			},
			async loadInfo() {
				let { Status, Values } = await Joggle.userInfo({ "user": sessionStorage.id })
				if (Status) {
					this.userInfo = Values[0]
					sessionStorage.userInfo = JSON.stringify(Values[0])
				} else {
					this.$toast(Values);
				}
			}
		}
	}
</script>

<style lang="scss">
	.user {
		.item {
			width: 90%;
			margin: 0 auto;
			background-color: rgb(38, 162, 255);
			text-align: center;
			padding: 10px 5px;
			border-radius: 5px;
		}

		a {
			text-decoration: none;
		}
	}
</style>
