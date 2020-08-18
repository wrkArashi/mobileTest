<template>
	<div class="login">
		<div class="logo">
			<img class="img" src="../assets/logoChange.png" alt="">
			<div>在线考试系统登陆</div>
		</div>
		<div class="content">
			<div class="flex">
				<i class="iconfont icon-zhanghao"></i>
				<mt-field placeholder="请输入账号" v-model="ID" style="width: 100%;"></mt-field>
			</div>
			<div class="flex">
				<i class="iconfont icon-mima"></i>
				<mt-field placeholder="请输入密码" type="password" v-model="pwd" style="width: 100%;"></mt-field>
			</div>
			<div class="flex">
				<i class="iconfont icon-yanzhengma"></i>
				<mt-field placeholder="请输入验证码" type="number" v-model="check" :state="NameStatus" @blur.native.capture="checkInputName"
				 style="width: 100%;"></mt-field>
				<div class="code" @click="refreshCode">
					<s-identify :identifyCode="identifyCode"></s-identify>
				</div>
			</div>
		</div>
		<div class="Sure">
			<mt-button type="primary" size="large" @click="login">登陆</mt-button>
		</div>
	</div>
</template>

<script>
	import SIdentify from '@/components/Identify.vue';
	import { Joggle } from '@/api/index.js';
	export default {
		name: 'App',
		components: {
			SIdentify
		},
		data() {
			return {
				ID: "",
				pwd: "",
				check: "",
				NameStatus: "",
				identifyCode: "",
				identifyCodes: "1234567890",
			}
		},
		mounted() {
			this.identifyCode = "";
			this.makeCode(this.identifyCodes, 4);
		},
		methods: {
			checkInputName() {
				if (this.check == this.identifyCode) {
					this.NameStatus = "success"
				} else {
					this.NameStatus = "error"
				}
			},
			async login() {
				if (this.NameStatus == "success") {
					let data = {
						"user": this.ID,
						"pwd": this.pwd
					}
					let { Status, Values } = await Joggle.login(data)
					sessionStorage.token = Values
					sessionStorage.id = data.user
					if (Status) {
						let instance = this.$toast({
							message: '登陆成功',
							iconClass: 'mint-toast-icon mintui mintui-success'
						});
						setTimeout(() => {
							instance.close();
						}, 2000);
						this.$router.push('/test/User')
					} else {
						this.$toast(Values);
					}
				}
			},
			randomNum(min, max) {
				return Math.floor(Math.random() * (max - min) + min);
			},
			refreshCode() {
				this.identifyCode = "";
				this.makeCode(this.identifyCodes, 4);
			},
			makeCode(o, l) {
				for (let i = 0; i < l; i++) {
					this.identifyCode += this.identifyCodes[
						this.randomNum(0, this.identifyCodes.length)
					];
				}
			},
		}
	}
</script>

<style lang="scss">
	.login {

		.logo {
			margin: 0 auto;
			margin-top: 100px;
			text-align: center;

			.img {
				width: 100px;
				height: 100px;
			}
		}

		.content {
			margin: 20px 10px;
			border-radius: 10px;
			padding: 20px;

			.flex {
				border-bottom: 1px solid #999;
				margin-bottom: 15px;

				.code {
					margin-left: 5px;
				}
			}
		}

		.Sure {
			padding: 0 20px;
		}
	}
</style>
