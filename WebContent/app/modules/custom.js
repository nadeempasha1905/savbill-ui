$(document).ready(function() {
	//smooth scroll
	$.srSmoothscroll({
		step: 150,
		speed: 800
	});
	
	//initialize show when visible
	new WOW().init();
	
	// home page main slider
	if($('#camera_wrap_0').length > 0){
		$('#camera_wrap_0').camera({
			navigation: false,
			playPause: false,
			thumbnails: false,
			navigationHover: false,
			barPosition: 'top',
			loader: false,
			time: 3000,
			transPeriod:800,
			alignment: 'center',
			autoAdvance: true,
			mobileAutoAdvance: true,
			barDirection: 'leftToRight', 
			barPosition: 'bottom',
			easing: 'easeInOutExpo',
			fx: 'simpleFade',
			height: '61.76%',
			minHeight: '300px',
			hover: true,
			pagination: true,
			loaderColor			: '#000000', 
			loaderBgColor		: 'transparent',
			loaderOpacity		: 0.5,
			loaderPadding		: 0,
			loaderStroke		: 3
		});
	}
	
	// notification background image
	if($("#parallax_0>div").length > 0){
		$("#parallax_0>div").cherryFixedParallax({
			invert: false
		});
	}
	
	// menu bar loading events
	var timeout;
	$(".header-logo li.tm_menu_item").off('mouseenter').on('mouseenter',function(e){
		clearTimeout(timeout);
		$('ul.tm_menu_items').hide();
		$(".header-logo li.tm_menu_item").removeClass('sfHover');
		$(this).addClass('sfHover');
		$(this).find('ul.tm_menu_items').show();
	});			
	$(".header-logo li.tm_menu_item").off('mouseleave').on('mouseleave',function(e){
		clearTimeout(timeout);
		timeout = setTimeout(function(){$(".header-logo li.tm_menu_item").removeClass('sfHover');$('ul.tm_menu_items').hide();},600);
	});
	
	//charts configurations
	if($('.charts').length > 0){			
		var category = ["BEER", "BITTER", "BRANDY", "BREEZER", "CREAM", "DDD", "DRAUGHT-BEER", "FML", "FORTIFIED-WINE", "GIN", "NEW TEST", "RUM", "SSS", "TEQUILA", "VODKA", "WHISK", "WHISKY", "WINE"];
		var percentage = [40, 50, 75, 35, 30, 40, 80, 100, 70, 30, 20, 40, 77, 40, 60, 90, 47, 100];
		var ctx1 = $("#lastMonthConsumptionChart").get(0).getContext("2d");
		var ctx2 = $("#ledgerChart").get(0).getContext("2d");
		var consumptionChart = new Chart(ctx1);
		var ledgerChart = new Chart(ctx2);
		var data = {
			labels: category,
			datasets: [
				{
					label: "My First dataset",
					fillColor: "rgba(151,187,205,0.5)",
					strokeColor: "rgba(151,187,205,0.8)",
					highlightFill: "rgba(151,187,205,0.75)",
					highlightStroke: "rgba(151,187,205,1)",
					data: percentage
				}
			]
		};
		var options = {
			scaleLineColor: "rgba(0,0,0,.3)",
			scaleFontSize: 10,
			tooltipFontSize: 10,
			pointDotRadius : 1,
			//Boolean - Whether the scale should start at zero, or an order of magnitude down from the lowest value
			scaleBeginAtZero : true,

			//Boolean - Whether grid lines are shown across the chart
			scaleShowGridLines : true,

			//String - Colour of the grid lines
			scaleGridLineColor : "rgba(0,0,0,.05)",

			//Number - Width of the grid lines
			scaleGridLineWidth : 1,

			//Boolean - Whether to show horizontal lines (except X axis)
			scaleShowHorizontalLines: true,

			//Boolean - Whether to show vertical lines (except Y axis)
			scaleShowVerticalLines: true,

			//Boolean - If there is a stroke on each bar
			barShowStroke : true,

			//Number - Pixel width of the bar stroke
			barStrokeWidth : 2,

			//Number - Spacing between each of the X value sets
			barValueSpacing : 5,

			//Number - Spacing between data sets within X values
			barDatasetSpacing : 1,

			//String - A legend template
			legendTemplate : "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<datasets.length; i++){%><li><span style=\"background-color:<%=datasets[i].fillColor%>\"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>"

		}
		consumptionChart.Bar(data, options);	
		ledgerChart.Radar(data, options);	
	}
		
		
	//notifications event handlers
	if($('.notifications').length > 0){				
		$('.notifications .content a').on('mouseenter',function(e){
			$(this).append('<button class="take-action fadeInDown animated">Take Action</button>');
		});
		$('.notifications .content a').on('mouseleave',function(e){
			$(this).find('.take-action').remove();
		});
	}
	
	//dynamic search engine to find direct links
	var data_links = '';
	$('.search input').on('keyup',function(){
		var data = $('a[data-searchable]') || [];
		var search_string = $(this).val();
		data_links = '';
		if(data.length > 0){			
			$.each(data,function(key,value){
				if(($(value).text().toLowerCase()).indexOf(search_string.toLowerCase()) != -1){
					data_links += '<li>'+value.outerHTML+'</li>';
				}
			})
		}
	});
	$('.search input').on('focus',function(){
		if(data_links != ''){
			console.log(data_links)
		}
		
	});
	
});