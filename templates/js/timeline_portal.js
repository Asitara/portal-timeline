/*	Project:	EQdkp-Plus
 *	Package:	Timeline Portal Module
 *	Link:		http://eqdkp-plus.eu
 *
 *	Copyright (C) 2006-2016 EQdkp-Plus Developer Team
 *
 *	This program is free software: you can redistribute it and/or modify
 *	it under the terms of the GNU Affero General Public License as published
 *	by the Free Software Foundation, either version 3 of the License, or
 *	(at your option) any later version.
 *
 *	This program is distributed in the hope that it will be useful,
 *	but WITHOUT ANY WARRANTY; without even the implied warranty of
 *	MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *	GNU Affero General Public License for more details.
 *
 *	You should have received a copy of the GNU Affero General Public License
 *	along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

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
			
			var article_left  = (dateYear > self.startYear)? (dateYear - self.startYear) * self.gapYear : 0 ;
				article_left += (dateMonth - 1) * self.gapMonth;
				article_left += (dateDay - 1) * self.gapDay;
			
			$(this).css('left', article_left + 'px');
		});
	}
	
	// Tooltip Event Handler
	TimeLine.prototype._tooltipHandler = function(){
		var self = this;
		
		var tooltipTimeout = null;
		self.$element.find('.timeline-article').hover(function(){
			if( self.$element.find('.timeline-article.timeline-hover').length == 0 ){
				$(this).addClass('timeline-hover');
			}else{
				self.$element.find('.timeline-article.timeline-hover').removeClass('timeline-hover');
				window.clearTimeout(tooltipTimeout);
				tooltipTimeout = null;
				$(this).addClass('timeline-hover');
			}
		}, function(){
			if(!tooltipTimeout){
				tooltipTimeout = window.setTimeout(function(){
					tooltipTimeout = null;
					self.$element.find('.timeline-article.timeline-hover').removeClass('timeline-hover');
				}, 1000);
			}
		});
	}
	
	
	
	// Add TimeLine to jQuery
	$.fn.timeline = function(options){
		return this.each(function(){
            if( !$.data(this, 'plugin_' + pluginName) ) {
                $.data(this, 'plugin_' + pluginName, new TimeLine( this, options ));
            }
        });
	};
}(jQuery, window));

