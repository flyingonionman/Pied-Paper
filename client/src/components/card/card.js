import React, { useCallback, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';

import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import './card.css'

import axios from "axios";

const useStyles = makeStyles({
  root: {
    '.MuiTypography-gutterBottom': {
      marginBottom: "1em"
    },
    display: 'flex',
    flexDirection: 'row',
    padding: 0,
    transition: 'transform .4s',
    overflow: 'visible',
    height: "20vh",
    marginBottom: "2vh"
  },
  '.MuiCardContent-root:last-child': {
    padding: 0
  },

  'root:hover': {

  },
  media: {
    height: '20vh',
    flex: .3,
    right: 0
  },

  content: {
    display: 'flex',
    marginRight: '2vw',
    flex: .7,
    flexDirection: 'column',
    alignItems: 'flex-start',
  },

  title: {
    marginBottom: "1em"
  },

});

/* 
TODO: Add a detail tab that expands upon hover ( separate from the original card)

*/
export default function MediaCard({ title, description, url, i, image, theme, date ,author }) {
  const classes = useStyles();
  const [current_true, setTrue] = useState(0)
  const [current_false, setFalse] = useState(0)

  let num_votes = current_true + current_false
  let true_rate = parseFloat((current_true / (num_votes)) * 100).toFixed(2)

  const showmore = useCallback((index) => {
    var element = document.getElementsByClassName(index);
    element[0].classList.remove("notdisplayed");
    element[0].classList.add("displayed");
  }, []);

  const showless = useCallback((index) => {
    var element = document.getElementsByClassName(index);
    element[0].classList.remove("displayed");
    element[0].classList.add("notdisplayed");
  }, []);

  //handler for user voting on articles
  const uservote = useCallback((votetype, url, i) => {
    axios
      .post('/api/news/uservote', {
        headers: { Accept: 'application/json' },
        params: {
          url: url,
          type: votetype
        }
      })
      .then(res => {
        /*
            res = {
                user_true: 123,
                user_false: 123
            }
        */
       showless("details_question" + i)

        console.log(res.data.votes)
        setTrue(res.data.votes.user_true)
        setFalse(res.data.votes.user_false)
        showmore("stats" + i)

      })
  }, []);

  const urlcleanse = /^(?!.*(https))\w+/g;
  let cleansed_author = ""
  /* 
  
  Use effect hook to fetch image using an 
  
  */
  


  return (
    <div>
      <a onClick={() => showmore('attached' + i)} href={url} target="_blank">
        <ThemeProvider theme={theme}>
          <Card elevation={0} className={classes.root}>


            <div className={classes.content}>
              <div className={classes.title}>
                <h3 className='article_title'>  {title} </h3>
                <h5>{author}</h5>

                <h6>{date}</h6>

              </div>


              <p style={{marginBottom:"50px"}}>
                {description}
              </p>

              
            </div>



            <CardMedia
              className={classes.media}
              image={image}
              title="Contemplative Reptile"
            />

          </Card>
        </ThemeProvider>
      </a>

      <div className={'attached' + i + ' notdisplayed'}>
        <div className='details'>
          <h3 className={"details_question" + i +" displayed"}>Do you think this article is <button className='details_buttons' onClick={() => uservote("user_true", url, i)}>True News</button> or <button className='details_buttons' onClick={() => uservote("user_false", url, i)}>Fake News</button> ?</h3>

          <div className={'stats' + i + ' notdisplayed'}>
              <h2 className='details_people'>With {num_votes} votes , {true_rate}% of the people believe this article is true</h2>
              <h3 className='details_machine'></h3>
          </div>

          {/* Do not know if we need these anymore
            <h4 onMouseOver={() => this.showmore("source" + i)} >Hover to see source</h4>
            <h4 className={`source` + i + ' notdisplayed'}>{e.articles.source.name}</h4>  
          */}
        </div>
        <button onClick={() => showless("attached" + i)}>Hide</button>

      </div>
    </div>
  );
}
