

;(function($){
	var pluginName = 'TimeLine'
	var defaults = {}
	
	// Constructor
	function TimeLine(element, options){
		this.$element	= $(element);
		this.options	= $.extend({}, defaults, options);
		
		this.init();
	}
	
	// Initialize
	TimeLine.prototype.init = function(){
		var self = this;
		this.startYear		= parseInt(moment.unix(this.$element.find('.timeline-year:first-child').data('timestamp')).format('YYYY'));
		this.numYears		= this.$element.find('.timeline-year').length;
		this.wrapWidth		= this.$element.find('.timeline-wrap').width();
		this.gapYear		= this.wrapWidth / (this.numYears - 1);
		this.gapMonth		= this.gapYear / 12;
		this.gapDay			= this.gapMonth / 31;
		this.current_width	= 0;
		
		this._posYears();
		this._posMonths();
		this._posArticles();
		
		this._tooltipHandler();
		
		
		console.log( this );// DEBUG
	}
	
	// Calc Position of Years
	TimeLine.prototype._posYears = function(){
		var self = this;
		
		this.$element.find('.timeline-year').each(function( current_year ){
			var year_left = self.gapYear * current_year;
			
			$(this).css('left', year_left + 'px');
		});
	}
	
	// Calc Position of Months
	TimeLine.prototype._posMonths = function(){
		var self = this;
		
		this.$element.find('.timeline-month').each(function( current_month ){
			var month_left = self.current_width + self.gapMonth;
			if(current_month != 0 && !(current_month % 11)) month_left += self.gapMonth;
			
			$(this).css('left', month_left + 'px');
			
			self.current_width = month_left;
		});
	}
	
	// Calc Position of Articles
	TimeLine.prototype._posArticles = function(){
		var self = this;
		
		this.$element.find('.timeline-article').each(function( current_article ){
			var date		= moment.unix( $(this).data('article-timestamp') );
			var dateYear	= date.format('YYYY');
			var dateMonth	= date.format('M');
			var dateDay		= date.format('D');
			
			var article_left  = (dateYear < self.startYear)? (self.startYear - dateYear) * self.gapYear : 0 ;
				article_left += (dateMonth - 1) * self.gapMonth;
				article_left += (dateDay - 1) * self.gapDay;
			
			$(this).css('left', article_left + 'px');
		});
	}
	
	// Tooltip Event Handler
	TimeLine.prototype._tooltipHandler = function(){
		var self = this;
		/*
		$('.timeline-article').on('mouseover', function(){
			if( self.$element.find('.timeline-article.timeline-selected').length == 0 ){
				$(this).addClass('timeline-hover');
			}
		});
		$('.timeline-article').on('mouseleave', function(){
			if( self.$element.find('.timeline-article.timeline-selected').length == 0 ){
				$(this).removeClass('timeline-hover');
			}// here we should maybe a check, to delete hover if selected
		});
		*/
		self.$element.find('.timeline-article').on('click', function(){
			if( self.$element.find('.timeline-article.timeline-selected').length == 0 ){
				$(this).addClass('timeline-selected');
				
			}else if( $(this).hasClass('timeline-selected') ){
				$(this).removeClass('timeline-selected');
				
			}else{
				self.$element.find('.timeline-article.timeline-selected').removeClass('timeline-selected');
				$(this).addClass('timeline-selected');
			}
		});
		
		$(document).on('click', function(event){
			var timeline_any_selected	= (self.$element.find('.timeline-article.timeline-selected').length != 0)? true : false ;
			var target_timeline_area	= (self.$element.find(event.target).length == 0)? true : false ;
			
			if( timeline_any_selected && target_timeline_area ){
				self.$element.find('.timeline-article.timeline-selected').removeClass('timeline-selected')
			}
		});
	}
	
	
	
	// Add TimeLine to jQuery
	$.fn.timeline = function(options){
		return this.each(function () {
            if( !$.data(this, 'plugin_' + pluginName) ) {
                $.data(this, 'plugin_' + pluginName, new TimeLine( this, options ));
            }
        });
	};
}(jQuery, window));










/***********************************************
 * THIS TIMELINE WORKS FINE BUT ARTICLE ARE REVERSED
 * 
 ***********************************************/

/*
;(function($){
	var pluginName = 'TimeLine'
	
	// Constructor
	function TimeLine(element, options){
		this.$element	= $(element);
		
		this.init();
	}
	
	// Initialize
	TimeLine.prototype.init = function(){
		// TimeLine width
		this._width		= this.$element.find('.timeline-wrap').width();
		
		// Calculate StartTime, EndTime and elapsed time between the Years
		this._dateStart	= new moment(this.$element.find('.timeline-year:first-child').data('date'), 'YYYY-MM-DD');
		this._dateEnd	= new moment(this.$element.find('.timeline-year:last-child').data('date'), 'YYYY-MM-DD');
		this._duration	= this._dateEnd.diff(this._dateStart);
		
		// Iterate Articles
		var self = this;
		
		this._articles	= this.$element.find('.timeline-article');
		this._articles.each(function(){
			var date = new moment($(this).data('article-date'), 'YYYY-MM-DD');
			
			$(this).css('left', self.getWidth(date) + 'px');
		});
		
		// Iterate Years
		var self = this;
		
		this._years	= this.$element.find('.timeline-year');
		this._years.each(function(){
			var date = new moment($(this).data('date'), 'YYYY-MM-DD');
			
			$(this).css('left', self.getWidth(date) + 'px');
		});
		
		
		
		console.log(      this     );
	};
	
	TimeLine.prototype.getWidth = function(date){
		var width = date.diff(this._dateStart) * this._width / this._duration;
			width = Math.abs(parseInt(width));
			//width = width + this.options.margeTop;
		return width;
	};

	
	
	// Add TimeLine to jQuery
	$.fn.timeline = function(options){
		return this.each(function () {
            if( !$.data(this, 'plugin_' + pluginName) ) {
                $.data(this, 'plugin_' + pluginName, new TimeLine( this, options ));
            }
        });
	};
}(jQuery, window));
*/



/***********************************************
 * THIS TIMELINE WORKS FINE WITH YEARS AND MONTHS
 * 
 ***********************************************/


/*
$(document).ready(function(){
	var wrap_width	= $('.timeline-wrap').width();
	
	//calc years & months positions
	var years		= $('.timeline-year').length;
	var year_width	= wrap_width / (years - 1);
	var month_width = year_width / 12;
	
	$('.timeline-year').each(function(year_count){
		this_year_width = year_count * year_width;
		
		$(this).css('left', this_year_width + 'px');
		
		$('.timeline-month[data-year="'+year_count+'"]').each(function(month_count){
			this_month_width = month_count * month_width;
			this_month_width += this_year_width - year_width;
			
			if( $(this).data('month') == 1 ){
				$(this).remove();
			}else{
				$(this).css('left', this_month_width + 'px');
			}
		});
	});
	
	//calc article positions
	var wrap_start_time	= $('.timeline-year:first-child').data('timestamp');
	var wrap_end_time	= $('.timeline-year:last-child').data('timestamp');
	
	
	$('.timeline-article').each(function(article_count){
		article_date				= $(this).data('article-date');
		percentage_article_width	= (article_date - wrap_start_time) * 100 / (wrap_end_time - wrap_start_time);
		this_article_width			= wrap_width * percentage_article_width / 100;
		console.log(percentage_article_width);
		$(this).css('left', this_article_width + 'px');
	});
	
});
*/

