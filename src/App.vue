<template>
	<div id="app">
		<router-view></router-view>
	</div>
</template>
<style lang="scss">
	#app {
		font-family: Avenir, Helvetica, Arial, sans-serif;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		font-size: 16px;

		.flex {
			display: flex;
			align-items: center;
			justify-content: space-between;
		}

		.mint-cell-wrapper {
			background-image: none;
		}

		.mint-cell:last-child {
			background-image: none;
		}

		button {
			outline: none; //消除默认点击蓝色边框效果
		}
		.mint-header-title{
			font-size: 18px;
		}
	}
</style>
