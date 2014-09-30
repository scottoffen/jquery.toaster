# jQuery Bark #
*Requires [Bootstrap](http://getbootstrap.com/) 3.0+*

**Bark** is a jQuery plugin for displaying toast notifications. It comes with a sublime set of defaults that you can use out of the box, while at the same time remains completely flexible; bending to meet your specific design needs.

>Bark includes a polyfill for [`Array.indexOf`](http://kangax.github.io/compat-table/es5/#Array.prototype.indexOf) to support older browsers (IE8).

### What Is This Toast You Speak Of? ###

While *toast* is most often used to describe sliced bread that has been browned by dry heat, it can really refer to any kind of material that has been browned in such fashion.

Or - as is our case - toast can refer to a **non-modal**, unobtrusive UI element used to display brief, **auto-expiring** (aka auto-dismissing) windows of **information** to a user. It does not accept focus or user input, nor does it interrupt the current activity. *Much like a small dog yapping in the background.*

>While the definitive origin of the term "toast" to describe this type of notification system is unknown to me, it could reasonably be a reference to either (a) the salutation or words of congratulations, good wishes, appreciation, etc., spoken immediately before drinking to a person or event *or* (b) the fact that it pops up like bread from a toaster. Cheers!

## Usage ##

Include the `jquery.bark.js` JavaScript file on your HTML page after referencing jQuery, and then display toast messages anytime like this:

```javascript
/*
* Specify each parameter...
*/
$.bark({ title : 'Success', priority : 'success', message : 'Whatever you did worked!' });
$.bark({ title : 'Bad News', priority : 'danger', message : 'Whatever you did failed!' });

/*
* ...or pass only a string; it will be treated as the intended message,
* and 'priority' will default to 'success', and 'title' to 'Notice'.
*/
$.bark('Whatever you did worked!');
```

### Priorities ###

The `priority` property is based on the [contextual colors](http://getbootstrap.com/css/#helper-classes-colors) available on the [Bootstrap alert component](http://getbootstrap.com/components/#alerts). Available options built into Bootstrap are:

- success
- info
- warning
- danger

In this fashion, Bark messages will automatically match the Bootstrap theme you are using. If you have defined (named) additional contextual colors that apply to the Bootstrap alert component, feel free to use them! Everything should work just fine. 

### How It Works ###

Simply put, auto-dismissing alerts are added to a `div` element designed to hold them. This 'toast holder' element - referred to as the 'dock' - will be created if it doesn't already exist, so you really don't need to do anything to use this out of the box.

>If the defaults work for you, great! You don't need to read any further than this. Live as long as is expedient and may your prosperity be equivalent to the effort you invest and the value of your output.

## Settings ##

As noted earlier, Bark has a great set of default settings that mean you can use it without modification. But, if you'd like to customize the settings, it can easily be done - and undone!

### Customizing ###

To customize the settings, pass a `settings` object with your desired changes.

```javascript
$.bark({ settings : {...} });
```

Only what is defined in the object you send will override the default settings, all other settings will remain untouched. The settings are applied before any message that may have been passed at the same time is created and displayed.

To clear all changes made and revert to the default settings, simply call reset:

```javascript
$.bark.reset();
``` 

### Settings Object ###

The settings object allows you to change everything about the plugin. Let's take a look at the default settings, and then we'll dig into them from top to bottom!

```javascript
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
		}
	},

	'debug'        : false,
	'timeout'      : 1500,
	'stylesheet'   : null,
	'donotdismiss' : []
}
```

The properties of the settings object are:

| Property     | Default | Description |
| ------------ | ------- | ----------- |
| dock         | object  | see dock    |
| notice       | object  | see notice  |
| debug        | false   | A boolean (or truthy/falsey) value to indicate that debuging mode is on/off. If it is on, then the notification element is written out to `console.log` prior to being added to the DOM so it can be inspected. |
| timeout      | 1500    | An integer, the number of milliseconds to wait before calling the `settings.notice.remove` method. |
| stylesheet   | null    | A path to a stylesheet that should be included whenever this plugin is used. You can hardcode a value here if you'd rather not hassle with a call to settings. If the stylesheet referenced is not found on the page, it will be added. |
| donotdismiss | array   | This is expected to be an array of [priorities](#Priorities) that should not be auto-dismissed. Empty by default. Any notification with a priority in this array will not have the `settings.notice.remove` method called on it after the `settings.timeout` amount of time, and will need to be manually dismissed. |

#### dock ####

The dock is where all notifications will appear. This section of the settings allows us to identify and/or configure the dock.

| Property  | Default       | Description |
| --------- | ------------- | ----------- |
| id        | barkDock      | The id attribute of the dock element. You can create the dock and style it yourself, then provide bark with that DOM elements id, or this is the id that will be assigned to the dock DOM element that gets created. If an element with this id already exists, the rest of the dock properties are ignored.|
| container | `body`        | The container element that the dock will be attached to. |
| template  | `<div></div>` | The template used to create the dock element. |
| class     | bark          | The class (or classes) to be applied to the template when creating the dock DOM element. |
| css       | object        | Style attributes to be applied to the dock DOM element.|

#### notice ####

The notice is the template that will be used to create all bark notifications. This section is used to define that template and its relevant attributes.


| Property | Default  | Description |
| -------- | -------- | ----------- |
| template | [alert](http://getbootstrap.com/components/#alerts-dismissible) | The html template (as a string) that will be used to create each notification. It can (and should) contain placeholders for `%priority%`, and there should be elements with the classes `title` and `message`, as these will be used to put the text for the title and message properties in the call to `$.bark`. |
| css      | object   | Style attributes to be applied to each notice generated. |
| cssMsg   | object   | Style attributes to be applied to each element with the class `message`. |
| cssTitle | object   | Style attributes to be applied to each element with the class `title`. |
| fade     | slow     | Defines the duration for the fade in/out effect on the notification. |
| display  | function | Callback to handle the initial display of the notification element. |
| remove   | function | Callback to handle the remove of the notification element. |

Note that fade is only used by the default display and remove callback functions. If you wanted to have elements fade in at different speeds than they fade out, you can use this modification:

```javascript
$.bark({ settings :
{
	notice :
	{
		fade : [ in : 'fast', out : 'slow' ],

		display : function (notice)
		{
			return notice.fadeIn(settings.notice.fade.in);
		},

		remove : function (notice, callback)
		{
			return notice.animate(
			{
				opacity: '0',
				height: '0px'
			},
			{
				duration: settings.notice.fade.out,
				complete: callback
			});
		}
	}
}});
```

Also note that when you customize settings, you can **add** properties, too! So if, for example, you don't want the notifications to fade in/out, but want them them to slide instead; you can use this (completely untested) modification:

```javascript
$.bark({ settings :
{
	notice :
	{
		fade : [ in : 'fast', out : 'slow' ],
		easing : [ in : 'swing', out : 'linear' ],

		display : function (notice)
		{
			return notice.slideToggle(settings.notice.fade.in, settings.notice.easing.in);
		},

		remove : function (notice, callback)
		{
			return notice.slideToggle(settings.notice.fade.out, settings.notice.easing.out, callback);
		}
	}
}});
```

Remember that you have complete access to the settings object inside these callback methods, so if you want to key of another value - either a documented one like settings.debug or a custom one of your own creation - you can do that!

>In all cases, note that the `remove` callback should take a callback method, and don't forget to call it!


### Variable Timeouts ###

If you want notifications of different priorities to expire at different intervals, you'll be happy to know that the `settings.timeout` property can also be an object! The key should be the priority and the value the number of milliseconds to wait before auto-dismissing the notification.
