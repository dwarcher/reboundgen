# reboundgen

Keyframe animation generator that uses Rebound.js


## Examples
Are [here](http://dwarcher.github.io/reboundgen/examples/)

## How to use

#### Easy instructions

1. [Download](https://github.com/dwarcher/reboundgen/archive/master.zip) this package.
2. SCSS files are available in the `dist/` folder. You can import the `_animations.scss` file to include all the animations.
3. Simply put the corresponding class on the element you want to animate. For Example: `bounceInRight`. Note that for the flipping animations you may need `perspective: XXXXpx;` on the container element for the full effect.

It's recommended that you comment out animations you aren't using from `_animations.scss`, as these animations can get quite large.

## How to customize and build your own animations

1. Clone this repo `git clone https://github.com/dwarcher/reboundgen.git .`
2. Install [Grunt](http://gruntjs.com/getting-started) if you haven't.
3. Edit the `data/data.json` (see below for more details)
4. Run `grunt build`
5. Built animations will go into `dist/`
6. Or, you can run `grunt watch` to build whenever you make a change.

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

The number of keyframes to generate. Depending on how complex your animation becomes, you may need more or less frames.

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

If you specify an object for the property, you can set the `start` and `end`. Additionally, any of the above parameters (friction, tension, etc.) can be overriden per property. If you don't specify an object and simply specify a number instead, then it is assumed that you are transitioning from 0 to the number with the default settings.

## Release History
_(Nothing yet)_

## License
Copyright (c) 2014 Dave Wallin  
Licensed under the BSD license.
