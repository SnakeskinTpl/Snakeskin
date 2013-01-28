goto start
--------------------------------------
compile
--------------------------------------
:start

call jossy snakeskin.js > snakeskin.live.js
java -jar compiler.jar --js snakeskin.live.js --compilation_level SIMPLE_OPTIMIZATIONS --js_output_file snakeskin.live.min.js
java -jar compiler.jar --js snakeskin.js --compilation_level SIMPLE_OPTIMIZATIONS --js_output_file snakeskin.min.js