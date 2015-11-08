<?php
/*	Project:	EQdkp-Plus
 *	Package:	Tag cloud Portal Module
 *	Link:		http://eqdkp-plus.eu
 *
 *	Copyright (C) 2006-2015 EQdkp-Plus Developer Team
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

if ( !defined('EQDKP_INC') ){
	header('HTTP/1.0 404 Not Found');exit;
}

$lang = array(
	'timeline'					=> 'Zeitleiste',
	'timeline_name'				=> 'Artikel-Zeitleiste',
	'timeline_desc'				=> 'Zeigt eine Zeitliste für die geschriebenen Artikel an',
	'timeline_f_categories'		=> 'Artikelkategorien',
	'timeline_f_help_categories'=> 'Aus den ausgewählten Kategorien werden die geschriebenen Artikel in der Zeitleiste angezeigt',
	'timeline_f_interval'		=> 'Intervall (in Jahren)',
	'timeline_f_interval_categories'=> 'Zeigt die Artikel der letzten x Jahre in der Zeitleiste an. Trage 0 ein, um alle Artikel anzuzeigen.',
		
);
?>