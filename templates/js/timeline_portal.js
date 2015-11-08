

;(function($){
	var pluginName = 'TimeLine'
	var defaults = {
		//startYear: (new Date()).getFullYear() -1,	// Start with one less year by default
		//groupEventWithinPx : 6,					// Will show common tooltip for events within this range of px
	}
	
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
		
		this._checkGapBetweenArticles();
		
		
		/*if{
		
		this.gapDay = gapMonth / 31;
		
		Artikel Datum erhalten,
			( articleYear - startYear ) * gapYear		; IF articleYear == startYear THEN 0px  --- vllt auch .diff anstelle minus
			  articleMonth * gapMonth					;
			  articleDay * gapDay						;
			  
		alles zusammen sollte die korrekte Weite für diesen einen Artikel ergeben
		-------------------------------
		um diese nicht punkt auf punkt artikel zuhaben sollte man die artikel wärend der berechnung
		in ein array speichern mit den leftWidth Werten und der artikel id
		dann iteriere über diesen array für jeden artikel einzelnd und prüfe ob .diff(array_artikel_weite, artikel_weite)
		xx px überschreitet oder nicht, ggf rechne xx px vom artikel via id ab
		
		*/
		
		/*
		// Event
		var self = this;
		this.articles.each(function(){
			var date = new Date( $(this).data('article-date') );
			
			
		var n = date.getDate();
		var yn = date.getFullYear() - _this.options.startYear;
		var mn = date.getMonth();
		var totalMonths = (yn * 12) + mn;
		//var leftVal = Math.ceil(_this._offset_x + totalMonths * _this.options.gap + (_this.options.gap/31)*n - _this._eDotWidth/2);
			
			
			
			console.log(date);
			
			//--var date = new moment($(this).data('article-date'), 'YYYY-MM-DD');
			//--$(this).css('left', self.getWidth(date) + 'px');
		});
		}*/
		
		
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
	
	// Check gap between Articles
	TimeLine.prototype._checkGapBetweenArticles = function(){
		var self = this;
		
		// evntl. sollten wir das aber auch einfach dann in einem Tooltip anzeigen lassen
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

