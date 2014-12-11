# ReboundGen

SASS/CSS3 Keyframe animation generator built on [Facebook's Rebound.js](https://github.com/facebook/rebound-js). Similar to [Animate.css](http://daneden.github.io/animate.css/)


## Examples
See [here](http://dwarcher.github.io/reboundgen/examples/) for a list of the 'out of the box' animations.

## How to use

#### Easy instructions

1. [Download](https://github.com/dwarcher/reboundgen/archive/master.zip) this package.
2. SCSS files are available in the `dist/` folder. You can import the `_animations.scss` file to include all the animations.
3. Simply put the corresponding class on the element you want to animate. For Example: `bounceInRight`. Note that for the flipping animations you may need `perspective: XXXXpx;` on the container element for the full effect.

It's recommended that you comment out animations you aren't using from `_animations.scss` to save on file size. If you just want to use a pre-built css file, you can find it [here](http://dwarcher.github.io/reboundgen/dist/reboundgen.min.css) (47kb.)

## How to customize and build your own animations

1. Clone this repo `git clone https://github.com/dwarcher/reboundgen.git .`
2. Install [Grunt](http://gruntjs.com/getting-started) if you haven't.
3. Edit the `data/data.json` (see below for more details)
4. Run `grunt build`
5. Built animations will go into `dist/`
6. Or, you can run `grunt watch` to build whenever you make a change.

This will build individual animations, compiled .css files and automatically add any new animations to the example page so you can see them immediately. This can be a big help for quickly developing new animations. 

Alertnately, you can compile from code.

Install the module with: `npm install reboundgen`

```javascript
var reboundgen = require('../lib/reboundgen.js');

reboundgen.generateFromFile("data/data.json")
```

This could easily be turned into a grunt or gulp plugin...

## Data format

```javascript
{ 
	"outputFolder": "dist/",
	"animations": 
	[
		{
			"steps": 50,
			"name": "bounceInRight",
			"tension": 50,
			"friction": 5,
			"fadeIn": 150,
			"hardBounce": true,
			"bounceDamp": 0.4,
			"properties": {
				"translateX": { 
					"friction": 3,
					"start": 500, 
					"end": 0 
				},
				"translateY": 500
			}
		}
	]
}
```

#### steps
Type: `Number`
Default value: `50`

The number of keyframes to generate. In most cases you can leave this at 50, since reboundgen will remove unnecessary keyframes. However you can experiment with using lower values like 25 to save on file size.

#### name
Type: `String`

The name of the animation and resulting .scss file. Be sure to avoid illegal characters.

#### tension
Type: `Number`
Default value: `30`

Tension of the spring. How quickly it snaps back.

#### friction
Type: `Number`
Default value: `5`

Friction force. Slows the spring motion.

#### fadeIn
Type: `Number`
Default value: `0`

Time in milliseconds to fade in opacity.

#### fadeOut
Type: `Number`
Default value: `0`

Time in milliseconds to fade out opacity.

#### hardBounce
Type: `Boolean`
Default value: false

Instead of allowing the spring to freely oscillate, bounces the spring as if hitting a wall, when passing the target value.

#### bounceDamp
Type: `Number`
Default value: `0`

Factor of velocity lost when bouncing, in the range of 0...0.99

#### properties
Type: `Object`

List of properties to animate. Currently we're suppporting:

+ translateX
+ translateY
+ translateZ
+ scaleX
+ scaleY
+ scaleZ
+ rotate
+ rotateX
+ rotateY
+ rotateZ
+ skewX
+ skewY

#### originX
Type: `Number`
Default value: `0.5`

The transform-origin x parameter in the range of 0...1.0

#### originY
Type: `Number`
Default value: `0.5`

The transform-origin y parameter in the range of 0...1.0

If you specify an object for the property, you can set the `start` and `end`. Additionally, any of the above parameters (friction, tension, etc.) can be overriden per property. If you don't specify an object and simply specify a number instead, then it is assumed that you are transitioning from 0 to the number with the default settings.

## Known Issues

I've noticed that Safari seems to break when using scale 0.0 as the initial scale when combined with rotation. Using 0.1 works. Also, the 'rubberband' animation seems to cause some rendering issues in Chrome sometimes.

## License
Copyright (c) 2014 Dave Wallin  
Licensed under the BSD license.
