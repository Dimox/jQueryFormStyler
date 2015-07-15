(function($) {
$(function() {

	$('ul.menu').on('click', 'li:not(.current)', function() {
		$(this).addClass('current').siblings().removeClass('current')
			.parents('div.wrapper').find('div.box').removeClass('visible').eq($(this).index()).addClass('visible');
		 window.location.hash = $(this).data('hash');
		 $('input').blur();
	});
	hash = window.location.hash.replace(/#(.+)/, '$1');
	if ( hash !== '' ) {
		$('ul.menu li[data-hash='+hash+']').click();
	}

	$.fn.toggleDisabled = function() {
		return this.each(function() {
			this.disabled = !this.disabled;
		});
	};

	$.fn.toggleChecked = function() {
		return this.each(function() {
			this.checked = !this.checked;
		});
	};

	$('button').click(function(e) {
		e.preventDefault();
	});

	$('button.add-checkbox').click(function() {
		var inputs = '';
		for (var i = 1; i <= 5; i++) {
			inputs += '<label><input type="checkbox" name="checkbox" /> чекбокс ' + i + '</label><br />';
		}
		$(this).closest('div.section').append('<div>' + inputs + '</div>');
		$('input:checkbox').styler();
	});

	$('button.add-radio').click(function() {
		var inputs = '';
		for (var i = 1; i <= 5; i++) {
			inputs += '<label><input type="radio" name="radio" /> радиокнопка ' + i + '</label><br />';
		}
		$(this).closest('div.section').append('<div>' + inputs + '</div>');
		$('input:radio').styler();
	});

	$('button.add-file').click(function() {
		var file = $('<input type="file" name="" />');
		$(this).closest('div.section').append(file);
		file.wrap('<div></div>').styler();
	});

	$('button.add-number').click(function() {
		var number = $('<input type="number" />');
		$(this).closest('div.section').append(number);
		number.before('<br /><br />').styler();
	});

	$('button.add-select').click(function() {
		var multiple = '';
		if ( $(this).is('.multiple') ) multiple = ' multiple';
		var select = $('<select' + multiple +'><option>-- Выберите --</option><option>Пункт 1</option><option>Пункт 2</option><option>Пункт 3</option><option>Пункт 4</option><option>Пункт 5</option></select>');
		$(this).closest('div.section').append(select);
		select.before('<br /><br />').styler();
	});

	$('button.add-options').click(function() {
		var options = '';
		for (i = 1; i <= 5; i++) {
			options += '<option>Опция ' + i + '</option>';
		}
		$(this).closest('div.section').find('select').each(function() {
			$(this).append(options);
		}).trigger('refresh');
	});

	$('button.check').click(function() {
		$(this).closest('div.section').find('input').toggleChecked().trigger('refresh');
	});

	$('button.disable-input').click(function() {
		$(this).closest('div.section').find('input').toggleDisabled().trigger('refresh');
	});

	$('button.disable-select').click(function() {
		$(this).closest('div.section').find('select').toggleDisabled().trigger('refresh');
	});

	$('button.disable-options').click(function() {
		$(this).closest('div.section').find('option').toggleDisabled().trigger('refresh');
	});

});
})(jQuery);