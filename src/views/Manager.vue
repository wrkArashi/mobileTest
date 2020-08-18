<template>
	<div class="manager">
		<mt-header fixed title="管理员功能"></mt-header>
		<div class="content flex">
			<div class="item" @click="item1">
				<i class="iconfont icon-fenzuguanli"></i>
				<div class="text">用户分组</div>
			</div>
			<div class="item" @click="item2">
				<i class="iconfont icon-yonghu1"></i>
				<div class="text">用户列表</div>
			</div>
			<div class="item" @click="item3">
				<i class="iconfont icon-xianxiabaoming"></i>
				<div class="text">报名记录</div>
			</div>
			<div class="item" @click="item4">
				<i class="iconfont icon-tiku"></i>
				<div class="text">题库管理</div>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				selected: ''
			};
		},
		methods: {
			item1() {
				this.$router.push("/test/Group")
			},
			item2() {
				this.$router.push("/test/UserList")
			},
			item3() {
				this.$router.push("/test/SignUp")
			},
			item4() {
				this.$router.push("/test/Bank")
			}
		}
	}
</script>

<style lang="scss">
	.manager {
		.content {
			margin-top: 200px;
			flex-wrap: wrap;

			.item {
				font-size: 20px;
				color: white;
				width: 169px;
				padding: 30px 0;
				background-color: rgb(13, 178, 226);
				margin: 5px;
				text-align: center;
				border-radius: 15px;

				.text {
					margin-top: 5px;
				}
			}

			.item:active {
				background-color: rgb(105, 203, 228);
			}
		}
	}
</style>
