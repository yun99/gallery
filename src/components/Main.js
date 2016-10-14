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

class GalleryByReact extends React.Component {
  render() {
    return (
      <section className="stage">
      	<section className="img_sec">
      	</section>
      	<nav class="controller_nav">
      	</nav>
      </section>
    );
  }
}

GalleryByReact.defaultProps = {
};

export default GalleryByReact;
