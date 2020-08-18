<template>
	<div class="start">
		<mt-header fixed>
			<router-link to="/test/Appointment" slot="left">
				<mt-button icon="back">退出</mt-button>
			</router-link>
			<div slot='right'>
				<div @click="card">答题卡</div>
			</div>
		</mt-header>
		<div class="info flex">
			<div>{{name}}</div>
			<div class="flex">
				<i class="iconfont icon-daojishi"></i>
				<zk-time-down style="margin: 0;" :endTime='this.endTime'></zk-time-down>
			</div>
			<div @click="handPaper">交卷</div>
		</div>
		<div class="content">
			<div class="detail">
				<div class="Stem">第{{titleNumber}}题：{{ceshi.Stem}}</div>
				<div class="imageItem">
					<img :src="ceshi.Attached" class="image" v-if="ceshi.Attached!=null">
				</div>
				<div class="item">A、{{ceshi.OptionA}}</div>
				<div class="item">B、{{ceshi.OptionB}}</div>
				<div class="item">C、{{ceshi.OptionC}}</div>
				<div class="item">D、{{ceshi.OptionD}}</div>
			</div>
			<div class="answer">
				<div v-if="this.ceshi.Category=='单选'">
					<div>单选题</div>
					<mt-radio class="flex" v-model="option" :options="['A', 'B', 'C','D']" @change="options()"></mt-radio>
				</div>
				<div v-if="this.ceshi.Category=='多选'">
					<div>多选题</div>
					<mt-checklist class='flex' v-model="option1" :options="['A', 'B', 'C','D']" @change="options()"></mt-checklist>
				</div>
			</div>
		</div>
		<div class="footer flex">
			<div class="btn" @click="last">上一题</div>
			<div class="btn" @click="next">下一题</div>
		</div>
		<!-- 答题卡 -->
		<mt-popup v-model="cardVisible" popup-transition="popup-fade" class="titleNumber">
			<div class="title flex">
				<div>答题详情</div>
				<div @click="back">返回</div>
			</div>
			<div class="numberList">
				<button :class="{'active':item.active,'sel':item.sel}" v-for="(item, index) in select" class="number" @click="titleHandle(index,item)">{{item.name}}</button>
			</div>
		</mt-popup>
	</div>
</template>

