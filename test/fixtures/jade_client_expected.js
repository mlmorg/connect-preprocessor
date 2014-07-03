function anonymous(locals) {
jade.debug = [{ lineno: 1, filename: "test/fixtures/jade_client.jade" }];
try {
var buf = [];
var locals_ = (locals || {}),title = locals_.title;jade.debug.unshift({ lineno: 1, filename: jade.debug[0].filename });
jade.debug.unshift({ lineno: 1, filename: jade.debug[0].filename });
buf.push("<h1>" + (jade.escape(null == (jade.interp = title) ? "" : jade.interp)));
jade.debug.unshift({ lineno: undefined, filename: jade.debug[0].filename });
jade.debug.shift();
buf.push("</h1>");
jade.debug.shift();
jade.debug.shift();;return buf.join("");
} catch (err) {
  jade.rethrow(err, jade.debug[0].filename, jade.debug[0].lineno);
}
}