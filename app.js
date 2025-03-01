const express = require("express");
var bodyParser = require("body-parser");
const axios = require("axios");
const cors = require("cors");
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
var urlencodedParser = bodyParser.urlencoded({ extended: false });
const apiKey = process.env.API_KEY;
const app = express();
app.use(cors());
let pageNo=1;

const port = process.env.PORT || 6450;
const ejsMate = require("ejs-mate");
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/views"));
app.use(express.static(__dirname + "/public"));
// app.use(express.static('public'))
app.get("/", (req, res) => {
  if(pageNo!=1)pageNo=1;
  // res.send("hi");
  res.render("index.ejs");
});
app.get("/shows", (req, res) => {
  // res.send("hi");  
  if(pageNo!=1)pageNo=1;

  res.render("./shows.ejs");
});
app.post("/shows", urlencodedParser, async (req, res) => {
  if(pageNo!=1)pageNo=1;
 
  const { searchTerm } = req.body;
  try {
    var id = await axios({
      method: "get",
      url: `https://api.themoviedb.org/3/search/tv?api_key=${process.env.API_KEY}&language=en-US&page=1&include_adult=false&query=${searchTerm}`,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
    })
   
    var id2 = id.data.results[0]?.id;
    var response = await axios({
      url: `https://api.themoviedb.org/3/tv/${id2}/recommendations?api_key=${process.env.API_KEY}&append_to_response=videos&language=en-US&page=1`,
      method: "GET",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
    });
    var finalresult = response.data.results;
    const getlink = [];
    for (let i = 0; i < finalresult.length; i++) {
      const getvideourl = await axios({
        url: `https://api.themoviedb.org/3/tv/${finalresult[i].id}/videos?api_key=${process.env.API_KEY}`,
        method: "GET",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
      });
      getlink.push(getvideourl.data.results[0]?.key);
    }

    if (finalresult.entries({}).length === 0) {
      res.render("error");
    } else {
      
      res.render("showShows", {
        finalresult: finalresult,
        getlink: getlink,
        genreId: genreId,
      });
    }
  } catch (error) {
    console.error(error);
  }
});

app.post("/", urlencodedParser, async (req, res) => {
  if(pageNo!=1)pageNo=1;
  
  const { searchTerm } = req.body;
  try {
    var id = await axios({
      method: "get",
      url: `https://api.themoviedb.org/3/search/movie?api_key=${process.env.API_KEY}&language=en-US&page=1&include_adult=false&query=${searchTerm}`,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
    });
    
    var id2 = id.data.results[0]?.id;

    var response = await axios({
      url: `https://api.themoviedb.org/3/movie/${id2}/recommendations?api_key=${process.env.API_KEY}&append_to_response=videos&language=en-US&page=1`,
      method: "GET",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
    });
    var finalresult = response.data.results;

    const getlink = [];
    for (let i = 0; i < finalresult.length; i++) {
      const getvideourl = await axios({
        url: `https://api.themoviedb.org/3/movie/${finalresult[i].id}/videos?api_key=${process.env.API_KEY}`,
        method: "GET",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
      });
      getlink.push(getvideourl.data.results[0].key);
    }

    if (finalresult.entries({}).length === 0) {
      res.render("error");
    } else {
      res.render("showMovies", {
        finalresult: finalresult,
        getlink: getlink,
        genreId: genreId,
        pageNo:pageNo,
        searchTerm:searchTerm
      });
    }
  } catch (error) {
    console.error(error);
  }
});
app.get("/discover", urlencodedParser, async (req, res) => {
 
  const { searchTerm } = req.body;
  try {
    var response = await axios({
      method: "get",
      url: `https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=${process.env.API_KEY}&language=en-US&page=${pageNo}&include_adult=false`,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
    });
    pageNo+=1;
    
    var finalresult = response.data.results;

    const getlink = [];
    for (let i = 0; i < finalresult.length; i++) {
      const getvideourl = await axios({
        url: `https://api.themoviedb.org/3/movie/${finalresult[i].id}/videos?api_key=${process.env.API_KEY}`,
        method: "GET",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
      });
      getlink.push(getvideourl.data.results[0]?.key);
    }

    if (finalresult.entries({}).length === 0) {
      res.render("error");
    } else {
      res.render("showTrending", {
        finalresult: finalresult,
        getlink: getlink,
        genreId: genreId,
      });
    }
  } catch (error) {
    console.error(error);
  }
});

app.post("/search", urlencodedParser, async (req, res) => {
  if(pageNo!=1)pageNo=1;
  
  const { searchTerm } = req.body;
  try {
    var response = await axios({
      method: "get",
      url: `https://api.themoviedb.org/3/search/movie?api_key=${process.env.API_KEY}&language=en-US&page=1&include_adult=false&query=${searchTerm}`,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
    });
   
    var finalresult = response.data.results;
    const getlink = [];
    for (let i = 0; i < finalresult.length; i++) {
      const getvideourl = await axios({
        url: `https://api.themoviedb.org/3/movie/${finalresult[i].id}/videos?api_key=${process.env.API_KEY}`,
        method: "GET",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
      });

      const newobj = getvideourl.data.results[0];
      getlink.push(newobj?.key);
    }

    if (finalresult.entries({}).length === 0) {
      res.render("error");
    } else {
      res.render("showSearch", {
        finalresult: finalresult,
        getlink: getlink,
        genreId: genreId,
      });
    }
  } catch (error) {
    console.error(error);
  }
});
app.listen(port, () => {
  console.log("app is running");
});
genreId = {
  genres: [
    { id: 28, name: "Action" },
    { id: 12, name: "Adventure" },
    { id: 16, name: "Animation" },
    { id: 35, name: "Comedy" },
    { id: 80, name: "Crime" },
    { id: 99, name: "Documentary" },
    { id: 18, name: "Drama" },
    { id: 10751, name: "Family" },
    { id: 14, name: "Fantasy" },
    { id: 36, name: "History" },
    { id: 27, name: "Horror" },
    { id: 10402, name: "Music" },
    { id: 9648, name: "Mystery" },
    { id: 10749, name: "Romance" },
    { id: 878, name: "Science Fiction" },
    {
      id: 10768,
      name: "War & Politics",
    },
    { id: 10770, name: "TV Movie" },
    {
      id: 10767,
      name: "Talk",
    },
    { id: 53, name: "Thriller" },
    { id: 10752, name: "War" },
    { id: 37, name: "Western" },
    { id: 10759, name: "Action & Adventure" },
    {
      id: 10766,
      name: "Soap",
    },
    {
      id: 10762,
      name: "Kids",
    },
    {
      id: 10765,
      name: "Sci-Fi & Fantasy",
    },
    {
      id: 10763,
      name: "News",
    },
    {
      id: 10764,
      name: "Reality",
    },
  ],
};
