/***********************************************************************************
* Add Array.indexOf                                                                *
***********************************************************************************/
(function ()
{
	if (typeof Array.prototype.indexOf !== 'function')
	{
		Array.prototype.indexOf = function(searchElement, fromIndex)
		{
			for (var i = (fromIndex || 0), j = this.length; i < j; i += 1)
			{
				if ((searchElement === undefined) || (searchElement === null))
				{
					if (this[i] === searchElement)
					{
						return i;
					}
				}
				else if (this[i] === searchElement)
				{
					return i;
				}
			}
			return -1;
		};
	}
})();
/**********************************************************************************/

(function ($,undefined)
{
	var bark =
	{
		getcontainer : function ()
		{
			var container = $('#' + settings.dock.id);

			if(container.length < 1)
			{
				container = $(settings.dock.template).attr('id', settings.dock.id).css(settings.dock.css).addClass(settings.dock['class']);

				if ((settings.stylesheet) && (!$("link[href=" + settings.stylesheet + "]").length))
				{
					$('head').appendTo('<link rel="stylesheet" href="' + settings.stylesheet + '">');
				}

				$(settings.dock.container).append(container);
			}

			return container;
		},

		notify : function (title, message, priority)
		{
			var container = this.getcontainer();
			var notice   = $(settings.notice.template.replace('%priority%', priority)).hide().css(settings.notice.css).addClass(settings.notice['class']);

			$('.title', notice).css(settings.notice.cssTitle).html(title);
			$('.message', notice).css(settings.notice.cssMsg).html(message);

			if ((settings.debug) && (window.console))
			{
				console.log(notice);
			}

			container.append(settings.notice.display(notice));

			if ((settings.timeout > 0) && (settings.donotclose.indexOf(priority) === -1))
			{
				setTimeout(function()
				{
					settings.notice.remove(notice, function()
					{
						notice.remove();
					});
				}, settings.timeout);
			}
		}
	};

	var settings =
	{
		'dock'       :
		{
			'container' : 'body',
			'template'  : '<div></div>',
			'id'        : 'barkDock',
			'class'     : 'bark',
			'css'       :
			{
				'position' : 'fixed',
				'top'      : '10px',
				'right'    : '10px',
				'width'    : '300px',
				'zIndex'   : 50000
			}
		},

		'notice'     :
		{
			'template' :
			'<div class="alert alert-%priority% alert-dismissible" role="alert">' +
				'<button type="button" class="close" data-dismiss="alert">' +
					'<span aria-hidden="true">&times;</span>' +
					'<span class="sr-only">Close</span>' +
				'</button>' +
				'<span class="title"></span>: <span class="message"></span>' +
			'</div>',

			'css'      : {},
			'cssMsg'   : {},
			'cssTitle' : { 'fontWeight' : 'bold' },

			'fade'     : 'slow',

			display    : function (notice)
			{
				return notice.fadeIn(settings.notice.fade);
			},

			remove     : function (notice, callback)
			{
				return notice.animate({opacity: '0', height: '0px'}, {duration: settings.notice.fade, complete: callback });
			},

			element    : function (el)
			{
				settings.notice.template = $(el);
			},
		},

		'debug'      : false,
		'timeout'    : 1500,
		'stylesheet' : null,
		'donotclose' : []
	};

	$.bark = function (options)
	{
		if(typeof options === 'object')
		{
			if('settings' in options)
			{
				settings = $.extend(settings, options.settings);
			}

			var title    = ('title' in options) ? options.title : 'Notice';
			var message  = ('message' in options) ? options.message : null;
			var priority = ('priority' in options) ? options.priority : 'success';

			if(message !== null)
			{
				bark.notify(title, message, priority);
			}
		}
	};
})(jQuery);
