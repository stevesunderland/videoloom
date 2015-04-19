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
		// App.openHaiku('landscape');
		// App.showBio();

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
		// var clips = [1,2,3,4,5,6,7,10,11,12,13,14,15,16,17,18,19,20,21,22,24,25];
		// var clips = [1,3,6,7,10,12,14,16,17,19,20,22,25];
		// App.shuffle(clips);
		// clips = clips.slice(0,8);

		$('.thread').each(function(index){
			var clips = $(this).data('clips');
			App.shuffle(clips);

			var video = $(this).find('video');
			// $(this).find('video').get(0).defaultPlaybackRate = 0.1;
			video.append('<source src="videos/clip-'+clips[0]+'.mp4" type="video/mp4"></source>');
			// video.get(0).playbackRate = 0.2;
			// video.get(0).play();

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
				// $('#video').fadeOut(0);
			App.createLoom();
		});
		App.typewriter();
	},
	typewriter: function(){
		var slides = $('#intro .slide');

		// $(slides).each(function(){
		// 	$(this).css('height', $(this).height() );
		// });

		$(slides[0]).css('height', $(slides[0]).height() );

		var counter = 0;
		var clips = [1,3,6,7,10,12,14,16,17,19,20,22,25];
		App.shuffle(clips);
		clips = clips.slice(0,slides.length);

		$('#video').html('<video loop="loop" autoplay="autoplay" muted><source src="videos/clip-'+clips[counter]+'.mp4" type="video/mp4"></source></video>').find('video').hide().fadeIn(2000);


		var slideshow;
		
		function slide() {
			console.info('slide');
			console.info('counter: '+counter);

			console.info('slides.length: '+slides.length);

			var currentSlide = $(slides[counter]);
			// var previousSlide = $(slides[counter-1]);

			var textLength = currentSlide.text().length;
			console.info('textLength: '+textLength);

			// var duration = 1000 * 5;
			var duration = textLength * 50;

			// previousSlide.fadeOut(5000, function(){

			// });

			
			if ( counter == slides.length) {
				console.info('this could be the end');
				$('#intro button').click();
			}

			currentSlide.fadeIn(5000, function(){
				if ( counter == 0 ) {
					type();
					return false;
				}

				
				slideshow = setTimeout(function(){
					$('#video > video').animate({ opacity: 0 }, 2000, function(){
						$(this).attr('src', 'videos/clip-'+clips[counter+1]+'.mp4').animate({ opacity: 1 }, 2000);
					});
					currentSlide.fadeOut(5000, function(){
						counter++;
						slide();
					});
				}, duration); // calculate this duration from character count

			});
		}

		slide();




		function type() {
			console.info('type');

			$(slides[counter]).t({
				speed: 50,
				delay: counter == 0 ? 5 : 1,
				blink: 500,
				caret: false,
				fin: function(el) {

					$(el).fadeOut(5000, function(){
						counter++;
						slide();
					});

				 // 	if ( counter == slides.length-1 ) {
				 // 		$('#intro button').fadeOut(1000, function(){
				 // 			$(this).appendTo($(el)).hide().text('Begin Weaving').css({ bottom: 0 }).fadeIn(1000);
				 // 		});
				 // 		return false;
				 // 	}

				 // 	$('#video > video').animate({ opacity: 0 }, 1000, function(){
				 // 		$(this).attr('src', 'videos/clip-'+clips[counter+1]+'.mp4').animate({ opacity: 1 }, 1000);
				 // 	});
					// $(el).animate({ height: 0, opacity: 0 }, 1000, function(){
						// counter++;
						// slide();
					// });
				}
			});
		 }
		 // type();
	},
	createLoom: function(){

		// App.getVideos();
		// App.loadClips();

		console.info('App.createLoom');

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
	closeHaiku: function(){
		//
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
				var player = new Froogaloop( $('#videoframe'+videocounter)[0] );

				video.appendTo(overlay);
				overlay.fadeIn();

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