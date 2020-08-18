<template>
	<div class="appointment">
		<mt-header fixed title="预约考试列表">
			<i class="iconfont icon-tianjiazengjiajia icon" @click="add" slot="right"></i>
		</mt-header>
		<div class="flex head">
			<div class="title">品牌</div>
			<div class="title">模块</div>
			<div class="title">产品</div>
			<div class="title title1">开始日期</div>
			<div class="title title2">操作</div>
		</div>
		<div class="flex" v-for="(item,index) in dataList">
			<div class="title">{{item.Brand}}</div>
			<div class="title">{{item.Module}}</div>
			<div class="title">{{item.Product}}</div>
			<div class="title title1">{{item.BeginTimes}}</div>
			<div class="title title2">
				<mt-button size="small" type="primary" @click="detail(item,index)">详情</mt-button>
			</div>
		</div>
		<!-- 详情/开始弹窗 -->
		<mt-popup v-model="detailVisible" popup-transition="popup-fade" class="popupContent">
			<mt-cell class="item" title="品牌">{{detailList.Brand}}</mt-cell>
			<mt-cell class="item" title="产品">{{detailList.Product}}</mt-cell>
			<mt-cell class="item" title="模块">{{detailList.Module}}</mt-cell>
			<mt-cell class="item" title="总分">{{detailList.Total}}</mt-cell>
			<mt-cell class="item" title="开始时间">{{detailList.BeginTimes}}</mt-cell>
			<mt-cell class="item" title="结束时间">{{detailList.EndTimes}}</mt-cell>
			<mt-cell class="item" title="创建时间">{{detailList.CreateDate}}</mt-cell>
			<mt-button class='button' type="primary" size="large" @click="begin">开始考试</mt-button>
		</mt-popup>
		<!-- 添加预约考试弹窗 -->
		<mt-popup v-model="addlVisible" popup-transition="popup-fade" class="popupContent">
			<div class="item">选择产品：{{this.form.Product}}</div>
			<mt-picker :slots="Product" @change="ProductChange"></mt-picker>
			<div class="item">选择模块：{{this.form.Module}}</div>
			<mt-picker :slots="Module" @change="ModuleChange"></mt-picker>
			<div class="item" @click="openPicker">点此选择开考时间：</div>
			<div class="item">{{this.pickerValue}}</div>
			<mt-button class="button" type="primary" size="large" @click='submit'>确定</mt-button>
		</mt-popup>
		<mt-datetime-picker ref="picker" v-model="pickerValue" @confirm="handleConfirm"></mt-datetime-picker>
	</div>
</template>

<script>
	import { Joggle } from '@/api/index.js';
	export default {
		data() {
			return {
				form: {
					"ID": '',
					"UserID": JSON.parse(sessionStorage.userInfo).ID,
					"Brand": JSON.parse(sessionStorage.userInfo).Brand,
					"Product": '',
					"Version": JSON.parse(sessionStorage.userInfo).Version,
					"Module": '',
					"Groups": JSON.parse(sessionStorage.userInfo).Groups,
					"Roles": JSON.parse(sessionStorage.userInfo).Roles,
					"Lng": JSON.parse(sessionStorage.userInfo).Lng,
					"Total": 100,
					"Scores": 0,
					"Status": 'wait',
					"BeginTimes": '',
					"EndTimes": '',
					"CreateDate": '',
				},
				pickerValue: '',
				Product: [{
					values: this.Global.Product,
				}],
				Module: [{
					values: this.Global.Module,
				}],
				addlVisible: false,
				detailVisible: false,
				dataList: [],
				detailList: []
			}
		},
		methods: {
			// 点击开始考试
			async begin(index, row) {
				if (sessionStorage.getItem('studentAnswer')) {
					if (this.detailList.ID != sessionStorage.testId) {
						this.$message.warning('您有正进行中的考试，请前往')
					} else {
						this.$router.push('/testStart')
					}
				} else {
					let { Status, Values } = await Joggle.begin({ "examID": this.detailList.ID })
					if (Status) {
						this.$router.push('/testStart')
						sessionStorage.testValue = JSON.stringify(Values)
						sessionStorage.testId = this.detailList.ID
						sessionStorage.testTime = this.detailList.EndTimes
						if (!sessionStorage.getItem('studentAnswer')) {
							sessionStorage.studentAnswer = JSON.stringify([])
						}
					} else {
						this.detailVisible = false
						this.$toast(Values);
					}
				}
			},
			// 提交预约
			async submit() {
				var timestamp = new Date().getTime()
				var now = new Date(),
					y = now.getFullYear(),
					m = now.getMonth() + 1,
					d = now.getDate()
				var time = y + "-" + (m < 10 ? "0" + m : m) + "-" + (d < 10 ? "0" + d : d);
				this.form.ID = timestamp
				this.form.BeginTimes = this.pickerValue
				this.form.EndTimes = this.form.BeginTimes
				this.form.CreateDate = time
				if (this.form.BeginTimes == '') {
					this.addlVisible = false
					this.$toast('失败！请选择开考时间');
					return;
				}
				var data = {
					data: [{ ...this.form }]
				}
				let { Status, Values } = await Joggle.order(data)
				if (Status) {
					this.$toast({
						message: Values,
						iconClass: 'mint-toast-icon mintui mintui-success'
					});
					this.addlVisible = false
					this.loadList()
				} else {
					this.addlVisible = false
					this.$toast(Values);
				}
			},
			// 确认日期
			handleConfirm() {
				this.pickerValue =
					this.pickerValue.toISOString().substring(0, 10) + ' ' + this.pickerValue.toTimeString().substring(0, 9);
			},
			// 打开选择日期框
			openPicker() {
				this.$refs.picker.open();
			},
			// 模块选择器改变
			ModuleChange(picker, values) {
				this.form.Module = values[0]
			},
			// 产品选择器改变
			ProductChange(picker, values) {
				this.form.Product = values[0]
			},
			//打开添加框
			add() {
				this.addlVisible = true
			},
			// 打开详情框
			detail(item, index) {
				this.detailList = item
				this.detailVisible = true
			},
			// 载入预约考试列表
			async loadList() {
				let { Status, Values } = await Joggle.examList()
				if (Status) {
					this.dataList = Values
				} else {
					this.$toast(Values);
				}
			}
		},
		created() {
			this.loadList()
		}
	}
</script>

<style lang="scss">
	.appointment {
		.flex {
			text-align: center;
			border-left: 1px solid rgb(234, 233, 236);
		}

		.head {
			border-top: 1px solid rgb(234, 233, 236);
		}

		// 添加图标

		.icon {
			font-size: 22px;
		}

		.icon:active {
			color: skyblue;
		}

		// 表格
		.title {
			width: 45px;
			border-bottom: 1px solid rgb(234, 233, 236);
			border-right: 1px solid rgb(234, 233, 236);
			height: 45px;
			line-height: 45px;
		}

		.title1 {
			width: 165px;
		}

		.title2 {
			width: 60px;
		}

		//弹框
		.popupContent {
			width: 350px;

			.item {
				padding: 15px;
				padding-bottom: 0;
			}

			.button {
				width: 90%;
				margin: 15px auto;
			}
		}
	}
</style>
