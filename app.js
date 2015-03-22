var axis = ["perceptual", "conceptual"];
var headerHeight = 80;
var gutter = 18;

var windowHeight = $(window).height();
var windowWidth = $(window).width();

var threadWidth = (windowWidth - headerHeight*2 - gutter)/4 - gutter;
var threadHeight = (windowHeight - headerHeight*2 - gutter)/4 - gutter;

// console.info('threadWidth: '+threadWidth);
// console.info('threadHeight: '+threadHeight);

var App = {
	init: function(){
		App.createLoom();
	},
	createLoom: function(){
		// console.info('begin create loom');
		//draw headers
		App.drawHeaders();
		App.createGrid();
	},
	drawHeaders: function(){
		console.info('drawHeaders');

		$.each(axis, function(index){

			var axis = this;
			var axisIndex = index;
			var header = $('<div>').addClass('header '+this);
			var threads = ["one", "two", "three", "four"];
			var buttons = $('<div>').addClass('buttons');

			$('<div>').addClass('title').text(this).appendTo(header);

			$.each(threads, function(index){
				var thread = this;

				$('<div>')
					.addClass('link '+thread)
					.text(this)
					.appendTo(buttons)
					.attr('data-column', (axisIndex == 0 ? index : null ))
					.attr('data-row', (axisIndex == 0 ? null : (3-index) ))
					.on('click', function(){
						App.openHaiku(thread);
					});

				App.createThread(thread, axisIndex, index);
			});

			buttons.appendTo(header);

			var h = -windowWidth/4+'px';
			var t = -windowHeight/2+'px';

			header.appendTo('body').css({
				// height: index == 0 ? headerHeight : '100%',
				// width: index == 0 ? '100%' : headerHeight
				height: headerHeight,
				width: index == 0 ? '100%' : windowHeight,
				transform: (index == 0 ? '' : 'rotate(-90deg) translate('+h+', '+t+')')
			});
		});

		var footer = $('<div>').addClass('header');

		$('<button>')
			.text('Play Sequence')
			.appendTo(footer)
			.on('click', function(){
				// alert('amazing beautful things happen now...');
				App.animateLoom();
			});

		footer.css({
			bottom: 0,
			top: (windowHeight-headerHeight),
			height: headerHeight,
			width: '100%'
		}).appendTo('body');

	},
	createThread: function(thread, axis, index) {

		var left = headerHeight + gutter + (threadWidth*index) + (gutter*index);
		var top = headerHeight + gutter + (threadHeight*index) + (gutter*index);

		// console.info('thread: '+thread);
		// console.info('axis: '+axis);
		// console.info('index: '+index);

		var video = $('<video>')
					.attr('autoplay', true)
					.attr('muted', true)
					.attr('loop', true)
					.append('<source src="videos/video-'+((axis+index)+1)+'.mp4">')

		$('<div>').addClass('thread '+thread).appendTo('body').css({
			// backgroundColor: axis == 0 ? 'pink' : 'blue',
			width: axis == 0 ? threadWidth : '100%',
			height: axis == 0 ? '100%' : threadHeight,
			left: axis == 0 ? left : 0,
			top: axis == 0 ? 0 : top
		})
		.attr('data-column', (axis == 0 ? index : null ))
		.attr('data-row', (axis == 0 ? null : index ))
		.on('click touchstart', function(){
			// $(this).toggleClass('selected')
		})
		.append(video);
	},
	createGrid: function(){
		var xthreads = [1,2,3,4];
		$.each(xthreads, function(index){
			var axisIndex = index;
			var ythreads = [1,2,3,4];
			$.each(ythreads, function(index){
				// console.info('index: '+index);
				// console.info('axisIndex: '+axisIndex);

				var top = headerHeight + gutter*(axisIndex + 1) + threadHeight*axisIndex - 1;
				var left = headerHeight + gutter*(index + 1) + threadWidth*index - 1;
				// var left = 0;


				$('<div>').addClass('grid')
				.css({
					height: threadHeight,
					width: threadWidth,
					top: top,
					left: left
				})
				.attr('data-column', index)
				.attr('data-row', axisIndex)
				.appendTo('body')
				.hover(function(){
					// console.info('mousein');
					// highlight rows columns
					$('[data-row="'+axisIndex+'"]').not('.grid').addClass('hover');
					$('[data-column="'+index+'"]').not('.grid').addClass('hover');
				}, function(){
					// console.info('mouseout');
					$('[data-row="'+axisIndex+'"]').not('.grid').removeClass('hover');
					$('[data-column="'+index+'"]').not('.grid').removeClass('hover');
					// high
				})
				.on('click touchstart', function(){
					if ($(this).hasClass('selected')) {
						//
						$(this).removeClass('selected');

						$('[data-column="'+index+'"]').not('.grid').removeClass('selected');
						$('[data-row="'+axisIndex+'"]').not('.grid').removeClass('selected');
					} else {

						$('.grid[data-column="'+index+'"]').removeClass('selected');
						$('.grid[data-row="'+axisIndex+'"]').removeClass('selected');

						$('[data-column="'+index+'"]').not('.grid').addClass('selected');
						$('[data-row="'+axisIndex+'"]').not('.grid').addClass('selected');

						$(this).addClass('selected');
					}
					App.activatePlayButton();
				});
			});

		});
	},
	activatePlayButton: function(){
		var selected = $('.grid.selected').length;
		// console.info('selected: '+selected);

		// if (selected >= 4) {
		if (selected >= 0) {
			$('button').addClass('active');
			// console.info('active button');
		} else {
			$('button').removeClass('active');
			// console.info('deactivate button');
		}

		// fix header highlights
		$('.header .link').removeClass('selected');
		$('.grid.selected').each(function(){
			// console.info('got one');
			var col = $(this).data('column');
			var row = $(this).data('row');
			$('.link[data-column='+col+']').addClass('selected');
			$('.link[data-row='+row+']').addClass('selected');
		});

	},
	animateLoom: function(){
		var rows = $('.thread[data-row], .grid.selected');
		// var rows = $('.grid.selected');
		var top = windowHeight - headerHeight - threadHeight - gutter;
		rows.animate({
			top: top,
			opacity: 0
		}, 1000, function(){
			App.showVideo(sequence);
		});

		var sequence = $('.grid.selected');
	},
	openHaiku: function(haiku){
		// console.info('openHaiku '+haiku);
	},
	showVideo: function(sequence){
		// create an overlay
		$('<div>')
			.addClass('overlay')
			.appendTo('body')
			.hide()
			.fadeIn(5000);

		var video = $('<video>')
			.attr('autoplay', true)
			.attr('loop', true)
			.append('<source src="videos/video-2.mp4"></source>')

		video.appendTo('.overlay');

	}
}

$(document).ready(function(){
	App.init();
});