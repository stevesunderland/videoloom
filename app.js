(function(){

	var canvas = this.__canvas = new fabric.Canvas('c', {
		hoverCursor: 'pointer',
	   // selection: false,
	   perPixelTargetFind: true,
	   targetFindTolerance: 5
	});

	canvas.setWidth($(window).width());
	canvas.setHeight($(window).height());
	canvas.backgroundColor = 'rgba(0,0,0,0.5)';

	initFindTarget(canvas); 

	canvas.on('object:over', function(e) {
		if (e.target.hoverMe) {

		  e.target.animate('opacity', 1, { duration: 100 });
		  canvas.renderAll();

		  highlightRows(e.target, true);

		}
	});
	canvas.on('object:out', function(e) {
		if (e.target.hoverMe) {

		  if ( e.target.chosen == true ) { return false; }

		  e.target.animate('opacity', 0, { duration: 100 });
		  canvas.renderAll();

		  highlightRows(e.target, false);

		}
	});

	canvas.on('mouse:down', function(e){

		var object = canvas.getActiveObject();

		if (object.hoverMe) {

			var row = object.row;
			var column = object.column;

			var objects = canvas.getObjects();

			// deselect objects in same row
			$.each(objects, function(index, item){
				if (item.row == row || item.column == column) {
					// console.info('ma');
					item.chosen = false;

					if (item.hoverMe ) {
						item.animate('opacity', 0);
					}
				}
			});
			// highlightRows(object, false);


			object.chosen = true;

			object.animate('opacity', 1);


			$.each(objects, function(index, object){
				if ( object.text ) {
					if (object.row == row || object.column == column) {
						object.chosen = true;
					}
				}
			});

			enableButton();
		}

		//

		if (object.isButton || object.isButtonText) {
			if ( object.enabled ) {
				animateLoom();
			}
		}
	});

	function animateLoom() {
		var objects = canvas.getObjects();
		$.each(objects, function(index, object){
			// if ( object.isVideo || object.hoverMe ) {
			var top = canvas.height - headerHeight - rowHeight + 20;

			if ( object.hoverMe ) {
				object.animate('top', canvas.height, {duration: 2000});
			} else {
				// object.animate('opacity', 0);
			}
			if (object.isVideo && object.row >= -1) {
				// console.info('object.top: '+object.top);
				// object.animate('opacity', 0);
				object.animate('top', '+='+(canvas.height - headerHeight), {duration: 2000});
			}
			if ( object.isLoom ) {
				object.animate('height', canvas.height, {duration: 2000, onComplete: function(){
					object.animate('top', canvas.height, {duration: 3000});
					fadeOutObjects();
				}});
				object.animate('opacity', 1, {duration: 2000 });
			}
		});
	}

	function fadeOutObjects(){
		var objects = canvas.getObjects();
		$.each(objects, function(index, object){
			if (object.isLoom) { return false; }
			// if (object.isVideo) {
				object.animate('opacity', 0, {duration: 1000});
			// }
		});
	}

	function enableButton() {

		var selectedItems = [];
		var objects = canvas.getObjects();

		// deselect objects in same row
		$.each(objects, function(index, item){
			if ( item.hoverMe && item.chosen ) {
				selectedItems.push(item);

			}
			if (selectedItems.length == 4 ) {
				// console.info('show the button bitch');
				$.each(objects, function(index, object){
					if ( object.isButton ) {
						// console.info('im da button im da button');
						object.set('stroke', 'gold');
						object.set('fill', 'gold');
						object.enabled = true;
					}
					if (object.isButtonText) {
						object.set('fill', '#333');
						object.enabled = true;
					}
				});
			} else {
				// disable the button
				// console.info('disable the button bitch');
				$.each(objects, function(index, object){
					if ( object.isButton ) {
						object.set('stroke', 'rgba(255,255,255,0.5');
						object.set('fill', 'rgba(0,0,0,0.01');
							object.enabled = false;
					}
					if (object.isButtonText) {
						object.set('fill', 'rgba(255,255,255,0.5');
							object.enabled = false;
					}
				});
			}
		});
	}

	function highlightRows (target, status) {
		var row = target.row;
		var column = target.column;

		var objects = canvas.getObjects();
		$.each(objects, function(index, object){

			if (object.row == row || object.column == column) {

				if (object.hoverMe == true) return false;

				if (status == true) {

					if (object.isVideo) {
						object.getElement().play();
						// object.animate('opacity', 0.8);
					} else {
						object.animate('opacity', 1, { duration: 250 });
						object.set('fill', 'gold');
					}

				} else {

					if ( object.chosen == true ) { return false; }

					if (object.isVideo) {
						object.getElement().pause();
						// object.animate('opacity', 0.5);
					} else {
						object.animate('opacity', 0.5, { duration: 250 });
						object.set('fill', 'white');

					}
				}
			}
		});
	}


	var headerHeight = 100;

	var xLabels = ['ASSEMBLEDGE', 'ADAPTABILITY', 'EMBODIMENT', 'CONNECTIVITY'];
	var yLabels = ['LANDSCAPE', 'HUMANITY', 'BIODIVERSITY', 'UNDERGROUND'];

	function addNavigation() { 
		var xHeader = new fabric.Rect({
			top: 0, left: 0, height: headerHeight-20, width: canvas.width,
			fill: 'rgba(0,0,0,0.5)'
		});

		var yHeader = new fabric.Rect({
			top: 0, left: 0, height: canvas.height, width: headerHeight-20,
			fill: 'rgba(0,0,0,0.5)'
		});

		var zHeader = new fabric.Rect({
			top: canvas.height - headerHeight +20,
			left: 0,
			width: canvas.width,
			height: headerHeight -20,
			fill: 'rgba(0,0,0,0.5)'
		})

		canvas.add(xHeader, yHeader, zHeader);

		// ADD LABELS
		$.each(xLabels, function(index, label){
			var left = (rowWidth*index)+headerHeight+(rowWidth/2) -40;
			var top = headerHeight/2;
			var text = new fabric.Text(xLabels[index], { 
				left: left, top: top,
				fontFamily: 'Helvetica',
				fontWeight: 'lighter',
				fontSize: 12,
				textAlign: 'center',
				fill: 'rgba(255,255,255,0.5)',
				column: index
			});

			text.hasControls = false;
			text.hasBorders = false;
			text.lockMovementX = text.lockMovementY = true;

			canvas.add(text);
		});

		var xText = new fabric.Text('C O N C E P T U A L', {
			left: canvas.width/2 -100, top: 10,
			fontFamily: 'Helvetica',
			fontWeight: 'lighter',
			fontSize: 20,
			textAlign: 'center',
			fill: 'rgba(255,255,255,0.5)'
		});
		canvas.add(xText)

		$.each(yLabels, function(index, label){
			var top = (rowHeight*index)+headerHeight+(rowHeight/2)+30;
			var left = (headerHeight/2);

			var text = new fabric.Text(yLabels[index], {
				left: left, top: top,
				fontFamily: 'Helvetica',
				fontWeight: 'lighter',
				fontSize: 12,
				textAlign: 'center',
				fill: 'rgba(255,255,255,0.5)',
				angle: -90,
				row: index
			});

			text.hasControls = false;
			text.hasBorders = false;
			text.lockMovementX = text.lockMovementY = true;

			canvas.add(text);
		});

		var yText = new fabric.Text('P E R C E P T U A L', {
			left: 10, top: (canvas.height-headerHeight)/2 + headerHeight + 40,
			fontFamily: 'Helvetica',
			fontWeight: 'lighter',
			fontSize: 20,
			textAlign: 'center',
			fill: 'rgba(255,255,255,0.5)',
			angle: -90
		});
		canvas.add(yText);

		// add play button
		var button = new fabric.Rect({
			top: canvas.height - headerHeight + 35,
			left: canvas.width/2 - 150,
			width: 300,
			height: headerHeight/2,
			fill: 'rgba(0,0,0,0.1)',
			stroke: 'rgba(255,255,255,0.5)',
			isButton: true
		});
		var buttonText = new fabric.Text('PLAY SEQUENCE', {
			left: canvas.width/2 - 70,
			top: canvas.height - headerHeight + 48,
			fontFamily: 'Helvetica',
			fontWeight: 'lighter',
			fontSize: 18,
			textAlign: 'center',
			fill: 'rgba(255,255,255,0.5)',
			isButtonText: true,
		});

		button.hasControls = false;
		button.hasBorders = false;
		button.lockMovementX = button.lockMovementY = true;

		buttonText.hasControls = false;
		buttonText.hasBorders = false;
		buttonText.lockMovementX = buttonText.lockMovementY = true;

		canvas.add(button, buttonText);

		// loom bar 
		var loomBar = new fabric.Rect({
			top: 0,
			left: 0,
			height: 0,
			width: canvas.width,
			fill: 'rgba(0,0,0,0.8)',
			opacity: 0,
			isLoom: true
		});
		canvas.add(loomBar);

	}

	var rowHeight = (canvas.height - headerHeight*2)/4 +5;
	var rowWidth = (canvas.width - headerHeight*2)/4;


	function setupVideos() {

		var videosX = ['video1', 'video2', 'video3', 'video4'];
		var videosY = ['video5', 'video6', 'video7', 'video8'];


		$.each(videosY, function(index, video){

			var leftOffset = (-(canvas.width)/2)+(rowWidth*index) + headerHeight;

			var thisVideoEl = document.getElementById(videosY[index]);
			var thisVideo = new fabric.Image(thisVideoEl, {
				left: 0,
				top: 0,
				originX: 'top',
				originY: 'left',
				width: canvas.width,
				height: canvas.height,
				opacity: 0,
				column: index,
				isVideo: true,
				clipTo: function(ctx) {
					ctx.rect( leftOffset, -(canvas.height/2), rowWidth-20, canvas.height );
				}
			});

			renderVideo(thisVideo, 'top');

		});

		$.each(videosX, function(index, video){

			var topOffset = (-(canvas.height)/2)+(rowHeight*index) + headerHeight;

			var thisVideoEl = document.getElementById(videosX[index]);
			var thisVideo = new fabric.Image(thisVideoEl, {
				left: 0,
				top: 0,
				originX: 'top',
				originY: 'left',
				width: canvas.width,
				height: canvas.height,
				opacity: 0,
				row: index,
				isVideo: true,
				clipTo: function(ctx) {
					ctx.rect( -(canvas.width/2), topOffset, canvas.width, rowHeight-20 );
				}
			});


			renderVideo(thisVideo, 'left');

		});

		function renderVideo(video, direction) {

			video.hasControls = false;
			video.hasBorders = false;
			video.lockMovementX = video.lockMovementY = false;

			canvas.add(video);
			video.center();
			// video.getElement().play();
			video.animate('opacity', 0.5, { duration: 3000 });
		}

	}

	function drawGrid() {
		for (c = 0; c < 4; c++) {
			for (r = 0; r < 4; r++) {
				var top = (rowHeight * r) + headerHeight;
				var left = (rowWidth * c) + headerHeight;
				var grid = new fabric.Rect({
					top: top-1,
					left: left-1,
					height: rowHeight - 20,
					width: rowWidth - 20,
					strokeWidth: 2,
					stroke: 'gold',
					fill: 'rgba(255,255,255,0.01)',
					opacity: 0,
				});

				grid.hasControls = false;
				grid.hasBorders = false;
				grid.lockMovementX = grid.lockMovementY = true;
				grid.hoverMe = true;

				grid.row = r;
				grid.column = c;

				canvas.add(grid);
			}
		}
	}

	setupVideos();

	addNavigation();

	drawGrid();

	fabric.util.requestAnimFrame(function render() {
		canvas.renderAll();
		fabric.util.requestAnimFrame(render);
	});

	function initFindTarget(fabricCanvas) {
	    fabricCanvas.findTarget = (function (originalFn) {
	        return function (e) {
	            var currentTarget,
	                foundIndexes = [],
	                foundIndex,
	                targets = [];


	            // check all of the objects on canvas
	            // Cache all targets where their bounding box contains point.
	            for (var i = this._objects.length; i--;) {
	                if (this._objects[i] && this.containsPoint(e, this._objects[i])) {
	                    targets[targets.length] = this._objects[i];
	                }
	            }

	            // create an array of hovered targets if we don't already have one
	            if (typeof this._hoveredTargets === 'undefined') {
	                this._hoveredTargets = [];
	            }

	            // go through each target
	            for (var j = 0, lenJ = targets.length; j < lenJ; j++) {
	                currentTarget = targets[j];

	                // see if the target is in the list of hovered targets
	                foundIndex = this._hoveredTargets.indexOf(currentTarget);

	                if (foundIndex !== -1) {
	                    // if it isn't, it's a new hover so fire object:over event
	                    this.fire('object:over', { target: currentTarget });
	                    // we need to add this list of the targets that we found
	                    // so we can know what wasn't found later
	                    foundIndexes.push(foundIndex);
	                }
	            }

	            // go through all the hovered targets and fire object out on the no longer hovered objects
	            for (var k = 0, lenK = this._hoveredTargets.length; k < lenK; k++) {
	                // if this object wasn't found, fire the object:out on it
	                if (foundIndexes.indexOf(k) === -1) {
	                    this.fire('object:out', {target: this._hoveredTargets[k]})
	                }
	            }

	            // set the hoveredTargets to be everything that we found
	            this._hoveredTargets = targets;

	            // do wot the original function did
	            return originalFn.apply(this, arguments);
	        };
	    })(fabricCanvas.findTarget);
	}

})();

