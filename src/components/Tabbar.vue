<template>
	<div class="tabbar">
		<mt-tabbar v-model="selected" fixed>
			<mt-tab-item id="历史考试">
				<div class="item"><i class="iconfont icon-3lishi"></i></div>
				历史考试
			</mt-tab-item>
			<mt-tab-item id="用户信息">
				<div class="item"><i class="iconfont icon-yonghu"></i></div>
				用户信息
			</mt-tab-item>
			<mt-tab-item id="预约考试">
				<div class="item"><i class="iconfont icon-yuyuexinxi"></i></div>
				预约考试
			</mt-tab-item>
			<mt-tab-item id="管理员功能">
				<div class="item"><i class="iconfont icon-guanliyuan"></i></div>
				管理员功能
			</mt-tab-item>
		</mt-tabbar>
		<div class="content">
			<router-view></router-view>
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
		created() {
			// this.selected = '用户信息'
		},
		watch: {
			selected: function(val, oldVal) {
				this.selected = val
				switch (val) {
					case '历史考试':
						this.$router.push('/test/Histoary');
						break;
					case '用户信息':
						this.$router.push('/test/User');
						break;
					case '预约考试':
						this.$router.push('/test/Appointment');
						break;
					case '管理员功能':
						this.$router.push('/test/Manager');
						break;
				}

			}
		},
	};
</script>

<style lang="scss">
	.tabbar {
		i {
			font-size: 20px;
		}

		.item {
			padding-bottom: 5px;
		}

		.content {
			margin: 50px 0 60px 0;
		}
	}
</style>
