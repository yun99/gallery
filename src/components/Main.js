require('styles/App.css');
require('styles/style.sass');

import React from 'react';
import ReactDOM from 'react-dom';

let yeomanImage = require('../images/img.jpg');

// 获取图片相关数据
var imageDatas = require('../data/imagesDatas.json');

// 利用自执行函数，将图片名称转化为URL
imageDatas = (function getImageURL(imageDatasArray){
	for(var i=0; i<imageDatasArray.length; i++){
		var singleImageData = imageDatasArray[i];
		singleImageData.imageURL = require('../images/'+singleImageData.fileName);
		imageDatasArray[i] = singleImageData; 
	}
	return imageDatasArray;
})(imageDatas);

/*
 * 获取取值范围内的一个随机值
 */
function getRangeRandom(low, high){
	return Math.ceil(Math.random()*(high - low) + low);
}
/*
 * 获取0-30度之间的任意正负值
 */
function get30DegRandom(){
	return (Math.ceil(Math.random()*60) - 30);
}
var ImgFigure = React.createClass({
	render: function(){

		var styleObj = {};
		// 如果 props 中指定了图片的位置信息，则使用
		if(this.props.arrange.pos){
			styleObj = this.props.arrange.pos;
		}	
		// 如果图片的旋转角度有值且不为零，则旋转
		if(this.props.arrange.rotate){
			(['-moz-', '-ms-', '-webkit-', '']).forEach(function(value, index){
				styleObj[value+'transform'] = 'rotate(' + this.props.arrange.rotate + 'deg)';
			}.bind(this));
		}
		console.log(styleObj)

		return (
			<figure className="img_figure" style={styleObj}>
				<img src={this.props.data.imageURL} alt={this.props.data.title} />
				<figcaption>
					<h2 className="img_title">{this.props.data.title}</h2>
				</figcaption>
			</figure>
		);
	}
});

