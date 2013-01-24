/*
 * jQuery Form Styler v1.3.1
 * http://dimox.name/jquery-form-styler/
 *
 * Copyright 2012-2013 Dimox (http://dimox.name/)
 * Released under the MIT license.
 *
 * Date: 2013.01.23
 *
 */

(function($) {
	$.fn.styler = function(opt) {

		opt = $.extend({
			browseText: 'Выбрать',
			singleSelectzIndex: '1000',
			selectVisibleOptions: 0
		}, opt);

		return this.each(function() {
			var el = $(this);
			var id = '', cl = '';
			if (el.attr('id') !== undefined && el.attr('id') != '') id = ' id="' + el.attr('id') + '"';
			if (el.attr('class') !== undefined && el.attr('class') != '') cl = ' ' + el.attr('class');

			// checkbox
			if (el.is(':checkbox')) {
				el.css({position: 'absolute', height: 0, opacity: 0, filter: 'alpha(opacity=0)'}).each(function() {
					if (el.next('span.jq-checkbox').length < 1) {
						var checkbox = $('<span' + id + ' class="jq-checkbox' + cl + '" style="display: inline-block"><span></span></span>');
						el.after(checkbox);
						if (el.is(':checked')) checkbox.addClass('checked');
						if (el.is(':disabled')) checkbox.addClass('disabled');
						// клик на псевдочекбокс
						checkbox.click(function() {
							if (!checkbox.is('.disabled')) {
								if (el.is(':checked')) {
									el.prop('checked', false);
									checkbox.removeClass('checked');
								} else {
									el.prop('checked', true);
									checkbox.addClass('checked');
								}
								el.change();
								return false;
							}
						});
						// клик на label
						el.parent('label').add('label[for="' + el.attr('id') + '"]').click(function(e) {
							checkbox.click();
							e.preventDefault();
						});
						// переключение по Space или Enter
						el.change(function() {
							if (el.is(':checked')) checkbox.addClass('checked');
							else checkbox.removeClass('checked');
						})
						// чтобы переключался чекбокс, который находится в теге label
						.keydown(function(e) {
							if (el.parent('label').length && (e.which == 13 || e.which == 32)) checkbox.click();
						})
						.focus(function() {
							if (!checkbox.is('.disabled')) checkbox.addClass('focused');
						})
						.blur(function() {
							checkbox.removeClass('focused');
						});
						// обновление при динамическом изменении
						el.on('refresh', function() {
							if (el.is(':checked')) checkbox.addClass('checked');
								else checkbox.removeClass('checked');
							if (el.is(':disabled')) checkbox.addClass('disabled');
								else checkbox.removeClass('disabled');
						});
					}
				});

			// radio
			} else if (el.is(':radio')) {
				el.css({position: 'absolute', zIndex: '-5'}).each(function() {
					if (el.next('span.jq-radio').length < 1) {
						var radio = $('<span' + id + ' class="jq-radio' + cl + '" style="display: inline-block"><span></span></span>');
						el.after(radio);
						if (el.is(':checked')) radio.addClass('checked');
						if (el.is(':disabled')) radio.addClass('disabled');
						// клик на псевдорадиокнопке
						radio.click(function() {
							if (!radio.is('.disabled')) {
								$('input[name="' + el.attr('name') + '"]').prop('checked', false).next().removeClass('checked');
								el.prop('checked', true).next().addClass('checked');
								el.change();
								return false;
							}
						});
						// клик на label
						el.parent('label').add('label[for="' + el.attr('id') + '"]').click(function(e) {
							radio.click();
							e.preventDefault();
						});
						// переключение стрелками
						el.change(function() {
							$('input[name="' + el.attr('name') + '"]').next().removeClass('checked');
							el.next().addClass('checked');
						})
						.focus(function() {
							if (!radio.is('.disabled')) radio.addClass('focused');
						})
						.blur(function() {
							radio.removeClass('focused');
						});
						// обновление при динамическом изменении
						el.on('refresh', function() {
							if (el.is(':checked')) {
								$('input[name="' + el.attr('name') + '"]').next().removeClass('checked');
								radio.addClass('checked');
							}
							if (el.is(':disabled')) radio.addClass('disabled');
								else radio.removeClass('disabled');
						});
					}
				});

			// file
			} else if (el.is(':file')) {
				el.css({position: 'absolute', height: '100%', fontSize: '40px', left: 0, opacity: 0, filter: 'alpha(opacity=0)'}).each(function() {
					if (el.parent('span.jq-file').length < 1) {
						var file = $('<span' + id + ' class="jq-file' + cl + '" style="display: inline-block; position: relative; overflow: hidden"></span>');
						var name = $('<div class="name" style="float: left; white-space: nowrap"></div>').appendTo(file);
						var browse = $('<div class="browse" style="float: left">' + opt.browseText + '</div>').appendTo(file);
						el.after(file);
						file.append(el);
						if (el.is(':disabled')) file.addClass('disabled');
						el.change(function() {
							name.text(el.val().replace(/.+[\\\/]/, ''));
						})
						.focus(function() {
							file.addClass('focused');
						})
						.blur(function() {
							file.removeClass('focused');
						})
						.click(function() {
							file.removeClass('focused');
						})
						// обновление при динамическом изменении
						.on('refresh', function() {
							if (el.is(':disabled')) file.addClass('disabled');
								else file.removeClass('disabled');
						});
					}
				});

			// select
			} else if (el.is('select')) {
				el.each(function() {
					if (el.next('span.jqselect').length < 1) {

						function selectbox() {

							// запрещаем прокрутку страницы при прокрутке селекта
							function preventScrolling(selector) {
								selector.bind('mousewheel DOMMouseScroll', function(e) {
									var scrollTo = null;
									if (e.type === 'mousewheel') { scrollTo = (e.originalEvent.wheelDelta * -1); }
									else if (e.type === 'DOMMouseScroll') { scrollTo = 40 * e.originalEvent.detail; }
									if (scrollTo) { e.preventDefault(); $(this).scrollTop(scrollTo + $(this).scrollTop()); }
								});
							}

							var option = el.find('option');

							// формируем список селекта
							function makeList() {
                                var list = '';
								for (var i = 0, l = option.length; i < l; i++) {
									var li = '', liClass = '', optgroupClass = '', optionClass = '';
									var disabled = 'disabled';
									var selDis = 'selected sel disabled';
									if (option.eq(i).prop('selected')) liClass = 'selected sel';
									if (option.eq(i).is(':disabled')) liClass = disabled;
									if (option.eq(i).is(':selected:disabled')) liClass = selDis;
									if (option.eq(i).attr('class') !== undefined) optionClass = ' ' + option.eq(i).attr('class');
									li = '<li class="' + liClass + optionClass + '">'+ option.eq(i).text() +'</li>';
									// если есть optgroup
									if (option.eq(i).parent().is('optgroup')) {
										if (option.eq(i).parent().attr('class') !== undefined) optgroupClass = ' ' + option.eq(i).parent().attr('class');
										li = '<li class="' + liClass + optionClass + ' option' + optgroupClass + '">'+ option.eq(i).text() +'</li>';
										if (option.eq(i).is(':first-child')) {
											li = '<li class="optgroup' + optgroupClass + '">' + option.eq(i).parent().attr('label') + '</li>' + li;
										}
									}
									list += li;
								}
                                return list;
							} // end makeList()

							// одиночный селект
							function doSelect() {
								var selectbox =
									$('<span' + id + ' class="jq-selectbox jqselect' + cl + '" style="display: inline-block; position: relative; z-index:' + opt.singleSelectzIndex + '">'+
											'<div class="select" style="float: left"><div class="text"></div>'+
												'<b class="trigger"><i class="arrow"></i></b>'+
											'</div>'+
										'</span>');
								el.after(selectbox).css({position: 'absolute', height: 0, opacity: 0, filter: 'alpha(opacity=0)'});
								var divSelect = selectbox.find('div.select');
								var divText = selectbox.find('div.text');
								var optionSelected = option.filter(':selected');

								// берем опцию по умолчанию
								if (optionSelected.length) {
									divText.text(optionSelected.text());
								} else {
									divText.text(option.filter(':first').text());
								}

								// если селект неактивный
								if (el.is(':disabled')) {
									selectbox.addClass('disabled');

								// если селект активный
								} else {
									var list = makeList();
									var dropdown =
										$('<div class="dropdown" style="position: absolute; overflow: auto; overflow-x: hidden">'+
												'<ul style="list-style: none">' + list + '</ul>'+
											'</div>');
									selectbox.append(dropdown);
									var li = dropdown.find('li');
									var selectHeight = selectbox.outerHeight();
									if (dropdown.css('left') === 'auto') dropdown.css({left: 0});
									if (dropdown.css('top') === 'auto') dropdown.css({top: selectHeight});
									var liHeight = li.outerHeight();
									var position = dropdown.css('top');
									dropdown.hide();

									// при клике на псевдоселекте
									divSelect.click(function() {

										// умное позиционирование
                                    var win = $(window);

										var topOffset = selectbox.offset().top;
									var bottomOffset = win.height() - selectHeight - (topOffset - win.scrollTop());
										var visible = opt.selectVisibleOptions;
										var	minHeight = liHeight * 6;
										var	newHeight = liHeight * visible;
										if (visible > 0 && visible < 6) minHeight = newHeight;
										// раскрытие вверх
										if (bottomOffset < 0 || bottomOffset < minHeight)	{
											dropdown.height('auto').css({top: 'auto', bottom: position});
										if (dropdown.outerHeight() > topOffset - win.scrollTop() - 20 ) {
											dropdown.height(Math.floor((topOffset - win.scrollTop() - 20) / liHeight) * liHeight);
												if (visible > 0 && visible < 6) {
													if (dropdown.height() > minHeight) dropdown.height(minHeight);
												} else if (visible > 6) {
													if (dropdown.height() > newHeight) dropdown.height(newHeight);
												}
											}
										// раскрытие вниз
										} else if (bottomOffset > minHeight) {
											dropdown.height('auto').css({bottom: 'auto', top: position});
											if (dropdown.outerHeight() > bottomOffset - 20 ) {
												dropdown.height(Math.floor((bottomOffset - 20) / liHeight) * liHeight);
												if (visible > 0 && visible < 6) {
													if (dropdown.height() > minHeight) dropdown.height(minHeight);
												} else if (visible > 6) {
													if (dropdown.height() > newHeight) dropdown.height(newHeight);
												}
											}
										}

										$('span.jqselect').css({zIndex: (opt.singleSelectzIndex-1)}).removeClass('focused');
										selectbox.css({zIndex: opt.singleSelectzIndex});
										if (dropdown.is(':hidden')) {
											$('div.dropdown:visible').hide();
											dropdown.show();
											selectbox.addClass('opened');
										} else {
											dropdown.hide();
											selectbox.removeClass('opened');
										}

										// прокручиваем до выбранного пункта при открытии списка
										if (li.filter('.selected').length) {
											dropdown.scrollTop(dropdown.scrollTop() + li.filter('.selected').position().top - dropdown.innerHeight()/2 + li.filter('.selected').outerHeight()/2);
										}

										preventScrolling(dropdown);
										return false;
									});

									// при наведении курсора на пункт списка
									li.hover(function() {
										$(this).siblings().removeClass('selected');
									});
									var selectedText = li.filter('.selected').text();

									// при клике на пункт списка
									li.filter(':not(.disabled):not(.optgroup)').click(function() {
										var t = $(this);
										var liText = t.text();
										if (selectedText != liText) {
											var index = t.index();
											if (t.is('.option')) index -= t.prevAll('.optgroup').length;
											t.addClass('selected sel').siblings().removeClass('selected sel');
										option.eq(index).prop('selected', true).parents().find('option').not(':selected').prop('selected', false);
											selectedText = liText;
											divText.text(liText);
											el.change();
										}
										dropdown.hide();
									});
									dropdown.mouseout(function() {
										dropdown.find('li.sel').addClass('selected');
									});
									// фокус на селекте
									el.focus(function() {
										selectbox.addClass('focused');
									})
									.blur(function() {
										selectbox.removeClass('focused');
									})
									// меняем селект с клавиатуры
									.keyup(function() {
										divText.text(option.filter(':selected').text());
										li.removeClass('selected sel').eq(option.filter(':selected').index()).addClass('selected sel');
									});
									// прячем выпадающий список при клике за пределами селекта
									$(document).on('click', function(e) {
										if (!$(e.target).parents().hasClass('selectbox')) {
											dropdown.hide().find('li.sel').addClass('selected');
											selectbox.removeClass('focused opened');
										}
									});
								}
							} // end doSelect()

							// мультиселект
							function doMultipleSelect() {
								var selectbox = $('<span' + id + ' class="jq-select-multiple jqselect' + cl + '" style="display: inline-block"></span>');
								el.after(selectbox).css({position: 'absolute', height: 0, opacity: 0, filter: 'alpha(opacity=0)'});
								var list = makeList();
								selectbox.append('<ul>' + list + '</ul>');
								var ul = selectbox.find('ul');
								var li = selectbox.find('li').attr('unselectable', 'on').css({'-webkit-user-select': 'none', '-moz-user-select': 'none', '-ms-user-select': 'none', '-o-user-select': 'none', 'user-select': 'none'});
								var size = el.attr('size');
								var ulHeight = ul.outerHeight();
								var liHeight = li.outerHeight();
								if (size !== undefined && size > 0) {
									ul.css({'height': liHeight * size});
								} else {
									ul.css({'height': liHeight * 4});
								}
								if (ulHeight > selectbox.height()) {
									ul.css('overflowY', 'scroll');
									preventScrolling(ul);
								}
								if (el.is(':disabled')) {
									selectbox.addClass('disabled');
									option.each(function() {
										if ($(this).is(':selected')) li.eq($(this).index()).addClass('selected');
									});
								} else {

									// при клике на пункт списка
									li.filter(':not(.disabled):not(.optgroup)').click(function(e) {
										var clkd = $(this);
										if(!e.ctrlKey) clkd.addClass('selected');
										if(!e.shiftKey) clkd.addClass('first');
										if(!e.ctrlKey && !e.shiftKey) clkd.siblings().removeClass('selected first');

										// выделение пунктов при зажатом Ctrl
										if(e.ctrlKey) {
											if (clkd.is('.selected')) clkd.removeClass('selected first');
												else clkd.addClass('selected first');
											clkd.siblings().removeClass('first');
										}

										// выделение пунктов при зажатом Shift
										if(e.shiftKey) {
											var prev = false, next = false;
											clkd.siblings().removeClass('selected').siblings('.first').addClass('selected');
											clkd.prevAll().each(function() {
												if ($(this).is('.first')) prev = true;
											});
											clkd.nextAll().each(function() {
												if ($(this).is('.first')) next = true;
											});
											if (prev) {
												clkd.prevAll().each(function() {
													if ($(this).is('.selected')) return false;
														else $(this).not('.disabled, .optgroup').addClass('selected');
												});
											}
											if (next) {
												clkd.nextAll().each(function() {
													if ($(this).is('.selected')) return false;
														else $(this).not('.disabled, .optgroup').addClass('selected');
												});
											}
											if (li.filter('.selected').length === 1) clkd.addClass('first');
										}

									option.prop('selected', false);
										li.filter('.selected').each(function() {
											var t = $(this);
											var index = t.index();
											if (t.is('.option')) index -= t.prevAll('.optgroup').length;
											option.eq(index).prop('selected', true);
										});
										el.change();
									});

								}
							} // end doMultipleSelect()
							if (el.is('[multiple]')) doMultipleSelect(); else doSelect();
						} // end selectbox()

						selectbox();

						// обновление при динамическом изменении
						el.on('refresh', function() {
							el.next().remove();
							selectbox();
						});
					}
				});
			}// end select

		});

	}
})(jQuery);