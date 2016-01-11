define(['jquery', 'Df_Core/Handsontable', 'domReady!'], function($) {return (
	/**
	 * 2015-11-24
	 * @param {Object} config
	 * @param {String} config.id
	 * @param {String[]} config.columns
	 * @param {String[]} config.rows
	 */
	function(config) {
		var $element = $(document.getElementById(config.id));
		var $container = $('<div class="Dfe_SalesSequence-Matrix"/>');
		$element.after($container);
		var $table = new Handsontable($container.get(0), {
			cell: [
				//{row: 1, col: 0, className: 'htCenter htMiddle'}
				//,{row: 1, col: 1, className: 'htCenter htMiddle'}
			]
			,data:
				/** @returns {Array} */
				function() {
					/** @type {String} */
					var valuesS = $element.val();
					/** @type {Array} */
					var result = null;
					if ('' !== valuesS) {
						//noinspection UnusedCatchParameterJS,EmptyCatchBlockJS
						try {result = JSON.parse(valuesS);} catch(e) {}
					}
					if (!$.isArray(result)) {
						/**
						 * 2016-01-10
						 * Пример массива с данными для Handsontable из 3 колонок и 5 строк:
						 [
						 	["тест","2","3"]
						 	,["4","5","6"]
						 	,["","тест","12"]
						 	,["7","999","9"]
						 	,["88888",null,null]
						 ]
						 * Когда мы создаём пустой массив, приходится делать хотя бы одну строку,
						 * иначе Handsontable работает некорректно.
						 */
						result = [new Array(config.columns.length)];
					}
					return result;
				}()
			// 2015-12-16
			// http://docs.handsontable.com/0.20.2/Options.html#colHeaders
			,colHeaders: config.columns
			// 2015-12-16
			// Похоже, мы нуждаемся в этой опции,
			// чтобы при нажатии кнопки «Delete» мы могли использовать $table.getSelected()
			// http://stackoverflow.com/a/17389359
			//,outsideClickDeselects: false
			// 2016-01-10
			// http://docs.handsontable.com/0.20.2/Options.html#rowHeaders
			,rowHeaders: config.rows
			// 2015-12-16
			// Растягивает таблицу по ширине родительского контейнера.
			// Значение «all» означает, что все колонки растягиваются равномерно.
			// http://docs.handsontable.com/0.20.2/Options.html#stretchH
			// http://code.dmitry-fedyuk.com/discourse/df-table/blob/330c130a98a4e4bc26ef855ffcda401726ba1b33/assets/javascripts/models/editor.js.es6#L41
			,stretchH: 'all'
			// 2016-01-10
			// http://docs.handsontable.com/0.20.2/Options.html#colWidths
			,colWidths: '25%'
			,className: 'htMiddle htCenter'
			// 2016-01-11
			// Вынуждены пересчитать ширину столбцов, иначе происходят глюки,
			// и таблица занимает по ширине больше места, чем требуется
			// (я думал, это из-за первой колонки с подписями,
			// для которой мы явно указали нестандартную ширину в CSS).
			,afterChange: function() {
				this.forceFullRender = true;
				this.selection.refreshBorders(null, true);
			}
		});
		(function() {
			/** @type {jQuery} HTMLFormElement */
			var $form = $element.closest('form');
			/**
			 * 2015-12-16
			 * По аналогии с http://code.dmitry-fedyuk.com/m2e/markdown/blob/d030a44bfe75765d54d68acf106e2fbb9bd66b4c/view/adminhtml/web/main.js#L364
			 */
			$form.bind('beforeSubmit', function() {
				$element.val(JSON.stringify($table.getData()));
			});
		})();
	}
);});