(function($) {
$(function() {

	/* скрипты для работы примеров */

	$('button.add').click(function(e) {
		var inputs = '';
		for (i = 1; i <= 5; i++) {
			inputs += '<label><input type="checkbox" name="checkbox" /> checkbox ' + i + '</label><br />';
		}
		$(this).parents('div.section').append('<div>' + inputs + '</div>');
		$('input:checkbox').styler();
		e.preventDefault();
	})

	$('button.add2').click(function(e) {
		var inputs = '';
		for (i = 1; i <= 5; i++) {
			inputs += '<label><input type="radio" name="radio" /> radio ' + i + '</label><br />';
		}
		$(this).parents('div.section').append('<div>' + inputs + '</div>');
		$('input:radio').styler();
		e.preventDefault();
	})

	$('button.add3').click(function(e) {
		$(this).parents('div.section').append('<br /><br /><select><option>-- Выберите --</option><option>Пункт 1</option><option>Пункт 2</option><option>Пункт 3</option><option>Пункт 4</option><option>Пункт 5</option></select>');
		$('select').styler();
		e.preventDefault();
	})

	$('button.add4').click(function(e) {
		var options = '';
		for (i = 1; i <= 5; i++) {
			options += '<option>Option ' + i + '</option>';
		}
		$(this).parents('div.section').find('select').each(function() {
			$(this).append(options);
		})
		$('select').trigger('refresh');
		e.preventDefault();
	})

	$('button.add5').click(function(e) {
		$(this).parents('div.section').append('<div><input type="file" name="" /></div>');
		$('input:file').styler();
		e.preventDefault();
	})

	$('button.dis').click(function(e) {
		(function($) {
			$.fn.toggleDisabled = function() {
				return this.each(function() {
					this.disabled = !this.disabled;
				});
			};
		})(jQuery);
		$(this).parents('div.section').find('input').toggleDisabled().trigger('refresh');
		e.preventDefault();
	})

	$('button.check').click(function() {
		(function($) {
			$.fn.toggleChecked = function() {
				return this.each(function() {
					this.checked = !this.checked;
				});
			};
		})(jQuery);
		$(this).parents('div.section').find('input').toggleChecked().trigger('refresh');
		return false;
	})

	$('button.sel').click(function(e) {
		$(this).parents('div.section').find('option').removeAttr('selected').end().find('option:nth-child(5)').attr('selected', true);
		$('select').trigger('refresh');
		e.preventDefault();
	})

})
})(jQuery)