<script>
	import { MessageBox } from 'mint-ui';
	import { Joggle } from '@/api/index.js';
	import zkTimeDown from '@/components/HomeTimer.vue';
	export default {
		components: {
			zkTimeDown
		},
		data() {
			return {
				endTime: sessionStorage.testTime,
				cardVisible: false,
				option1: [],
				option: '',
				ceshi: {}, //显示的每一道题
				all: [], //所有题
				textID: sessionStorage.testId,
				id: "",
				name: "",
				select: [], //答题卡题号展示
				studentAnswer: [], //用户答案
				titleNumber: 1, //题号
			}
		},
		watch: {
			titleNumber: function() {
				for (let i = 0; i < this.select.length; i++) {
					this.select[i].sel = false
				}
				this.select[this.titleNumber - 1].sel = true
			}
		},
		created() {
			for (var i = 1; i < 81; i++) {
				var item = {
					'active': false,
					'name': i,
					'sel': false
				}
				this.select.push(item)
			}
			this.select[0].sel = true
			this.loadList()
		},
		methods: {
			// 交卷
			async handPaper() {
				MessageBox.confirm('确认交卷?').then(async action => {
					for (var i = 0; i < this.studentAnswer.length; i++) {
						if (this.studentAnswer[i].Answer.length == 0) {
							this.studentAnswer[i].Answer = ''
						}
					}
					let { Status, Values } = await Joggle.end({ 'data': this.studentAnswer })
					if (Status) {
						MessageBox.alert('您考了' + Values + '分').then(action => {
							this.$router.push('/test/Histoary')
						});
						sessionStorage.removeItem('studentAnswer');
						sessionStorage.removeItem('testId');
						sessionStorage.removeItem('testValue');
						sessionStorage.removeItem('testTime');
					} else {
						this.$toast(Values);
					}
				}).catch(() => {})
			},
			// 返回
			back() {
				this.cardVisible = false
			},
			// 点击题号
			async titleHandle(index, item) {
				this.option = ''
				this.titleNumber = item.name
				let data = {
					"examID": this.textID,
					"questionID": this.all[this.titleNumber - 1].QuestionID
				}
				await Joggle.getQu(data).then(response => {
					this.ceshi = response.Values[0]
				})
				if (this.ceshi.Category == '多选') {
					this.option1 = this.studentAnswer[this.titleNumber - 1].Answer
					if (this.option1.length != 0) {
						this.option1 = this.option1.split(',')
					}
				}
				if (this.ceshi.Category == '单选') {
					this.option = this.studentAnswer[this.titleNumber - 1].Answer.toString()
				}
			},
			// 点击答题卡
			card() {
				this.cardVisible = true
			},
			// 点击选项
			options() {
				let nowTeam = this.studentAnswer[this.titleNumber - 1]
				if (this.ceshi.Category == '单选') {
					nowTeam.Answer = this.option
				}
				if (this.ceshi.Category == '多选') {
					nowTeam.Answer = this.option1.join(',')
				}
				this.select[this.titleNumber - 1].active = true
				sessionStorage.studentAnswer = JSON.stringify(this.studentAnswer)
			},
			// 点击上一题
			async last() {
				this.option = ''
				this.option1 = []
				if (this.titleNumber > 1) {
					this.titleNumber--
					let data = {
						"examID": this.textID,
						"questionID": this.all[this.titleNumber - 1].QuestionID
					}
					await Joggle.getQu(data).then(response => {
						this.ceshi = response.Values[0]
					})
				} else {
					this.$toast('已是第一道题');
				}
				if (this.ceshi.Category == '多选') {
					this.option1 = this.studentAnswer[this.titleNumber - 1].Answer
					if (this.option1.length != 0) {
						this.option1 = this.option1.split(',')
					}
				}
				if (this.ceshi.Category == '单选') {
					this.option = this.studentAnswer[this.titleNumber - 1].Answer.toString()
				}
			},
			// 点击下一题
			async next() {
				this.option = ''
				this.option1 = []
				if (this.titleNumber < 80) {
					this.titleNumber++
					let data = {
						"examID": this.textID,
						"questionID": this.all[this.titleNumber - 1].QuestionID
					}
					await Joggle.getQu(data).then(response => {
						this.ceshi = response.Values[0]
					})
				} else {
					this.$toast('已是最后一道题');
				}
				if (this.ceshi.Category == '多选') {
					this.option1 = this.studentAnswer[this.titleNumber - 1].Answer
					if (this.option1.length != 0) {
						this.option1 = this.option1.split(',')
					}
				}
				if (this.ceshi.Category == '单选') {
					this.option = this.studentAnswer[this.titleNumber - 1].Answer.toString()
				}
			},
			// 载入试卷情况
			async loadList() {
				this.name = JSON.parse(sessionStorage.userInfo).Name
				this.studentAnswer = JSON.parse(sessionStorage.studentAnswer)
				if (sessionStorage.studentAnswer == '[]') {
					for (var i = 1; i < 81; i++) {
						var item = {
							"ExamID": this.textID,
							"QuestionID": "",
							"UserID": sessionStorage.id,
							"Num": i,
							"Answer": [],
							"Result": null,
							"Score": 0,
						}
						this.studentAnswer.push(item)
					}
				}
				for (let i = 0; i < this.studentAnswer.length; i++) {
					if (this.studentAnswer[i].Answer.length != 0) {
						this.select[i].active = true
						this.select[i].sel = true
					}
				}
				var Values = JSON.parse(sessionStorage.testValue)
				for (var i = 0; i < Values.length; i++) {
					this.studentAnswer[i].QuestionID = Values[i].QuestionID
				}
				this.all = Values
				let data = {
					"examID": this.textID,
					"questionID": Values[0].QuestionID
				}
				await Joggle.getQu(data).then(response => {
					this.ceshi = response.Values[0]
				})
			},
		}
	}
</script>

<style lang="scss">
	.start {

		// 上一题下一题按钮
		.footer {
			background-color: rgb(38, 162, 255);
			position: fixed;
			bottom: 0px;
			right: 0px;
			width: 100%;

			.btn {
				color: white;
				padding: 10px;
			}
		}

		// 信息栏
		.info {
			margin-top: 50px;
			padding: 10px;
			border-bottom: 1px solid rgb(229, 232, 234);
		}

		// 题目和作答
		.content {
			margin-bottom: 55px;

			.detail {
				overflow: auto;
				height: 400px;
				padding: 20px;

				.Stem {
					padding-bottom: 7px;
					overflow-wrap: break-word
				}

				.item {
					padding: 7px 0;
					overflow-wrap: break-word
				}

				.imageItem {
					width: 50%;

					.image {
						max-width: 100%;
					}
				}
			}

			.answer {
				padding-top: 10px;
				border-top: 1px solid rgb(229, 232, 234);
			}
		}

		// 答题卡
		.titleNumber {
			width: 85%;
			padding: 10px;
			height: 63%;

			.title {
				margin-bottom: 10px;
			}

			.numberList {
				height: 92%;
				overflow: auto;

				.number {
					text-align: center;
					width: 53px;
					margin: 5px 5px;
					padding: 5px 0px;
				}

				.active {
					color: white;
					background-color: #67C23A;
				}

				.sel {
					border: 2px solid rgb(68, 143, 185);
				}
			}

		}

	}
</style>
