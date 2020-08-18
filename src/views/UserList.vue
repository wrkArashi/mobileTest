<template>
	<div class="userList">
		<mt-header fixed>
			<router-link to="/test/Manager" slot="left">
				<mt-button icon="back">返回</mt-button>
			</router-link>
			<i class="iconfont icon-tianjiazengjiajia icon" @click="add" slot="right"></i>
		</mt-header>
		<div class="content">
			<div class="flex head">
				<div class="title title1">姓名</div>
				<div class="title">模块</div>
				<div class="title">语言</div>
				<div class="title">次数</div>
				<div class="title title2">操作</div>
			</div>
			<div class="flex" v-for="(item,index) in dataList">
				<div class="title title1">{{item.Name}}</div>
				<div class="title">{{item.Module}}</div>
				<div class="title">{{item.Lng}}</div>
				<div class="title">{{item.Num}}</div>
				<div class="title title2">
					<i class="iconfont icon-xiangqing icon" @click="detail(item,index)"></i>
					<i class="iconfont icon-bianji icon" @click="edit(item,index)"></i>
				</div>
			</div>
		</div>
		<!-- 添加框 -->
		<mt-popup v-model="addVisible" popup-transition="popup-fade" class="popupContent">
			<mt-field label="ID" placeholder="必填" v-model="addList.ID"></mt-field>
			<mt-field label="姓名" placeholder="必填" v-model="addList.Name"></mt-field>
			<mt-field label="密码" placeholder="必填" v-model="addList.Pwd"></mt-field>
			<mt-field label="手机号" v-model="addList.Mobile"></mt-field>
			<mt-field label="可用次数" placeholder="必填" v-model="addList.Num" type="number"></mt-field>
			<mt-field label="产品" v-model="addList.Product" :readonly="true">
				<mt-picker :slots="Product" @change="ProductChange"></mt-picker>
			</mt-field>
			<mt-field label="模块" v-model="addList.Module" :readonly="true">
				<mt-picker :slots="Module" @change="ModuleChange"></mt-picker>
			</mt-field>
			<mt-field placeholder="必填" label="分组" v-model="addList.Groups" :readonly="true">
				<mt-picker :slots="Groups" @change="GroupsChange"></mt-picker>
			</mt-field>
			<mt-field placeholder="必填" label="角色" v-model="addList.Roles" :readonly="true">
				<mt-picker :slots="Roles" @change="RolesChange"></mt-picker>
			</mt-field>
			<mt-field label="语言" v-model="addList.Lng"></mt-field>
			<mt-field label="版本" v-model="addList.Version"></mt-field>
			<mt-field label="失效日期" v-model="addList.InvalidDate"> <span @click="openPicker">选择</span></mt-field>
			<mt-button class='button' type="primary" @click="addHandle">确认添加</mt-button>
		</mt-popup>
		<!-- 详情弹窗 -->
		<mt-popup v-model="detailVisible" popup-transition="popup-fade" class="popupContent">
			<mt-cell class="item" title="身份证号">{{detailList.ID}}</mt-cell>
			<mt-cell class="item" title="姓名">{{detailList.Name}}</mt-cell>
			<mt-cell class="item" title="手机号">{{detailList.Mobile}}</mt-cell>
			
			
			<mt-cell class="item" title="品牌">{{detailList.Brand}}</mt-cell>
			
			
			<mt-cell class="item" title="产品">{{detailList.Product}}</mt-cell>
			<mt-cell class="item" title="版本">{{detailList.Version}}</mt-cell>
			<mt-cell class="item" title="模块">{{detailList.Module}}</mt-cell>
			<mt-cell class="item" title="分组">{{detailList.Groups}}</mt-cell>
			<mt-cell class="item" title="角色">{{detailList.Roles}}</mt-cell>
			<mt-cell class="item" title="语言">{{detailList.Lng}}</mt-cell>
			<mt-cell class="item" title="可用次数">{{detailList.Num}}</mt-cell>
			<mt-cell class="item" title="密码">{{detailList.Pwd}}</mt-cell>
			<mt-cell class="item" title="失效日期">{{detailList.InvalidDate}}</mt-cell>
			<mt-cell class="item" title="创建时间">{{detailList.CreateDate}}</mt-cell>
			<mt-button class='button' @click="close">关闭</mt-button>
		</mt-popup>
		<mt-datetime-picker ref="picker" v-model="addList.InvalidDate" @confirm="handleConfirm" type="date"></mt-datetime-picker>
	</div>
