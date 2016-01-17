<?php
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

if( !defined('EQDKP_INC') ){
	header('HTTP/1.0 404 Not Found');exit;
}

class timeline_portal extends portal_generic {

	protected static $path	= 'timeline';
	protected static $data	= array(
		'name'			=> 'timeline',
		'version'		=> '0.1.0',
		'author'		=> 'Asitara',
		'contact'		=> EQDKP_PROJECT_URL,
		'description'	=> 'Shows a timeline of your articles',
		'lang_prefix'	=> 'timeline_',
		'multiple'		=> false,
		'icon'			=> 'fa-arrows-h',
	);

	protected static $apiLevel	= 20;
	public $template_file		= 'timeline_portal.html';


	public function get_settings($state){
		$arrCategories = $this->pdh->get('article_categories', 'id_list', array(true));
		$settings	= array(
			'categories'	=> array(
				'type'		=> 'multiselect',
				'options'	=> $this->pdh->aget('article_categories', 'name', 0, array($arrCategories)),
			),
			'interval'	=> array(
				'type'		=> 'int',
				'default'	=> 1,
			),
		);
		return $settings;
	}


	public function output(){
		$this->tpl->js_file($this->server_path.'portal/timeline/templates/js/timeline_portal.js');
		$this->tpl->css_file($this->server_path.'portal/timeline/templates/timeline_portal.css');
		
		$arrCategories	= $this->config('categories');
		$intInterval	= (int)$this->config('interval');
		$intStartYear	= $this->time->date('Y') - ($intInterval - 1);
		$arrMonthsNames	= $this->user->lang('time_monthnames');
		
		//generate years & months
		for($intYear = 0; $intYear <= $intInterval; $intYear++){
			$this->tpl->assign_block_vars('pm_tl_years', array(
				'COUNT'		=> $intYear,
				'YEAR'		=> $intStartYear + $intYear,
				'TIMESTAMP'	=> $this->time->mktime(0, 0, 0, 1, 1, $intStartYear + $intYear),
			));
			
			if($intYear > 0){
				for($intMonth = 1; $intMonth < 12; $intMonth++){
					$this->tpl->assign_block_vars('pm_tl_months', array(
						'COUNT'	=> $intMonth,
						'YEAR'	=> $intYear,
						'MONTH'	=> mb_substr($arrMonthsNames[$intMonth], 0, 3, 'UTF-8'),
					));
				}
			}
		}
		
		//fetch all articles
		$arrArticles = $arrSortedArticles = array();
		foreach($arrCategories as $intCategoryID){
			$arrArticles = array_merge($arrArticles, $this->pdh->get('article_categories', 'published_id_list', array($intCategoryID, $this->user->id)));
		}
		
		$arrArticles = array_unique($arrArticles);
		$arrArticles = $this->pdh->sort($arrArticles, 'articles', 'date', 'desc');
		
		//merge article_ids with same Dates
		foreach($arrArticles as $intArticleID){
			$intArticleDate = $this->pdh->get('articles', 'date', array($intArticleID));
			
			if($this->time->date('Y', $intArticleDate) < $intStartYear) continue;
			$intArticleDate = $this->time->date('Ymd', $intArticleDate);
			
			if(isset($arrSortedArticles[$intArticleDate])){
				$arrSortedArticles[$intArticleDate][] = $intArticleID;
			}else{
				$arrSortedArticles[$intArticleDate] = array($intArticleID);
			}
		}
		
		//generate articles
		foreach($arrSortedArticles as $arrArticleIDs){
			$intDate = $this->pdh->get('articles', 'date', array($arrArticleIDs[0]));
			$this->tpl->assign_block_vars('pm_tl_articles', array(
				'TIMESTAMP'	=> $intDate,
			));
			
			foreach($arrArticleIDs as $intArticleID){
				$arrArticle				= array();
				$arrArticle['date']		= $this->pdh->get('articles', 'date', array($intArticleID));
				$arrArticle['image']	= $this->pdh->get('articles', 'previewimage', array($intArticleID));
				$arrArticle['text']		= $this->pdh->get('articles', 'text', array($intArticleID));
				$arrArticle['title']	= $this->pdh->get('articles', 'title', array($intArticleID));
				
				$intWordcount	= 200;
				$blnImage		= false;
				
				if( ($arrArticle['date'] + ($intInterval*60*60*24*365)) < $this->time->time ) continue;
				
				if(strlen($arrArticle['image'])){
					$blnImage = true;
					$arrArticle['image'] = register('pfh')->FileLink($arrArticle['image'], 'files', 'absolute');
				}else{
					$arrArticle['image'] = '';
				}
				
				$arrArticle['text'] = $this->bbcode->remove_embeddedMedia($this->bbcode->remove_shorttags($arrArticle['text']));
				$arrArticle['text'] = strip_tags(xhtml_entity_decode($arrArticle['text']));
				$arrArticle['text'] = truncate($arrArticle['text'], $intWordcount, '...', false, true);
				
				$this->tpl->assign_block_vars('pm_tl_articles.article', array(
					'ID'		=> $intArticleID,
					'DATE'		=> $this->time->date('d.m.Y', $arrArticle['date']),
					'TITLE'		=> $arrArticle['title'],
					'IMAGE'		=> $blnImage,
					'IMAGE_URL'	=> $arrArticle['image'],
					'TEXT'		=> $arrArticle['text'],
					'URL'		=> $this->controller_path.$this->pdh->get('articles', 'path', array($intArticleID)),
				));
			}
		}
		
		
		$this->tpl->add_js("
			$('#pm_timeline').timeline();
		", 'docready');
		
		return 'Error: Template file is empty.';
	}
}
?>