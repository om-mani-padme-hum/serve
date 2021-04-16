echo Copying client-side JavaScript from node modules to js folder...
cp node_modules/numeral/min/numeral.min.js js/numeral.min.js
cp node_modules/moment/min/moment.min.js js/moment.min.js
cp node_modules/moment/min/moment.min.js.map js/moment.min.js.map
cp node_modules/moment-timezone/builds/moment-timezone-with-data.min.js js/moment-timezone-with-data.min.js
cp node_modules/popper.js/dist/umd/popper.min.js js/popper.min.js
cp node_modules/popper.js/dist/umd/popper.min.js.map js/popper.min.js.map
cp node_modules/jquery/dist/jquery.min.js js/jquery.min.js
cp node_modules/jquery/dist/jquery.min.map js/jquery.min.map
cp node_modules/jquery-color/dist/jquery.color.min.js js/jquery.color.min.js
echo Browserify\'ing constants...
browserify constants.js -s constants > js/constants.js
echo Browserify\'ing models...
browserify models/index.js -s models > js/models.js
echo Done!  Starting application...