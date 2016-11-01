/* */ 
if (!String.prototype.format) {
  String.prototype.format = function() {
    var args = arguments;
    return this.replace(/{(\d+)}/g, function(match, number) {
      return typeof args[number] != 'undefined' ? args[number] : match;
      ;
    });
  };
}
var page = require('webpage').create(),
    fs = require('fs'),
    system = require('system'),
    config = JSON.parse(fs.read('config.json')),
    output,
    size;
if (system.args.length < 3) {
  console.log('Usage: phantasm.js filename html [WxH]');
  phantom.exit(1);
} else {
  out = system.args[1];
  opts = JSON.parse(system.args[2]);
  if (system.args[3]) {
    var dimensions = system.args[3].split('x'),
        width = dimensions[0],
        height = dimensions[1];
    function checkNum(check) {
      check = parseInt(check);
      if (!isNaN(check))
        return check;
      return false;
    }
    width = checkNum(width);
    height = checkNum(height);
    if (width && height) {
      page.viewportSize = {
        height: height,
        width: width
      };
    }
    if (!opts.size) {
      opts.size = {
        "height": height,
        "width": width
      };
    }
  } else {
    page.viewportSize = {
      height: (opts.size && opts.size.height) ? opts.size.height : 320,
      width: (opts.size && opts.size.width) ? opts.size.width : 710
    };
  }
}
page.onResourceRequested = function(requestData, request) {
  console.log('::loading resource ', requestData['url']);
};
page.onConsoleMessage = function(msg) {
  console.log(msg);
};
page.onError = function(msg, trace) {
  var msgStack = ['ERROR: ' + msg];
  if (trace && trace.length) {
    msgStack.push('TRACE:');
    trace.forEach(function(t) {
      msgStack.push(' -> ' + t.file + ': ' + t.line + (t.function ? ' (in function "' + t.function + '")' : ''));
    });
  }
  console.error(msgStack.join('\n'));
};
function injectVerify(script) {
  var req = page.injectJs(script);
  if (!req) {
    console.log('\nError!\n' + script + ' not found!\n');
    phantom.exit(1);
  }
}
page.onLoadFinished = function() {
  console.log('::rendering');
  for (var j in config.js) {
    injectVerify(config.js[j]);
  }
  page.evaluate(function(chartoptions) {
    Function.prototype.bind = Function.prototype.bind || function(thisp) {
      var fn = this;
      return function() {
        return fn.apply(thisp, arguments);
      };
    };
    c3.generate(chartoptions);
  }, opts);
  setTimeout(function() {
    page.render(out);
    phantom.exit();
  }, 300);
};
var css = '';
for (var i in config.css) {
  css += fs.read(config.css[i]);
}
page.content = config.template.format(css);
