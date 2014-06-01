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

	$('button.add1').click(function(e) {
		var inputs = '';
		for (i = 1; i <= 5; i++) {
			inputs += '<label><input type="checkbox" name="checkbox" /> checkbox ' + i + '</label><br />';
		}
		$(this).parents('div.section').append('<div>' + inputs + '</div>');
		$('input:checkbox').styler();
		e.preventDefault();
	});

	$('button.add2').click(function(e) {
		var inputs = '';
		for (i = 1; i <= 5; i++) {
			inputs += '<label><input type="radio" name="radio" /> radio ' + i + '</label><br />';
		}
		$(this).parents('div.section').append('<div>' + inputs + '</div>');
		$('input:radio').styler();
		e.preventDefault();
	});

	$('button.add3').click(function(e) {
		$(this).parents('div.section').append('<br /><br /><select><option>-- Выберите --</option><option>Пункт 1</option><option>Пункт 2</option><option>Пункт 3</option><option>Пункт 4</option><option>Пункт 5</option></select>');
		$(this).parents('div.section').find('select').styler();
		e.preventDefault();
	});

	$('button.add4').click(function(e) {
		var options = '';
		for (i = 1; i <= 5; i++) {
			options += '<option>Option ' + i + '</option>';
		}
		$(this).parents('div.section').find('select').each(function() {
			$(this).append(options);
		});
		$(this).parents('div.section').find('select').trigger('refresh');
		e.preventDefault();
	});

	$('button.add5').click(function(e) {
		$(this).parents('div.section').append('<div><input type="file" name="" /></div>');
		$('input:file').styler();
		e.preventDefault();
	});

	$('button.add6').click(function(e) {
		$(this).parents('div.section').append('<br /><br /><select multiple><option>-- Выберите --</option><option>Пункт 1</option><option>Пункт 2</option><option>Пункт 3</option><option>Пункт 4</option><option>Пункт 5</option></select>');
		$(this).parents('div.section').find('select').styler();
		e.preventDefault();
	});

	$('button.check').click(function() {
		$(this).parents('div.section').find('input').toggleChecked().trigger('refresh');
		return false;
	});

	$('button.dis').click(function(e) {
		$(this).parents('div.section').find('input').toggleDisabled().trigger('refresh');
		e.preventDefault();
	});

	$('button.dis2').click(function(e) {
		$(this).parents('div.section').find('select').toggleDisabled().trigger('refresh');
		e.preventDefault();
	});

	$('button.dis3').click(function(e) {
		$(this).parents('div.section').find('option').toggleDisabled().trigger('refresh');
		e.preventDefault();
	});

});
})(jQuery);