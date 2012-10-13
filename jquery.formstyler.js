/*
 * jQuery Form Styler v1.1
 * http://dimox.name/jquery-form-styler/
 *
 * Copyright 2012 Dimox (http://dimox.name/)
 * Released under the MIT license.
 *
 * Date: 2012.10.13
 *
 */

(function($) {
	$.fn.styler = function(opt) {

		var opt = $.extend({
			browseText: 'Выбрать'
		}, opt);

		return this.each(function() {
			var el = $(this);

			if (el.is(':checkbox')) {
				el.css({position: 'absolute', left: '-9999px'}).each(function() {
					if (el.next('span.checkbox').length < 1) {
						var span = $('<span class="checkbox" style="display:inline-block"><span></span></span>');
						el.after(span);
						if (el.is(':checked')) span.addClass('checked');
						if (el.is(':disabled')) span.addClass('disabled');
						// клик на псевдочекбокс
						span.click(function() {
							if (!span.is('.disabled')) {
								if (el.is(':checked')) {
									el.removeAttr('checked');
									span.removeClass('checked');
								} else {
									el.attr('checked', true);
									span.addClass('checked');
								}
								el.change();
								return false;
							}
						});
						// клик на label
						el.parent('label').add('label[for="' + el.attr('id') + '"]').click(function(e) {
							span.click();
							e.preventDefault();
						});
						// переключение по Space или Enter
						el.change(function() {
							if (el.is(':checked')) span.addClass('checked');
							else span.removeClass('checked');
						})
						// чтобы переключался чекбокс, который находится в теге label
						.keydown(function(e) {
							if (el.parent('label').length && (e.which == 13 || e.which == 32)) span.click();
						})
						.focus(function() {
							if (!span.is('.disabled')) span.addClass('focused');
						})
						.blur(function() {
							span.removeClass('focused');
						});
						// обновление при динамическом изменении
						el.on('refresh', function() {
							if (el.is(':checked')) span.addClass('checked');
								else span.removeClass('checked');
							if (el.is(':disabled')) span.addClass('disabled');
								else span.removeClass('disabled');
						})
					}
				});
			// end :checkbox
			} else if (el.is(':radio')) {
				el.css({position: 'absolute', left: '-9999px'}).each(function() {
					if (el.next('span.radio').length < 1) {
						var span = $('<span class="radio" style="display:inline-block"><span></span></span>');
						el.after(span);
						if (el.is(':checked')) span.addClass('checked');
						if (el.is(':disabled')) span.addClass('disabled');
						// клик на псевдорадиокнопке
						span.click(function() {
							if (!span.is('.disabled')) {
								$('input[name="' + el.attr('name') + '"]').next().removeClass('checked');
								el.attr('checked', true).next().addClass('checked');
								return false;
							}
						});
						// клик на label
						el.parent('label').add('label[for="' + el.attr('id') + '"]').click(function(e) {
							span.click();
							e.preventDefault();
						});
						// переключение стрелками
						el.change(function() {
							span.click();
						})
						.focus(function() {
							if (!span.is('.disabled')) span.addClass('focused');
						})
						.blur(function() {
							span.removeClass('focused');
						});
						// обновление при динамическом изменении
						el.on('refresh', function() {
							if (el.is(':checked')) {
								$('input[name="' + el.attr('name') + '"]').next().removeClass('checked');
								span.addClass('checked');
							}
							if (el.is(':disabled')) span.addClass('disabled');
								else span.removeClass('disabled');
						})
					}
				});
			// end :radio
			} else if (el.is(':file')) {
				el.css({position: 'absolute', left: '-9999px'}).each(function() {
					if (el.next('span.file').length < 1) {
						var file = $('<span class="file" style="display:inline-block"></span>');
						var name = $('<input class="name" type="text" readonly="readonly" style="float:left">').appendTo(file);
						var browse = $('<div class="browse" style="float:left">' + opt.browseText + '</div>').appendTo(file);
						el.after(file);
						file.on('click', function() {	el.click(); });
						el.change(function() { name.val(el.val().replace(/.+[\\\/]/, '')); });
					}
				});
			// end :file
			} else if (el.is('select')) {
				el.each(function() {
					if (el.next('span.selectbox').length < 1) {
						function doSelect() {
							var selectbox =
								$('<span class="selectbox" style="display:inline-block;position:relative">'+
										'<div class="select" style="float:left;position:relative;z-index:10000"><div class="text"></div>'+
											'<b class="trigger"><i class="arrow"></i></b>'+
										'</div>'+
									'</span>');
							el.after(selectbox).css({position: 'absolute', top: -9999});
							var divSelect = selectbox.find('div.select');
							var divText = selectbox.find('div.text');
							var option = el.find('option');
							var optionSelected = option.filter(':selected');
							/* берем опцию по умолчанию */
							if (optionSelected.length) {
								divText.text(optionSelected.text());
							} else {
								divText.text(option.filter(':first').text());
							}
							/* проверяем активность селекта */
							if (el.is(':disabled')) {
								selectbox.addClass('disabled');
							} else {
								var ddlist = '';
								for (i = 0; i < option.length; i++) {
									var selected = '';
									var disabled = ' class="disabled"';
									if (option.eq(i).is(':selected')) selected = ' class="selected sel"';
									if (option.eq(i).is(':disabled')) selected = disabled;
									ddlist += '<li' + selected + '>'+ option.eq(i).text() +'</li>';
								}
								var dropdown =
									$('<div class="dropdown" style="position:absolute;z-index:9999;overflow:auto;overflow-x:hidden">'+
											'<ul style="list-style:none">' + ddlist + '</ul>'+
										'</div>').hide();
								selectbox.append(dropdown);
								var li = dropdown.find('li');
								var selectHeight = selectbox.outerHeight();
								if (dropdown.css('left') == 'auto') dropdown.css({left: 0});
								if (dropdown.css('top') == 'auto') dropdown.css({top: selectHeight});
								var liHeight = li.outerHeight();
								var position = dropdown.css('top');
								/* при клике на псевдоселекте */
								divSelect.click(function() {
									/* умное позиционирование */
									var topOffset = selectbox.offset().top;
									var bottomOffset = $(window).height() - selectHeight - (topOffset - $(window).scrollTop());
									if (bottomOffset < 0 || bottomOffset < liHeight * 6)	{
										dropdown.height('auto').css({top: 'auto', bottom: position});
										if (dropdown.outerHeight() > topOffset - $(window).scrollTop() - 20 ) {
											dropdown.height(Math.floor((topOffset - $(window).scrollTop() - 20) / liHeight) * liHeight);
										}
									} else if (bottomOffset > liHeight * 6) {
										dropdown.height('auto').css({bottom: 'auto', top: position});
										if (dropdown.outerHeight() > bottomOffset - 20 ) {
											dropdown.height(Math.floor((bottomOffset - 20) / liHeight) * liHeight);
										}
									}
									$('span.selectbox').css({zIndex: 1}).removeClass('focused');
									selectbox.css({zIndex: 2});
									if (dropdown.is(':hidden')) {
										$('div.dropdown:visible').hide();
										dropdown.show();
									} else {
										dropdown.hide();
									}
									return false;
								});
								/* при наведении курсора на пункт списка */
								li.hover(function() {
									$(this).siblings().removeClass('selected');
								});
								var selectedText = li.filter('.selected').text();
								/* при клике на пункт списка */
								li.filter(':not(.disabled)').click(function() {
									var liText = $(this).text();
									if (selectedText != liText) {
										$(this).addClass('selected sel').siblings().removeClass('selected sel');
										option.removeAttr('selected').eq($(this).index()).attr('selected', true);
										selectedText = liText;
										divText.text(liText);
										el.change();
									}
									dropdown.hide();
								});
								dropdown.mouseout(function() {
									dropdown.find('li.sel').addClass('selected');
								});
								/* фокус на селекте */
								el.focus(function() {
									$('span.selectbox').removeClass('focused');
									selectbox.addClass('focused');
								})
								/* меняем селект с клавиатуры */
								.keyup(function() {
									divText.text(option.filter(':selected').text());
									li.removeClass('selected sel').eq(option.filter(':selected').index()).addClass('selected sel');
								});
								/* прячем выпадающий список при клике за пределами селекта */
								$(document).on('click', function(e) {
									if (!$(e.target).parents().hasClass('selectbox')) {
										dropdown.hide().find('li.sel').addClass('selected');
										selectbox.removeClass('focused');
									}
								});
							}
						}
						doSelect();
						// обновление при динамическом изменении
						el.on('refresh', function() {
							el.next().remove();
							doSelect();
						})
					}
				});
			// end select
			}

		});

	}
})(jQuery)