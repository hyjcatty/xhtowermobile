Please install the Node.js v5.1.0 or higher (higher than 6.0 is not recommended).
IF your environment have not install the gulp & webpack, u neek install them first:
npm install gulp -g
npm install webpack -g

Then add your npm node path into System PATH, and keep command "gulp" & "webpack" can run everywhere.

Change your work DIR to source folder.
Keep your internet link fluent, or you can use the set the npm mirror in your country.
1) Prepare the environment for node_modules, command:
npm install --save-dev
2) build the source, command:
npm run build
Note: this version will include the source-map.
3) pack the code to test environment command:
gulp
    Note, in gulpfile.js there is a line
    buildPath: "../www/fuehrer"
    You can change it to the target folder u want

Directory structure:
----+-build         // save the js & resource file after they are built
    +-css           // 3rd css code which will be compiled
    +-fakedata      // fake data used in require.php
    +-fonts         // font resource which will be compiled
    +-node_modules  // Node.js plugin folder, all dependence will be save in it after npm install
    +-src           // source folder
    +-resource       // data dump from huaban.com
    +-svg           // data dump from huaban.com
    --gulpfile.js   // gulp command configuration, not use yet
    --index.html    // entry of the UI, will be compiled
    --package.json  // npm configuration file
    --readme.txt    // help file
    --request.php   // php entry for Apache&PHP environment
    --webpack.config.js //webpack configuration file


.
