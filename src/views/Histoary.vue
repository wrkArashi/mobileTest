<template>
	<div class="histoary">
		<mt-header fixed title="历史考试列表"></mt-header>
		<div class="flex head">
			<div class="title">品牌</div>
			<div class="title">模块</div>
			<div class="title">得分</div>
			<div class="title title1">开始日期</div>
			<div class="title title2">操作</div>
		</div>
		<div class="flex" v-for="(item,index) in dataList">
			<div class="title">{{item.Brand}}</div>
			<div class="title">{{item.Module}}</div>
			<div class="title">{{item.Scores}}</div>
			<div class="title title1">{{item.BeginTimes}}</div>
			<div class="title title2">
				<router-link :to="{ name : 'testDetail' , params : { id : item.ID} }" tag="div">
					<mt-button size="small" type="primary">详情</mt-button>
				</router-link>
			</div>
		</div>
	</div>
</template>

<script>
	import { Joggle } from '@/api/index.js';
	export default {
		data() {
			return {
				dataList: [],
			}
		},
		methods: {
			// 载入历史考试列表
			async loadList() {
				let { Status, Values } = await Joggle.postInfoList()
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
	.histoary {
		.flex {
			text-align: center;
			border-left: 1px solid rgb(234, 233, 236);
		}

		.head {
			border-top: 1px solid rgb(234, 233, 236);
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
			overflow: auto;
		}

		.title2 {
			width: 60px;
		}

	}
</style>
