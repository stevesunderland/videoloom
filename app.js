var headerHeight = 80;
var gutter = 18;

var windowHeight = $(window).height();
var windowWidth = $(window).width();

var threadWidth = (windowWidth - headerHeight*2 - gutter)/4 - gutter;
var threadHeight = (windowHeight - headerHeight*2 - gutter)/4 - gutter;

var _videos = [];

var timeout;

var App = {
	init: function(){
		console.info('App.init');
		App.showIntro();

		$.each( $('.grid'), function(){
			var row = $(this).data('row');
			var column = $(this).data('column');
			var combined = (row+(column*4));

			$(this).data('verse', combined);
		});
		App.getVideos();
		App.loadClips();

		App.logo();
		App.info();
	},
	info: function(){
		$('.infobutton').on('click', function(){
			$('body').toggleClass('showInfo');
		});
	},
	logo: function(){
		$('.logo').on('click', function(){

			if ( $('body').hasClass('showInfo') ) {
				$('body').removeClass('showInfo');
			} else if ( $('body').hasClass('openHaiku') ) { // if haiku is open
				console.info('close haiku');

				$('body').removeClass('openHaiku');
				$('.haiku').removeClass('active');
				clearInterval(timeout);
			} else if ( $('iframe').length ) { // if video is playing
				console.info('close video');

				$('#video').fadeOut('slow', function(){
					$('#videoframe').remove();
					$('#video > iframe').remove();
					$('body').removeClass('animateLoom');
				});
			} else if ( $('body').hasClass('showBio') ) {  // if bio page is open
				console.info('close bio');

				$('body').removeClass('showBio animateLoom');
			} else {
				console.info('show bio');

				App.showBio();
			}
		});
	},
	showBio: function() {
		console.info('App.showBio');

		$('body').addClass('showBio animateLoom');

		$('#bio .section').click(function(){
			$('#bio .section').not(this).removeClass('active');
			$(this).toggleClass('active');
		});
	},
	loadClips: function(){

		$('.thread').each(function(index){
			var video = $(this).find('video');
			var clips = $(this).data('clips');
			App.shuffle(clips);

			video.append('<source src="videos/clip-'+clips[0]+'.mp4" type="video/mp4"></source>');
		});
	},
	shuffle: function(array) {
	  var currentIndex = array.length, temporaryValue, randomIndex ;
	  while (0 !== currentIndex) {
	    randomIndex = Math.floor(Math.random() * currentIndex);
	    currentIndex -= 1;
	    temporaryValue = array[currentIndex];
	    array[currentIndex] = array[randomIndex];
	    array[randomIndex] = temporaryValue;
	  }
	  return array;
	},
	getVideos: function(){
		console.info('app.getVideos');
		$.getJSON('data.json', function(json){
			$(json.videos).each(function(){
				_videos.push(this.id);
			});
		});
	},
	loadVideos: function(){
		console.info('App.loadVideos');

		$('.thread video').each(function(index){
			$(this).find('source').attr('src', $(this).find('source').data('src'));
		});
	},
	showIntro: function(){
		console.info('App.showIntro');

		$('body').addClass('showIntro');
		$('#intro').addClass('active');

		$(document).on('click', '#intro button', function(){
			$('#intro .slide').t('pause');
			$('#intro').removeClass('active').addClass('leave');


			$('#video, #video > video').fadeOut(1000, function(){
				$('#video > video').remove();
			});

			App.createLoom();
		});
		App.typewriter();
	},
	typewriter: function(){
		var slides = $('#intro .slide');
		var counter = 0;
		var slideshow;
		var clips = [1,3,6,7,10,12,14,16,17,19,20,22,25];

		$(slides[0]).css('height', $(slides[0]).height() );

		App.shuffle(clips);
		clips = clips.slice(0,slides.length);

		$('#video').html('<video loop="loop" autoplay="autoplay"><source src="videos/intro-text-video.mp4" type="video/mp4"></source></video>').find('video').hide().fadeIn(2000);

		function slide() {

			var currentSlide = $(slides[counter]);
			var textLength = currentSlide.text().length;
			var duration = textLength * 40;

			if ( counter == slides.length-1) {
				$('.introbutton').css('opacity', 0);
			}	

			currentSlide.fadeIn(5000, function(){
				if ( counter == 0 ) {
					type();
					return false;
				}

				if ( counter == slides.length-1) {
					// $('.introbutton').fadeOut('slow');
					return false;
				}	
				
				slideshow = setTimeout(function(){
					// $('#video > video').animate({ opacity: 0 }, 2000, function(){
						// $(this).attr('src', 'videos/clip-'+clips[counter+1]+'.mp4').animate({ opacity: 1 }, 2000);
					// });
					currentSlide.fadeOut(5000, function(){
						counter++;
						slide();
					});
				}, duration);
			});
		}

		slide();

		function type() {
			console.info('type');

			$(slides[counter]).t({
				speed: 40,
				delay: counter == 0 ? 5 : 1,
				blink: 500,
				caret: false,
				fin: function(el) {
					$(el).fadeOut(5000, function(){
						counter++;
						slide();
					});
				}
			});
		 }
	},
	createLoom: function(){
		console.info('App.createLoom');

		// App.getVideos();
		// App.loadClips();

		$('body').removeClass('showIntro').addClass('createLoom');

		App.createThread();
	},
	drawHeaders: function(){
		console.info('App.drawHeaders');

		$('.header')
			.addClass('active')
			.find('.link')
			.on('click', function(event){
				$('.haiku').removeClass('active').find('.slide').removeClass('active');
				$(this).addClass('active');

				App.openHaiku( $(this).text() );
			});

		$(document).on('click', '.bottom button', function(){
			console.info('bottom button click');
			if ( $('.grid.selected').length == 4 ) {
				App.animateLoom();
			} else {
				console.info('please choose a thread');
			}
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

			var myindex = isRow ? $('thread[data-row]').length - row : $('.thread[data-column]').length - column;

			$(this).find('video').css({
				marginLeft: isColumn ? -left + 80 : 0,
				marginTop: isColumn ? 0 : -top + 80
			})

			$(this).css(style).delay(500*index).animate({
				opacity: 0.5,
				top: isColumn ? 0 : top,
				left: isColumn ? left : 0,
				height: height,
				width: width
			}, 5000, 'swing', function(){
				if (index == $(".thread").length-1 ) {
					console.info('animation complete');

					App.createGrid();
					App.drawHeaders();

					setTimeout(function(){
						$('body').addClass('showInstructions');
						setTimeout(function(){
							$('body').removeClass('showInstructions');
							setTimeout(function(){
								$('#instructions').remove();
							}, 1000*5);
						}, 1000*10);
					}, 1000*5);
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
					.find('video');
				$('[data-column="'+column+'"]').not('.grid').addClass('hover')
					.find('video');

				$('[data-column="'+column+'"], [data-row="'+row+'"]').not('.grid').find('video').not('.selected').each(function(){
					var video = $(this).get(0);
					// video.playbackRate = 0.5;
					video.play();
				});
			}, function(){
				$('[data-row="'+row+'"]').not('.grid').removeClass('hover')
					.find('video').not('.selected');
				$('[data-column="'+column+'"]').not('.grid').removeClass('hover')
					.find('video').not('.selected');

				$('[data-column="'+column+'"], [data-row="'+row+'"]').not('.grid').find('video').not('.selected').each(function(){
					var video = $(this).get(0);
					// video.playbackRate = 0.2;
					video.pause();
				});
			})
			.on('click touchstart', function(event){
				event.stopPropagation();

				if ( $(this).hasClass('disabled') ) {
					return false;
				}
				if ($(this).hasClass('selected')) {
					$(this).removeClass('selected');
					$('[data-column="'+column+'"]').not('.grid').removeClass('selected')
						.find('video').not('.selected').removeClass('selected');
					$('[data-row="'+row+'"]').not('.grid').removeClass('selected')
						.find('video').not('.selected').removeClass('selected');

					$('[data-column="'+column+'"], [data-row="'+row+'"]').not('.grid').find('video').not('.selected').each(function(){
						var video = $(this).get(0);
						// video.playbackRate = 0.2;
						video.pause();
					});

				} else {
					$('.grid[data-column="'+column+'"]').removeClass('selected');
					$('.grid[data-row="'+row+'"]').removeClass('selected');

					$('[data-column="'+column+'"]').not('.grid').addClass('selected')
						.find('video').addClass('selected');
					$('[data-row="'+row+'"]').not('.grid').addClass('selected')
						.find('video').addClass('selected');

					$('[data-column="'+column+'"], [data-row="'+row+'"]').not('.grid').find('video').each(function(){
						var video = $(this).get(0);
						// video.playbackRate = 1;
						video.play();
					});

					$(this).addClass('selected');
				}
				App.activatePlayButton();
			});
		});
	},
	activatePlayButton: function(){
		console.info('App.activatePlayButton');
		var selected = $('.grid.selected').length;

		if (selected == 4) {
			$('#playButton').addClass('active');
		} else {
			$('#playButton').removeClass('active');
		}
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

		App.playSequence();
	},
	openHaiku: function(haiku){
		console.info('App.openHaiku: '+haiku);

		$('body').addClass('openHaiku');

		var slider = $('.haiku.'+haiku);
		var slides = slider.find('.slide');
		var speed = 1000*13;
		var slidecounter = 1;

		slider.addClass('active');

		$(slides).each(function(){
			$(this).find('.sidebar, .image').each(function(){
				$(this).css('backgroundImage', 'url(' + $(this).data('bg') + ')' );
			});
		});

		$(slides[0]).addClass('active');
		
		timeout = setInterval(function(){
			$(slides).not( $(slides[slidecounter]) ).removeClass('active');
			$(slides[slidecounter]).addClass('active');
			speed = 1000*3;
			slidecounter ++;
			if ( slidecounter == slides.length ) slidecounter = 0;
		}, speed);
	},
	getSequence: function(){
		console.info('App.getSequence');
		var sequence = [];
		var selected = $('.grid.selected');

		$.each(selected, function(item){
			$(this).removeClass('selected').addClass('disabled');

			var verse = $(this).data('verse');
			var video = _videos[verse];

			sequence.push(video);
		});
		return sequence;
	},
	playSequence: function(sequence){
		console.info('App.playSequence');

		var sequence = App.getSequence();
		var videocounter = 0;
		var overlay = $('#video');
		
		initVideo();

		function initVideo(vimeoid) {
			console.info('initVideo');

			$('#video').fadeOut('slow', function(){
				$('#video>iframe').remove();

				var video = $('<iframe src="https://player.vimeo.com/video/'+sequence[videocounter]+'?autoplay=1&color=999&title=0&byline=0&portrait=0&api=1&player_id=videoframe'+videocounter+'" width="500" height="281" id="videoframe'+videocounter+'"></iframe>');
				
				video.appendTo(overlay);
				overlay.fadeIn();
				
				var player = new Froogaloop( $('#videoframe'+videocounter)[0] );

				player.addEvent('ready', function(){
					console.info('player.ready');
					player.addEvent('finish', onFinish);
				});
			});
		}
		function onFinish(id) {
		    console.log('player.finish');

		    videocounter++;

		    if (videocounter < sequence.length) {
		    	overlay.fadeOut('slow', function(){
		    		initVideo();
		    	});
		    } else {
		    	console.info('return to loom');
		    	$('#video').fadeOut('slow', function(){
		    		$('#videoframe').remove();
		    		$('body').removeClass('animateLoom');
		    	});
		    }
		}
	}
}
$(document).ready(function(){
	App.init();
});