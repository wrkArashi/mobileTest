module.exports = {
	plugins: {
		'autoprefixer': {},
		'postcss-px2rem-exclude': {
			//这里注意与rem.js中的基准大小保持一致
			'remUnit': 75,
			'exclude': '/node_modules/i'
		}
	}
}