var GalleryByReact = React.createClass({
	Constant: {
		centerPos: {
			left: 0,
			top: 0
		},
		hPosRange: { //水平方向的取值范围
			leftSecX: [0, 0],
			rightSecX: [0, 0],
			y: [0, 0]
		},
		vPosRange: { //垂直方向的取值范围
			x: [0, 0],
			topY: [0, 0]
		},
	},
	/*
	 * 重新布局所有图片
	 * @param centerIndex 制定居中排布哪个图片
	 */
	rearrange: function(centerIndex){
		var imgsArrangeArr = this.state.imgsArrangeArr,
			Constant = this.Constant,
			centerPos = Constant.centerPos,
			hPosRange = Constant.hPosRange,
			vPosRange = Constant.vPosRange,
			hPosRangeLeftSecX = hPosRange.leftSecX,
			hPosRangeRightSecX = hPosRange.rightSecX,
			hPosRangeY = hPosRange.y,
			vPosRangeTopY = vPosRange.topY,
			vPosRangeX = vPosRange.x,

			imgsArrangeTopArr = [],
			topImgNum = Math.ceil(Math.random()*2),	// 取1个，或不取
			topImgSpliceIndex = 0,

			imgsArrangeCenterArr = imgsArrangeArr.splice(centerIndex, 1);

		// 首先剧终 centerIndex 的图片
		imgsArrangeCenterArr[0].pos = centerPos;

		// 剧终的 centerIndex 的图片不需要旋转
		imgsArrangeCenterArr.rotate = 0;

		// 取出要不拘上侧图片的状态信息
		topImgSpliceIndex = Math.ceil(Math.random()*(imgsArrangeArr.length - topImgNum));
		imgsArrangeTopArr = imgsArrangeArr.splice(topImgSpliceIndex, topImgNum);

		// 布局位于上侧的图片
		imgsArrangeTopArr.forEach(function(value, index){
			imgsArrangeTopArr[index] = {
				pos: {
					left: getRangeRandom(vPosRangeX[0], vPosRangeX[1]),
					top: getRangeRandom(vPosRangeTopY[0], vPosRangeTopY[1])
				},
				rotate: get30DegRandom()
			};
		});

		// 布局左右两侧的图片状态信息
		for(var i=0, j=imgsArrangeArr.length, k=j/2; i<j; i++){
			var hPosRangeLORX = null;

			// 前半部分布局左边，后半部分布局右边
			if(i < k){
				hPosRangeLORX = hPosRangeLeftSecX;
			}else{
				hPosRangeLORX = hPosRangeRightSecX;
			}

			imgsArrangeArr[i] = {
				pos: {
					left: getRangeRandom(hPosRangeLORX[0],hPosRangeLORX[1]),
					top: getRangeRandom(hPosRangeY[0], hPosRangeY[1])
				},
				rotate: get30DegRandom()
			};
		}

		if(imgsArrangeTopArr && imgsArrangeTopArr[0]){
			imgsArrangeArr.splice(topImgSpliceIndex, 0, imgsArrangeTopArr[0]);
		}

		imgsArrangeArr.splice(centerIndex, 0, imgsArrangeCenterArr[0]);

		this.setState({
			imgsArrangeArr: imgsArrangeArr
		});
	},
	getInitialState: function(){
		return {
			imgsArrangeArr: []
		};
	},
	// 组件加载以后，为每张图片计算位置的范围
	componentDidMount: function(){
		var stageDOM = ReactDOM.findDOMNode(this.refs.stage),
			stageW = stageDOM.scrollWidth,
			stageH = stageDOM.scrollHeight,
			halfStageW = Math.ceil(stageW / 2),
			halfStageH = Math.ceil(stageH / 2);

		// 拿到一个imageFigure的大小
		var imgFigureDOM = ReactDOM.findDOMNode(this.refs.imgFigure0),
			imgW = imgFigureDOM.scrollWidth,
			imgH = imgFigureDOM.scrollHeight,
			halfImgW = Math.ceil(imgW / 2),
			halfImgH = Math.ceil(imgH / 2);

		// 计算中心图片的位置点
		this.Constant.centerPos = {
			left: halfStageW - halfImgW,
			top: halfStageH - halfImgH
		};

		// 计算左侧，右侧图片的位置排布位置的取值范围
		this.Constant.hPosRange.leftSecX[0] = -halfImgW;
		this.Constant.hPosRange.leftSecX[1] = halfStageW - halfImgW*3;
		this.Constant.hPosRange.rightSecX[0] = halfStageW + halfImgW;
		this.Constant.hPosRange.rightSecX[1] = stageW - halfImgW;
		this.Constant.hPosRange.y[0] = -halfImgH;
		this.Constant.hPosRange.y[1] = stageH - halfImgH;

		// 计算上侧图片的位置排布位置的取值范围
		this.Constant.vPosRange.topY[0] = -halfImgH;
		this.Constant.vPosRange.topY[1] = halfStageH - halfImgH*3;
		this.Constant.vPosRange.x[0] = halfStageW - halfImgW*3;
		this.Constant.vPosRange.x[1] = halfStageW + halfImgW;

		this.rearrange(0);
	},

	render: function() {
		var controllerUnits = [],
			imgFigures = [];

		imageDatas.forEach(function(value, index){
			if(!this.state.imgsArrangeArr[index]){
				this.state.imgsArrangeArr[index] = {
					pos: {
						left: 0,
						top: 0
					},
					rotate: 0
				}
			}
			imgFigures.push(<ImgFigure data={value} ref={'imgFigure' + index} arrange={this.state.imgsArrangeArr[index]} />);
		}.bind(this));

		return (
		  <section className="stage" ref="stage">
		  	<section className="img_sec">
		  		{imgFigures}
		  	</section>
		  	<nav className="controller_nav">
		  		{controllerUnits}
		  	</nav>
		  </section>
		);
	}
});

GalleryByReact.defaultProps = {
};

export default GalleryByReact;
