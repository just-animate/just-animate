var animations = require('./animation1.json');
var fs = require('fs');
var _ = require('lodash');

var animations2 = {};
for (var animationName in animations) {
    var animation = animations[animationName];
    var animation2 = [];
    
    for (var keyName in animation) {
        var properties = animation[keyName];
        
        keyName.split(',').forEach(function (keyString) {
            var offset = parseFloat(keyString.trim()) / 100;
            var keyFrame = _.extend({ offset: offset }, properties);
            animation2.push(keyFrame);
        });
    }
    animation2 = _.sortBy(animation2, ['offset']);
    animations2[animationName] = animation2;
}

fs.writeFile('animation2.json', JSON.stringify(animations2))