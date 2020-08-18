<template>
	<div class="detail">
		<mt-header fixed>
			<router-link to="/test/Histoary" slot="left">
				<mt-button icon="back">返回</mt-button>
			</router-link>
			<div slot='right'>
				<div @click="card">答题卡</div>
			</div>
		</mt-header>
		<div class="info flex">
			<div>考生：{{name}}</div>
			<div>得分：{{showInfo.Scores}}</div>
			<div @click="detailVisible=true">更多详情</div>
		</div>
		<div class="content">
			<div :class="{'subject1':!showAnswer||!showExplain,'subject2':!showAnswer&&!showExplain}" class="detail">
				<div class="Stem">第{{titleNumber}}题：{{ceshi.Stem}}</div>
				<div class="imageItem">
					<img :src="ceshi.Attached" class="image" v-if="ceshi.Attached!=null">
				</div>
				<div class="item">A、{{ceshi.OptionA}}</div>
				<div class="item">B、{{ceshi.OptionB}}</div>
				<div class="item">C、{{ceshi.OptionC}}</div>
				<div class="item">D、{{ceshi.OptionD}}</div>
			</div>
			<div :class="{'answer1':!showAnswer||!showExplain}" class="answer">
				<div class="option">考生答案：{{student.Answer}}</div>
				<div class="option" v-if="showAnswer">参考答案：{{ceshi.Answer}}</div>
				<div class="option" v-if="showExplain">解析：{{ceshi.Explain}}</div>
			</div>
		</div>
		<div class="footer flex">
			<div class="btn" @click="last">上一题</div>
			<div class="btn" @click="next">下一题</div>
		</div>
		<mt-popup v-model="detailVisible" popup-transition="popup-fade">
			<mt-cell class="detail" title="品牌">{{showInfo.Brand}}</mt-cell>
			<mt-cell class="detail" title="产品">{{showInfo.Product}}</mt-cell>
			<mt-cell class="detail" title="模块">{{showInfo.Module}}</mt-cell>
			<mt-cell class="detail" title="总分">{{showInfo.Total}}</mt-cell>
			<mt-cell class="detail" title="开始时间">{{showInfo.BeginTimes}}</mt-cell>
			<mt-cell class="detail" title="结束时间">{{showInfo.EndTimes}}</mt-cell>
			<mt-cell class="detail" title="创建时间">{{showInfo.CreateDate}}</mt-cell>
		</mt-popup>
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
	export default {
		props: ['id'],
		data() {
			return {
				cardVisible: false,
				all: [],
				detailVisible: false,
				showInfo: {},
				student: {}, //考生答案
				name: "",
				select: [], //选择题号
				showAnswer: false,
				showExplain: false,
				titleNumber: 1, //题号
				ceshi: {}, //显示的每一道题
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
			this.loadInfo() //载入
		},
		methods: {
			// 上一题
			async last() {
				if (this.titleNumber > 1) {
					this.titleNumber--
					let data = {
						"examID": this.id,
						"questionID": this.all[this.titleNumber - 1].QuestionID
					}
					await Joggle.getQu(data).then(response => {
						this.ceshi = response.Values[0]
						this.student = this.all[this.titleNumber - 1] //考生答案
					})
				} else {
					this.$toast('已是第一道题');
				}
			},
			// 下一题
			async next() {
				this.option = ''
				if (this.titleNumber < 80) {
					this.titleNumber++
					let data = {
						"examID": this.id,
						"questionID": this.all[this.titleNumber - 1].QuestionID
					}
					await Joggle.getQu(data).then(response => {
						this.ceshi = response.Values[0]
						this.student = this.all[this.titleNumber - 1] //考生答案
					})
				} else {
					this.$toast('已是最后一道题');
				}
			},
			// 载入试卷详情
			async loadInfo() {
				this.name = JSON.parse(sessionStorage.userInfo).Name
				let { Status, Values } = await Joggle.postInfoItems({ "examID": this.id })
				if (Status) {
					if (Values.Table1 == '') {
						MessageBox.alert('您未参与本场考试').then(action => {
							this.$router.push('/test/Histoary')
						});
						return;
					}
					// 如果没有答案权限
					if (Values.Table1.every(item => !('Answer' in item))) {
						this.showAnswer = false
					} else {
						this.showAnswer = true
					}
					// 如果没有解析权限
					if (Values.Table1.every(item => !('Explain' in item))) {
						this.showExplain = false
					} else {
						this.showExplain = true
					}

					function sortId(a, b) {
						return a.Num - b.Num
					}
					this.showInfo = Values.Table[0]
					console.log(this.showInfo)
					Values.Table2.sort(sortId); //排序
					this.all = Values.Table2.sort(sortId)
					this.student = Values.Table2.sort(sortId)[0] //考生答案
					if (this.student.Result == 'R') {
						this.select[this.titleNumber - 1].active = true
					}
					for (var i = 0; i < 80; i++) {
						if (Values.Table2.sort(sortId)[i].Result == 'R') {
							this.select[i].active = true
						}
					}
					let data = {
						"examID": this.id,
						"questionID": Values.Table2.sort(sortId)[0].QuestionID
					}
					await Joggle.getQu(data).then(response => {
						this.ceshi = response.Values[0] //原题
					})
				} else {
					this.$toast(Values);
				}
			},
			back() {
				this.cardVisible = false
			},
			// 答题卡
			card() {
				this.cardVisible = true
			},
			// 点击题号
			async titleHandle(index, item) {
				this.titleNumber = item.name
				let data = {
					"examID": this.id,
					"questionID": this.all[this.titleNumber - 1].QuestionID
				}
				await Joggle.getQu(data).then(response => {
					this.ceshi = response.Values[0]
					this.student = this.all[this.titleNumber - 1] //考生答案
				})
			}
		}
	}
</script>

<style lang="scss">
	.detail {

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
		}

		// 题目和答案
		.content {
			margin-bottom: 55px;

			.detail {
				border: 1px solid rgb(224, 224, 224);
				margin-bottom: 10px;
				overflow: auto;
				padding: 20px;
				height: 315px;

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

			.subject1 {
				height: 395px;
			}

			.subject2 {
				height: 430px;
			}

			.answer {
				border: 1px solid rgb(224, 224, 224);
				height: 150px;
				overflow: auto;

				.option {
					padding: 7px 20px;
				}
			}

			.answer1 {
				height: auto;
			}
		}

		// 答题卡
		.mint-popup {
			width: 80%;
			padding: 5px;
		}

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
					color: white;
					text-align: center;
					width: 53px;
					margin: 5px 5px;
					padding: 5px 0px;
					background-color: #F56C6C;
				}

				.active {
					background-color: #67C23A;
				}

				.sel {
					border: 2px solid rgb(68, 143, 185);
				}
			}

		}
	}
</style>