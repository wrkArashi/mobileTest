<template>
	<div class="signUp">
		<mt-header fixed>
			<router-link to="/test/Manager" slot="left">
				<mt-button icon="back">返回</mt-button>
			</router-link>
			<i class="iconfont icon-tianjiazengjiajia icon" @click="add" slot="right"></i>
		</mt-header>
		<div class="content">
			<!-- <mt-search autofocus v-model="value" :result="filterResult"></mt-search> -->
			<div class="flex head">
				<div class="title title1">姓名</div>
				<div class="title">称谓</div>
				<div class="title">状态</div>
				<div class="title">模块</div>
				<div class="title title2">操作</div>
			</div>
			<div class="flex" v-for="(item,index) in dataList">
				<div class="title title1">{{item.Name}}</div>
				<div class="title">{{item.Title}}</div>
				<div class="title">{{item.Status}}</div>
				<div class="title">{{item.Module}}</div>
				<div class="title title2">
					<i class="iconfont icon-xiangqing icon" @click="detail(item,index)"></i>
					<i class="iconfont icon-bianji icon" @click="edit(item,index)"></i>
					<i class="iconfont icon-shanchu1 icon" @click="del(item,index)"></i>
				</div>
			</div>
		</div>
		<!-- 详情弹窗 -->
		<mt-popup v-model="detailVisible" popup-transition="popup-fade" class="popupContent">
			<mt-cell class="item" title="身份证号">{{detailList.ID}}</mt-cell>
			<mt-cell class="item" title="姓名">{{detailList.Name}}</mt-cell>
			<mt-cell class="item" title="称谓">{{detailList.Title}}</mt-cell>
			<mt-cell class="item" title="邮箱">{{detailList.Mail}}</mt-cell>
			<mt-cell class="item" title="模块">{{detailList.Module}}</mt-cell>
			<mt-cell class="item" title="手机号">{{detailList.Mobile}}</mt-cell>
			<mt-cell class="item" title="国家">{{detailList.Nation}}</mt-cell>
			<mt-cell class="item" title="城市">{{detailList.City}}</mt-cell>
			<mt-cell class="item" title="街道">{{detailList.Street}}</mt-cell>
			<mt-cell class="item" title="邮编">{{detailList.PostCode}}</mt-cell>
			<mt-cell class="item" title="分组">{{detailList.Groups}}</mt-cell>
			<mt-cell class="item" title="合同金额">{{detailList.Amounts}}</mt-cell>
			<mt-cell class="item" title="状态">{{detailList.Status}}</mt-cell>
			<mt-cell class="item" title="创建时间">{{detailList.CreateDate}}</mt-cell>
			<mt-button class='button' @click="close">关闭</mt-button>
		</mt-popup>
		<!-- 编辑弹窗disabled -->
		<mt-popup v-model="editVisible" popup-transition="popup-fade" class="popupContent">
			<mt-field label="身份证号" v-model="editList.ID" :disabled="true"></mt-field>
			<mt-field label="姓名" v-model="editList.Name" :disabled="true"></mt-field>
			<mt-field label="称谓" v-model="editList.Title" :disabled="true"></mt-field>
			<mt-field label="邮箱" v-model="editList.Mail" :disabled="true"></mt-field>
			<mt-field label="模块" v-model="editList.Module" :disabled="true"></mt-field>
			<mt-field label="手机号" placeholder="必填" v-model="editList.Mobile" type="tel" required="true"></mt-field>
			<mt-field label="国家" v-model="editList.Nation"></mt-field>
			<mt-picker :slots="nation" @change="nationChange"></mt-picker>
			<mt-field label="城市" placeholder="请填写正确的省份,例如:北京" v-model="editList.City"></mt-field>
			<mt-field label="街道" v-model="editList.Street"></mt-field>
			<mt-field label="邮编" v-model="editList.PostCode" type="number"></mt-field>
			<mt-field label="分组" v-model="editList.Groups"></mt-field>
			<mt-field label="合同金额" v-model="editList.Amounts" type="number"></mt-field>
			<mt-field label="状态" v-model="editList.Status"></mt-field>
			<mt-picker :slots="status" @change="statusChange"></mt-picker>
			<mt-field label="创建时间" v-model="editList.CreateDate" :disabled="true"></mt-field>
			<mt-button class='button' type="primary" @click="editHandle">完成修改</mt-button>
		</mt-popup>
		<!-- 添加框 -->
		<mt-popup v-model="addVisible" popup-transition="popup-fade" class="popupContent">
			<mt-field label="身份证号" placeholder="必填" v-model="addList.ID" required="true" :state="IDStatus" @blur.native.capture="checkInputID"></mt-field>
			<mt-field label="姓名" placeholder="必填" v-model="addList.Name"></mt-field>
			<mt-field label="称谓">
				<mt-radio placeholder="必填" v-model="addList.Title" :options="['先生', '女士']"></mt-radio>
			</mt-field>
			<mt-field placeholder="必填" label="邮箱" v-model="addList.Mail"></mt-field>
			<mt-field placeholder="必填" label="模块" v-model="addList.Module">
				<mt-picker :slots="Module" @change="ModuleChange"></mt-picker>
			</mt-field>
			<mt-field label="手机号" placeholder="必填" v-model="addList.Mobile"></mt-field>
			<mt-field label="国家" v-model="addList.Nation"></mt-field>
			<mt-picker :slots="nation" @change="nationChange1"></mt-picker>
			<mt-field label="城市" placeholder="请填写正确的省份,例如:北京" v-model="addList.City"></mt-field>
			<mt-field label="街道" v-model="addList.Street"></mt-field>
			<mt-field label="邮编" v-model="addList.PostCode" type="number"></mt-field>
			<mt-field label="分组" v-model="addList.Groups"></mt-field>
			<mt-field label="合同金额" v-model="addList.Amounts" type="number"></mt-field>
			<mt-field label="状态" v-model="addList.Status"></mt-field>
			<mt-picker :slots="status" @change="statusChange1"></mt-picker>
			<mt-button class='button' type="primary" @click="addHandle">确认添加</mt-button>
		</mt-popup>
	</div>
