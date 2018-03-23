'use strict';
//angular.module('myApp', ['flickr','ui.bootstrap']);
angular.module('myApp', ['flickr','ui.bootstrap'])
	.controller('AppController', [function() {
	  var self = this;
	  
	}])
	.directive('imageWidget', function(flickrFactory,$timeout) {
		return{
			restrict : 'EA',
			templateUrl: 'components/image-component/views/image-directive.html',
			link: function(scope, ele, attrs) { 
			  scope.editedImages = []; 
			  scope.show = true;
			  var canvas = '';
			  var count = 0; 
			  
			  
			   //used to get the image based on entered text in the textbox 
			  scope.getImage = function() {
				flickrFactory.getImagesByTags({
				  tags: scope.tags,
				  tagmode: "any" 
				}).then(function(_data) { 
					  scope.selectedImage = '';
					  _data.data.items.length > 0 ? (scope.selectedImage = _data.data.items[0].media.m) : (scope.selectedImage = '');				  
					  if(scope.selectedImage){
						 canvas = window._canvas = new fabric.Canvas('myCanvas');
						  canvas.clear();
						  var img = new Image();
						  var center = canvas.getCenter();
						  img.src = scope.selectedImage;
						  canvas.setBackgroundImage(img.src, canvas.renderAll.bind(canvas), {
							top: center.top,
							left: center.left,
							originX: 'center',
							originY: 'center'
						  }); 
						  $('#model').modal('show');
					  }else{
						  alert("Please give proper input like TIGER,LION, etc.");
					  }				 		  
				})
				.catch(function (_data) {
					alert("error while getting image : "+_data);
				});
			  };
			  			 
			  scope.saveImage = function() { 
				  var canvasDiv = document.getElementById("canvasImageDiv");
				  fabric.Image.fromURL(scope.selectedImage, function(fimg) {
					 scope.show = false;
					 //creating dynamic canvas elements to show the saved images with added text 
					 var canvasElement =  document.createElement("canvas");
					 var div =  document.createElement("div");
					 canvasElement.setAttribute("id","savedImages"+count);
					  div.setAttribute("class","row col-md-4 col-lg-4 col-sm-4"); 
					 div.appendChild(canvasElement);
					 canvasDiv.appendChild(div);
					 canvas.clear();
					  canvas.add(fimg); 
					  var str = JSON.stringify(canvas);
					  canvas.loadFromDatalessJSON(str); 
					  scope.editedImages.push(JSON.stringify(canvas));
					  $('#model').modal('hide');
					  ++count;
				});
				$timeout(function(){ 
					if (scope.editedImages.length > 0) {
						scope.editedImages.map(function(img,i){
							var ele = $("#canvasImageDiv canvas#savedImages"+i).attr("id");
							var canvas = window._canvas = new fabric.Canvas(ele);
							canvas.loadFromJSON(img, canvas.renderAll.bind(canvas));
						})
					  } else {
						scope.show = true;
					  }
				},100);
			  };
			  
			  scope.addText = function() {
				canvas.add(new fabric.Text('hello world', { left: 100, top: 100 }));
			  }
			  
			  scope.deleteText = function(){
				   var objects = canvas.getObjects('text');
					for(var i = 0; i < objects.length; i++){
						canvas.item(i).remove();        
					}
			  }
			  scope.addlLne = function(){
				  canvas.add(new fabric.Line([10, 5 * 30, 500, 5 * 30], {
					stroke: 'red',
					selectable: false
				}));
			  }
			  
			  scope.removelLne = function(){
				  var objects = canvas.getObjects('line');
					for(var i = 0; i < objects.length; i++){
						canvas.item(i).remove();        
					}   
			  }
			}
		}
	});
	
//https://github.com/JohnnyTheTank/angular-flickr-api-factory
//http://fabricjs.com/image-filters