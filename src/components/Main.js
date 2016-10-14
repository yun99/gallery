require('styles/App.css');
require('styles/style.sass');

import React from 'react';

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

var ImgFigure = React.createClass({
	render: function(){
		return (
			<figure className="img_figure">
				<img src={this.props.data.imageURL} alt={this.props.data.title} />
				<figcaption>
					<h2 className="img_title">{this.props.data.title}</h2>
				</figcaption>
			</figure>
		);
	}
});

class GalleryByReact extends React.Component {
  render() {
  	var controllerUnits = [],
  		imgFigures = [];

  	imageDatas.forEach(function(value){
  		imgFigures.push(<ImgFigure data={value} />);
  	});

    return (
      <section className="stage">
      	<section className="img_sec">
      		{imgFigures}
      	</section>
      	<nav className="controller_nav">
      		{controllerUnits}
      	</nav>
      </section>
    );
  }
}

GalleryByReact.defaultProps = {
};

export default GalleryByReact;