</template>

<script>
	import { Joggle } from '@/api/index.js';
	import { MessageBox } from 'mint-ui';
	export default {
		data() {
			return {
				// value: '',
				// // 默认数据
				// defaultResult: [
				// 	'Apple',
				// 	'Banana',
				// 	'Orange',
				// 	'Durian',
				// 	'Lemon',
				// 	'Peach',
				// 	'Cherry',
				// 	'Berry',
				// 	'Core',
				// 	'Fig',
				// 	'Haw',
				// 	'Melon',
				// 	'Plum',
				// 	'Pear',
				// 	'Peanut',
				// 	'Other'
				// ],
				IDStatus: "", //校验ID
				Module: [{
					values: this.Global.Module,
				}],
				nation: [{
					values: ["请选择国家", "中国", "韩国", "日本", "新加坡", "马来西亚", "菲律宾", "沙特阿拉伯", "朝鲜", "越南", "缅甸", "德国", "英国", "法国", "爱尔兰",
						"波兰", "西班牙", "意大利", "俄罗斯", "荷兰", "美国", "加拿大", "巴西", "阿根廷", "新西兰", "澳大利亚", "印度", "埃及"
					]
				}],
				status: [{
					values: ["咨询", "已付款", "已服务", "已考试", "已通过"]
				}],
				addList: {
					"ID": "",
					"Name": "",
					"Title": "",
					"Mail": "",
					"Module": "",
					"Mobile": "",
					"Nation": "",
					"City": "",
					"Street": "",
					"PostCode": "",
					"Groups": "",
					"Amounts": "",
					"Status": "",
					"CreateDate": ""
				},
				addVisible: false,
				editList: {},
				editVisible: false,
				detailVisible: false,
				detailList: [],
				dataList: [],
			}
		},
		computed: {
			// filterResult() {
			// 	return this.defaultResult.filter(value => new RegExp(this.value, 'i').test(value));
			// }
		},
		methods: {
			// 删除
			del(item, index) {
				MessageBox.confirm('确定删除?').then(async action => {
					let { Status, Values } = await Joggle.delPA({ 'ids': item.ID })
					if (Status) {
						this.$toast(Values);
						this.loadList()
					} else {
						this.$toast(Values);
					}
				}).catch(action => {
					this.$toast('已取消删除')
				})
			},
			// 校验ID
			checkInputID() {
				var IDRules = /^(\d{6})(\d{4})(\d{2})(\d{2})(\d{3})([0-9]|X)$/; //判断身份证
				// var IDRules = /\s/ //判断非空
				if (!IDRules.test(this.addList.ID)) {
					this.IDStatus = "error";
				} else {
					this.IDStatus = "success";
				}
			},
			// 模块选择器改变
			ModuleChange(picker, values) {
				this.addList.Module = values[0]
			},
			// 改变添加状态
			statusChange1(picker, values) {
				this.addList.Status = values[0]
			},
			// 改变添加国家
			nationChange1(picker, values) {
				this.addList.Nation = values[0]
				this.addList.City = ''
			},
			// 完成添加
			async addHandle() {
				if (this.IDStatus == "error") {
					this.addVisible = false
					this.$toast('身份证号错误')
					return;
				}
				if (this.addList.ID == "" || this.addList.Mobile == "" || this.addList.Name == "" || this.addList.Title == "" ||
					this.addList.Mail == "" || this.addList.Module == "") {
					this.addVisible = false
					this.$toast('请填写必填项')
					return;
				}
				var timestamp = new Date().getTime()
				var now = new Date(),
					y = now.getFullYear(),
					m = now.getMonth() + 1,
					d = now.getDate()
				var time = y + "-" + (m < 10 ? "0" + m : m) + "-" + (d < 10 ? "0" + d : d);
				this.addList.CreateDate = time
				let { Status, Values } = await Joggle.addPA({ "data": [this.addList] })
				if (Status) {
					this.$toast(Values);
					this.addVisible = false
					this.loadList()
					this.addList.ID = ""
					this.addList.Name = ""
					this.addList.Title = ""
					this.addList.Mail = ""
					this.addList.Module = ""
					this.addList.Mobile = ""
				} else {
					this.$toast(Values);
				}
			},
			// 添加弹窗
			add() {
				this.addVisible = true
			},
			// 改变修改状态
			statusChange(picker, values) {
				this.editList.Status = values[0]
			},
			// 改变修改国家
			nationChange(picker, values) {
				this.editList.Nation = values[0]
				this.editList.City = ''
			},
			// 完成修改
			async editHandle() {
				let { Status, Values } = await Joggle.chgPA({ "data": [this.editList] })
				if (Status) {
					this.$toast(Values);
					this.editVisible = false
					this.loadList()
				} else {
					this.$toast(Values);
				}
			},
			// 打开编辑框
			edit(item, index) {
				console.log(this.nation)
				this.editList = item
				this.editVisible = true
			},
			// 关闭弹框
			close() {
				this.detailVisible = false
				this.editVisible = false
			},
			// 打开详情框
			detail(item, index) {
				this.detailList = item
				this.detailVisible = true
			},
			// 载入列表
			async loadList() {
				let { Status, Values } = await Joggle.pAEnList()
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
	.signUp {
		.mint-field-core {
			border: 1px solid rgb(208, 208, 208);
		}

		// 单选按钮组
		.mint-radiolist {
			display: flex;
		}

		.mint-radiolist-title {
			margin: 0;
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
			width: 110px;
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
