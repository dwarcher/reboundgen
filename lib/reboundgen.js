/*
 * reboundgen
 * https://github.com/dwallin/reboundgen
 *
 * Copyright (c) 2014 Dave Wallin
 * Licensed under the BSD license.
 */

'use strict';

// Data.
var vendorPrefixes = [ "-webkit-", ""];

var propertyInfo = {
	opacity: { units: "", threshold: 0.01 },
	left: { units: "px", threshold: 0.1 },
	right: { units: "px", threshold: 0.1 },
	top: { units: "px", threshold: 0.1 },
	bottom: { units: "px", threshold: 0.1 },
	translateX: { units: "px", transform: true, threshold: 0.25 },
	translateY: { units: "px", transform: true, threshold: 0.25 },
	translateZ: { units: "px", transform: true, threshold: 0.25 },
	scaleX: { units: "", transform: true, threshold: 0.0015 },
	scaleY: { units: "", transform: true, threshold: 0.0015 },
	scaleZ: { units: "", transform: true, threshold: 0.0015 },
	rotate: { units: "deg", transform: true, threshold: 0.1 },
	rotateX: { units: "deg", transform: true, threshold: 0.1 },
	rotateY: { units: "deg", transform: true, threshold: 0.1 },
	rotateZ: { units: "deg", transform: true, threshold: 0.1 },
	skewX: { units: "deg", transform: true, threshold: 0.1 },
	skewY: { units: "deg", transform: true, threshold: 0.1 }
};

function extend(target) {
    var sources = [].slice.call(arguments, 1);
    sources.forEach(function (source) {
        for (var prop in source) {
            target[prop] = source[prop];
        }
    });
    return target;
}

exports.generateFromFile = function(filename) {
	if(typeof(filename) !== "string")
	{
		return false;
	}

	console.log("Reading " + filename);
	var jf = require('jsonfile');

	var optionsFile = jf.readFileSync(filename);
	exports.generate(optionsFile);

	return true;
};

