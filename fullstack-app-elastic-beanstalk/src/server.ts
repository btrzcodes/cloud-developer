import express from 'express';
import bodyParser from 'body-parser';
const path = require('path');
import * as fs from "fs";
import {filterImageFromURL, deleteLocalFiles} from './util/util';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;

  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  // IT SHOULD
  //    1. validate the image_url query
  //    2. call filterImageFromURL(image_url) to filter the image
  //    3. send the resulting file in the response
  //    4. deletes any files on the server on finish of the response
  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]

  /**************************************************************************** */

  //! END @TODO1

  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req, res ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );

  app.get( "/filteredimage", async ( req, res ) => {
    try{
      let { image_url } = req.query;

      if ( !image_url ) {
        return res.status(400)
          .send(`Bad request. Please, notice that image_url is required as query parameter. For example /filteredimage?image_url=https://geeksroom.com/wp-content/uploads/2015/10/popcorn-time-logo-451x450.jpg`);
      }
      
      const filteredImage = await filterImageFromURL(image_url)
      
      res.status(200)
        .sendFile(filteredImage)

      res.on('finish', function() {
        try {
          const dirPath = path.join(__dirname, '/util/tmp')
          const allFiles = fs.readdirSync(dirPath)
          deleteLocalFiles(allFiles)
        } catch(e) {
          console.log("error removing the temp file", e); 
        }
    });

    } catch (e) {
      return res.status(500)
          .send(`Error in the server code ===> ${e}!`);
    } 
  });

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();
