call jossy ./src/core.js > snakeskin.js withCompiler old old.live
call jossy ./src/core.js > snakeskin.live.js

java -jar gcc.jar --js snakeskin.live.js --compilation_level SIMPLE_OPTIMIZATIONS --js_output_file snakeskin.live.min.js
java -jar gcc.jar --js snakeskin.js --compilation_level SIMPLE_OPTIMIZATIONS --js_output_file snakeskin.min.js