exports.generateSingle = function(options) {
	var rebound = require("./rebound");

	// Only transform properties are supported here.
	// And then only translateX-Z, scaleX-Z, rotateX-Z, rotate, skewX, skewY
	// FIXME: add support for left, top, bottom, right, opacity.

	var defaultOptions = {
		name: "anim1",
		steps: 50,
		tension: 30,
		friction: 5,
		initialVelocity: 0,
		hardBounce: false,
		bounceDamp: 0.7,
		originX: 0.5,
		originY: 0.5,
		perspective: 1000,
		properties: {
			translateX: 500,
		},
		outputFolder: "tmp/"
	};

	options = extend( {}, defaultOptions, options);

	var results = { };
	var properties = options.properties;

	var longestSpring = 0;
	var k;

	for (k in properties) {
		// create and run springs for each property


		var localOptions;
		localOptions = extend( { start: 0, end: 0 }, options);

		if (typeof(properties[k]) === "object") {
			localOptions = extend( localOptions, properties[k]);
		} else if (typeof(properties[k]) === "number") {
			localOptions.end = properties[k];
		}

		if(localOptions.bounceDamp > 0.99)
		{
			localOptions.bounceDamp = 0.99;
		}

		if(localOptions.bounceDamp < 0.0)
		{
			localOptions.bounceDamp = 0.0;
		}

		var looper = new rebound.SimulationLooper();
		var springSystem = new rebound.SpringSystem(looper);
		var spring = springSystem.createSpring(localOptions.tension, localOptions.friction);
		spring.localOptions = localOptions;

		var springValues = [];

		spring.addListener({
			onBeforeIntegrate: function(spring) {

			},
			onSpringUpdate: function(spring) {
				var val = spring.getCurrentValue();
				if (spring.localOptions.hardBounce && !spring.isAtRest()) {
					if ((spring.localOptions.start < spring.localOptions.end && spring.getCurrentValue() > spring._endValue) || 
						(spring.localOptions.start > spring.localOptions.end && spring.getCurrentValue() < spring._endValue))
					{
						var bounceVel;
						bounceVel = -options.bounceDamp * spring.getVelocity();
						//spring.setCurrentValue(spring._endValue, true);
						//spring.setVelocity(bounceVel);
						// spring._startValue = spring._endValue+ bounceVel;
						spring._currentState.position = spring._endValue;
						spring._currentState.velocity = bounceVel;
						val = spring._endValue;
					}
				}

				springValues.push(val);
			}
		});

		spring.setValueAndVelocity(localOptions.start, localOptions.initialVelocity);
		spring.setEndValue(localOptions.end);

		looper.run();


		if (looper.simTime > longestSpring) {
			longestSpring = looper.simTime;
		}

		var resultObj = {
			length: looper.simTime,
			timestep: looper.timestep,
			values: springValues
		};

		results[k] = resultObj;
	}

	var keyframes = {};
	var lastKeyframe = { };

	for (var i = 0; i <= 100; i += (100 / options.steps)) {
		var keyframe = {};
		var currentTime = i * longestSpring / 100;
		
		for (k in properties) {
			var val;
			var startVal = 0;
			var endVal = 0;
			var ndx = Math.round(currentTime / results[k].timestep);
			if (typeof(properties[k]) === "object") {
				if (typeof(properties[k].start) === "number")
				{
					startVal = properties[k].start;
				}

				if (typeof(properties[k].end) === "number")
				{
					endVal = properties[k].end;
				}

			} else if (typeof(properties[k]) === "number") {
				endVal = properties[k];
			}

			if (ndx < results[k].values.length) {
				var springVal;
				springVal = results[k].values[ndx];
				//val = rebound.MathUtil
				//	.mapValueInRange(springVal, 0, 1, startVal, endVal);
				val = springVal;
			} else {
				val = endVal;
			}

			// 'compression'.. Don't bother doing a keyframe if value hasn't changed much.
			if(i == 100 || typeof lastKeyframe[k] !== "number" ||
				Math.abs(lastKeyframe[k] - val) > propertyInfo[k].threshold )
			{
				keyframe[k] = val;				
			}
		}

		if(typeof options.fadeIn == "number")
		{
			var opacityVal = 0;
			k = "opacity";
			
			if(currentTime < options.fadeIn)
			{
				opacityVal = currentTime / options.fadeIn;
			} else {
				opacityVal = 1.0;
			}

			if(i == 100 || typeof lastKeyframe[k] !== "number" ||
				Math.abs(lastKeyframe[k] - opacityVal) > propertyInfo[k].threshold )
			{
				keyframe[k] = opacityVal;				
			}
		}

		if(typeof options.fadeOut == "number")
		{
			var opacityVal = 0;
			k = "opacity";
			

			if(currentTime > longestSpring - options.fadeOut)
			{
				opacityVal = 1.0 - (currentTime - (longestSpring - options.fadeOut) / options.fadeOut);

				if(opacityVal < 0.0 )
					opacityVal = 0.0;

				if(i == 100 || typeof lastKeyframe[k] !== "number" ||
					Math.abs(lastKeyframe[k] - opacityVal) > propertyInfo[k].threshold )
				{
					keyframe[k] = opacityVal;				
				}
			} 
		}

		keyframes[i.toFixed(0)] = keyframe;

		// keep track of current state.
		lastKeyframe = extend(lastKeyframe, keyframe);
		
	}

	// Template it out.

	var output = "";
	var p;

	// Render all the keyframes down to text for our stylesheet
	for (p in vendorPrefixes) {
		var prefix = vendorPrefixes[p];
		output += "@" + prefix + "keyframes " + options.name + " {\n";

		for (k in keyframes) {
			var keyframeOutput = "";
			var keyframe = keyframes[k];
			var prop;
			keyframeOutput += k + "% {\n";

			var transformOutput = "";
			var numTransforms = 0;
			// Do all transform based properties.
			transformOutput += " " + prefix + "transform:";
			for (prop in keyframe) {

				if(typeof propertyInfo[prop] === "object")
				{
					if(propertyInfo[prop].transform)
					{
						transformOutput += " " + prop + "(" + keyframe[prop].toFixed(3) + propertyInfo[prop].units + ")";
						numTransforms += 1;
					}
				} else {
					console.log("ERROR, property " + prop + " not defined.");
				}
			}
			transformOutput += ";\n";

			if(numTransforms > 0)
			{
				keyframeOutput += transformOutput;	
			}

			// Do non-transform properties.
			var propOutput = ""
			var numProperties = 0;
			for (prop in keyframe) {
				if(typeof propertyInfo[prop] === "object")
				{
					if(!propertyInfo[prop].transform)
					{
						propOutput += "	" + prop + ": " + keyframe[prop].toFixed(3) + propertyInfo[prop].units + ";\n";
						numProperties += 1;
					}
				} else {
					console.log("ERROR, property " + prop + " not defined.");
				}
			}

			if(numProperties > 0)
				keyframeOutput += propOutput;
		
			// End keyframe
			keyframeOutput += "}\n";

			if(numProperties > 0 || numTransforms > 0)
			{
				output += keyframeOutput;
			}
		}

		output += "}\n";
	}

	output += "\n// Generated by easegen";
	output += "\n// Recommended Length: " + (longestSpring / 1000) + "\n";

	output += "." + options.name + " {\n ";

	for (p in vendorPrefixes) {
		var prefix = vendorPrefixes[p];
		output += "	" + prefix + "animation: " + options.name + " " + (longestSpring / 1000).toFixed(3) + "s linear 0s 1 normal both;\n";
		output += "	" + prefix + "transform-origin: " + (options.originX*100) + "% " + (options.originY*100) + "%;\n";

	}

	output += "}\n";

	//console.log(output);


	var fs = require('fs');
	fs.writeFile(options.outputFolder + "_" + options.name + ".scss", output, function(err) {
		if (err) {
			throw err;
		} else {
			console.log("Generated " + options.name);
		}
	});


	return true;
};


exports.generate = function(options) {
	if (typeof options == "object" && Array.isArray(options.animations)) {
		var allList = "";

		for (var i = 0; i < options.animations.length; i++) {
			options.animations[i].outputFolder = options.outputFolder;
			exports.generateSingle(options.animations[i]);

			allList += '@import "' + options.animations[i].name + '";\n'
		}

		// write master scss file.
		var fs = require('fs');

		fs.writeFile(options.outputFolder + "_animations.scss", allList, function(err) {
			if (err) {
				throw err;
			} else {
				console.log("Generated _animations.scss");
			}
		});

	} else {
		exports.generateSingle(options);
	}

	return true;
};