</template>

<script>
	import { Joggle } from '@/api/index.js';
	export default {
		data() {
			return {
				// 角色
				Roles: [{
					values: [],
				}],
				// 分组
				Groups: [{
					values: [],
				}],
				// 产品
				Product: [{
					values: this.Global.Product,
				}],
				// 模块
				Module: [{
					values: this.Global.Module,
				}],
				detailVisible: false,
				addVisible: false,
				dataList: [],
				addList: {
					"ID": "",
					"Name": "",
					"Mobile": '',
					"Brand": '',
					"Product": '',
					"Version": '',
					"Module": '',
					"Groups": "",
					"Roles": "",
					"Lng": '',
					"Num": '',
					"Pwd": '',
					"CreateDate": '',
					"InvalidDate": ''
				},
				detailList: {}
			}
		},
		methods: {
			// 打开详情框
			detail(item, index) {
				this.detailList = item
				this.detailVisible = true
			},
			// 确认日期
			handleConfirm() {
				console.log(this.addList.InvalidDate)
				var d = new Date(this.addList.InvalidDate);
				this.addList.InvalidDate = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
			},
			// 失效日期
			openPicker() {
				this.$refs.picker.open();
			},
			// 获取分组
			async getGroup() {
				let { Status, Values } = await Joggle.groupList()
				if (Status) {
					for (var i in Values) {
						this.Groups[0].values.push(Values[i].Groups)
					}
				}
			},
			// 角色改变
			RolesChange(picker, values) {
				this.addList.Roles = values[0]
			},
			// 分组改变,获取角色
			async GroupsChange(picker, values) {
				if (values[0] != undefined) {
					this.addList.Groups = values[0]
					let { Status, Values } = await Joggle.roleList({ groups: values[0] })
					if (Status) {
						this.Roles[0].values = []
						for (var i in Values) {
							this.Roles[0].values.push(Values[i].Roles)
						}
					} else {
						this.$toast(Values);
					}
				}
			},
			// 产品选择器改变
			ProductChange(picker, values) {
				this.addList.Product = values[0]
			},
			// 模块选择器改变
			ModuleChange(picker, values) {
				this.addList.Module = values[0]
			},
			// 确认添加
			async addHandle() {
				var now = new Date(),
					y = now.getFullYear(),
					m = now.getMonth() + 1,
					d = now.getDate()
				var time = y + "-" + (m < 10 ? "0" + m : m) + "-" + (d < 10 ? "0" + d : d);
				this.addList.CreateDate = time
				this.addList.Brand = 'SAP'
				var data = {
					data: [{ ...this.addList }]
				}
				let { Status, Values } = await Joggle.addUser(data)
				if (Status) {
					this.$toast(Values);
					this.loadList()
					this.addVisible = false;
					for (var key in this.addList) {
						this.addList[key] = ""
					}
				} else {
					this.$toast(Values);
				}
			},
			// 载入列表
			async loadList() {
				let { Status, Values } = await Joggle.userList()
				if (Status) {
					this.dataList = Values
				} else {
					this.$toast(Values);
				}
			},
			// 点击添加
			add() {
				this.addVisible = true
			}
		},
		created() {
			this.loadList()
			this.getGroup()
		}
	}
</script>

<style lang="scss">
	.userList {
		.mint-field-core {
			border: 1px solid rgb(208, 208, 208);
		}

		.flex {
			text-align: center;
			border-left: 1px solid rgb(234, 233, 236);
		}

		.head {
			border-top: 1px solid rgb(234, 233, 236);
		}

		// 表格
		.title {
			width: 70px;
			border-bottom: 1px solid rgb(234, 233, 236);
			border-right: 1px solid rgb(234, 233, 236);
			height: 45px;
			line-height: 45px;
			overflow: auto;
		}

		.title1 {
			width: 80px;
		}

		.title2 {
			width: 80px;
			overflow: hidden;
		}

		.icon {
			margin: 0 5px;
		}

		.icon:active {
			color: skyblue;
		}

		//弹框
		.popupContent {
			width: 350px;
			height: 80%;
			overflow: auto;

			.item {
				padding: 15px;
				padding-bottom: 0;
			}

			.button {
				width: 100%;
				margin: 15px auto;
			}
		}
	}
</style>
