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
			  var increment = 0; 
			  //function to save the edited image in json format and load the saved image from json 
			  scope.fnsaveData = function() { 
				  var canvasElementMainDiv = document.getElementById("mainDiv");
				  fabric.Image.fromURL(scope.totalImages, function(oImg) {
				 scope.show = false;
				 //creating dynamic canvas elements to show the saved images with added text 
				 var canvasElement =  document.createElement("canvas");
				 var innerDivElement =  document.createElement("div");
				 canvasElement.setAttribute("id","savedImages"+increment);
				 canvasElement.setAttribute("class","canvasImageWidth");
				 innerDivElement.setAttribute("class","col-sm-3 innerDivStyle"); 
				 innerDivElement.appendChild(canvasElement);
				 
		   
				 canvasElementMainDiv.appendChild(innerDivElement);
				  canvas.add(oImg); 
				  var serialized = JSON.stringify(canvas);
				  canvas.loadFromDatalessJSON(serialized); 
				  scope.editedImages.push(JSON.stringify(canvas)); 
				  canvas.clear();
				
				  $('#canvasModal').modal('hide');
				  ++increment;
				});
				$timeout(function(){ 
					if (scope.editedImages.length > 0) {
						_.each(scope.editedImages, function(value, key) {
						   var canvasElement = document.getElementById('mainDiv').querySelectorAll('[id^="savedImage"]')[key].id;
						  var canvas = window._canvas = new fabric.Canvas(canvasElement);
						  canvas.loadFromJSON(value, canvas.renderAll.bind(canvas));
						});
					  } else {
						scope.show = true;
					  }
				},100);
			  };

			  //function to add text on image 
			  scope.Addtext = function() {
				canvas.add(new fabric.IText('Tap and Type', {
				  left: 50,
				  top: 100,
				  fontFamily: 'arial black',
				  fill: '#333',
				  fontSize: 50
				}));
			  };
			  //function to search image through search 
			  scope.fnSearchImages = function() {
				flickrFactory.getImagesByTags({
				  tags: scope.tags,
				  tagmode: "any",
				  lang: "de-de", 
				}).then(function(_data) { 
				  scope.totalImages = '';
				  _.each(_data.data.items, function(value, key) {
					if (scope.totalImages === "") {
					  scope.totalImages = value.media.m;
					  scope.tags = '';
					}
				  });
				  var canvasele = document.getElementById('canvasModal').querySelectorAll('[id^="myCanvas"]')[0].id;
				  $('#canvasModal').modal('show');
				  canvas = window._canvas = new fabric.Canvas(canvasele);
				  canvas.clear();
				  var imgObj = new Image();
				  var center = canvas.getCenter();
				  imgObj.src = '';
				  imgObj.src = scope.totalImages;
				  canvas.setBackgroundImage(imgObj.src, canvas.renderAll.bind(canvas), {
					scaleX: canvas.width / imgObj.width,
					scaleY: canvas.height / imgObj.height,
					top: center.top,
					left: center.left,
					originX: 'center',
					originY: 'center'
				  });
				  
				});
			  };
			}
		}
	});
	
	//https://github.com/JohnnyTheTank/angular-flickr-api-factory