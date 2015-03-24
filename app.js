var headerHeight = 80;
var gutter = 18;

var windowHeight = $(window).height();
var windowWidth = $(window).width();

var threadWidth = (windowWidth - headerHeight*2 - gutter)/4 - gutter;
var threadHeight = (windowHeight - headerHeight*2 - gutter)/4 - gutter;

var App = {
	init: function(){
		console.info('App.init');
		App.showIntro();
		// App.loadVideos();
		// App.createLoom();
	},
	loadVideos: function(){
		console.info('App.loadVideos');

		$('.thread video').each(function(index){
			$(this).find('source').attr('src', $(this).find('source').data('src'));
		});
	},
	showIntro: function(){
		console.info('App.showIntro')

		$('#intro').addClass('active');

		$(document).on('click', '#intro button', function(){
			$('#intro').removeClass('active').addClass('leave');
			App.createLoom();
		});
	},
	createLoom: function(){
		console.info('App.createLoom');

		$('body').addClass('createLoom');

		// App.drawHeaders();
		// App.createGrid();
		App.createThread();
	},
	drawHeaders: function(){
		console.info('App.drawHeaders');

		$('.header')
			.addClass('active')
			.find('.link')
			.on('click', function(){
				App.openHaiku();
			});

		$(document).on('click', '.bottom button', function(){
			console.info('bottom button click');
			if ( $('.selected').length ) {
				App.animateLoom();
			} else {
				console.info('please choose a thread');
			}
		// $('.buttom button').on('click', function(){
		});
	},
	createThread: function() {

		$('.thread').each(function(index){
			var row = $(this).data('row');
			var column = $(this).data('column');

			var isRow = row >= 0;
			var isColumn = column >= 0;

			var top = headerHeight + gutter + (threadHeight*row) + (gutter*row);
			var left = headerHeight + gutter + (threadWidth*column) + (gutter*column);
			var width = row > -1 ? '100%' : threadWidth;
			var height = column > -1 ? '100%' : threadHeight;

			var style = {};
			style.left = isColumn ? -left : 0;
			style.top = isColumn ? 0 : -top;
			style.width = isColumn ? 0 : width;
			style.height = isColumn ? height : 0;
			style.opacity = 0;

			// var myindex = row || column;
			var myindex = isRow ? $('thread[data-row]').length - row : $('.thread[data-column]').length - column;

			$(this).css(style).delay(500*myindex).animate({
				opacity: 0.25,
				top: isColumn ? 0 : top,
				left: isColumn ? left : 0,
				height: height,
				width: width
			}, 5000, 'swing', function(){
				if (index == $(".thread").length-1 ) {
					console.info('animation complete');

					App.createGrid();
					App.drawHeaders();
				}
			});
		});
	},
	createGrid: function(){
		console.info('App.createGrid');
		$('.grid').each(function(index){

			var row = $(this).data('row');
			var column = $(this).data('column');

			var top = headerHeight + gutter*(row + 1) + threadHeight*row - 1;
			var left = headerHeight + gutter*(column + 1) + threadWidth*column - 1;

			$(this).css({
				height: threadHeight,
				width: threadWidth,
				top: top,
				left: left
			})
			.hover(function(){
				$('[data-row="'+row+'"]').not('.grid').addClass('hover')
					.find('video').get(0).play();
				$('[data-column="'+column+'"]').not('.grid').addClass('hover')
					.find('video').get(0).play();
			}, function(){
				$('[data-row="'+row+'"]').not('.grid').removeClass('hover')
					.find('video').not('.selected').get(0).pause();
				$('[data-column="'+column+'"]').not('.grid').removeClass('hover')
					.find('video').not('.selected').get(0).pause();
			})
			.on('click touchstart', function(event){
				console.info('grid click');
				event.stopPropagation();

				if ($(this).hasClass('selected')) {

					$(this).removeClass('selected');

					$('[data-column="'+column+'"]').not('.grid').removeClass('selected')
						.find('video').not('.selected').removeClass('selected').get(0).pause();
					$('[data-row="'+row+'"]').not('.grid').removeClass('selected')
						.find('video').not('.selected').removeClass('selected').get(0).pause();
				} else {

					$('.grid[data-column="'+column+'"]').removeClass('selected');
					$('.grid[data-row="'+row+'"]').removeClass('selected');

					$('[data-column="'+column+'"]').not('.grid').addClass('selected')
						// .find('video').addClass('selected').get(0).play();
					$('[data-row="'+row+'"]').not('.grid').addClass('selected')
						// .find('video').addClass('selected').get(0).play();

					$(this).addClass('selected');
				}
				App.activatePlayButton();
			});
		});
	},
	activatePlayButton: function(){
		console.info('App.activatePlayButton');
		var selected = $('.grid.selected').length;

		if (selected >= 0) {
			$('button').addClass('active');
		} else {
			$('button').removeClass('active');
		}

		// fix header highlights
		$('.header .link').removeClass('selected');
		$('.grid.selected').each(function(){
			var col = $(this).data('column');
			var row = $(this).data('row');
			$('.link[data-column='+col+']').addClass('selected');
			$('.link[data-row='+row+']').addClass('selected');
		});
	},
	animateLoom: function(){
		console.info('App.animateLoom');
		$('body').addClass('animateLoom');

		// var objects = $('.perceptual, .thread[data-row], .grid');
		// var counter = 0;

		// objects.animate({
		// 	// top: windowHeight
		// }, 5000, 'swing', function(){
		// 	console.info('counter: '+counter);
		// 	if (counter == 0) {
			setTimeout(function(){
				App.showVideo();
			}, 5000);
				// return false;
			// }
			// // console.info(response);
			// counter++;
		// });
	},
	openHaiku: function(haiku){
		console.info('App.openHaiku');
	},
	showVideo: function(sequence){
		console.info('App.showVideo');

		var overlay = $('#video');
		var video = $('<iframe src="https://player.vimeo.com/video/120269753?autoplay=1&color=999&title=0&byline=0&portrait=0" width="500" height="281"></iframe>');

		video.appendTo(overlay);

	}
}

$(document).ready(function(){
	App.init();
});