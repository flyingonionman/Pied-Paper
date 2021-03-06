import React, { Component } from 'react'
/* material UI button*/

/* Importing components */
import Card from '../card/card'
import Pagination from '../card/pagination'

/* redux related stuff */
import { withRouter } from "react-router";
import { connect } from "react-redux";


/* Data fetching stuff */
import './content.css'
import axios from "axios";

/* Sorting and Searching */
import TimeMenu from "../searchfilters/timefilter"
import SortMenu from "../searchfilters/sortfilter"
import TitleSearch from "../searchfilters/titlesearch"

/* Import image */
import loadinggif from "../../files/808.gif"

/* Date parser */

function parseDate(date) {
    const MM = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

    const xx = date.replace(
        /(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):\d{2}.\d{3}Z/,
        function ($0, $1, $2, $3, $4, $5, $6) {
            return "Published: " + MM[$2 - 1] + " " + $3 + ", " + $1 + " / " + $4 % 12 + ":" + $5 + (+$4 > 12 ? " PM" : " AM") + "  UTC"
        })

    return xx
}


class Content extends Component {
    constructor(props) {
        super(props)
        this.child = React.createRef();

        this.state = {
            news: [],
            postsperpage: 20,
            currentpage: 1,
            isLoading: null
        }


    }

    componentDidMount() {
        this.setState({ isLoading: true })
        //GET request to express server for the NEWS API to return new articles
        axios
            .get(`/api/news/retrieve`, {
                headers: { Accept: 'application/json' },
                params: {
                    category: this.props.topic,
                    range: this.props.range,
                    sort: this.props.order,
                    title : this.props.search
                }
            })
            .then(res => {
                this.setState(
                    /*the news route returns an array of objects with keys	
                        res.data = [	
                            {	
                                articles: {"foo bar"},
                                truefalse: 0 or 1,
                                category: "general",
                                publish_date: ISO8601 format,
                                url: "http://foo.bar",
                                user_true: 12345,
                                user_false: 12345
                            }	
                            ... and so on	
                        ]	
                    */
                    {
                        news: [...res.data],
                        isLoading: false
                    },
                    () => console.log(this.state)
                )
            })
            .catch(err => console.log(err))
    }

    componentWillReceiveProps(nprops) {
        if (nprops.topic) {
            this.setState({
                isLoading: true,
                news:[]
            })
            //GET request to express server for the NEWS API to return new articles
            //FIXME: NO longer a POST request, but a GET request with query params
            axios
                .get(`/api/news/retrieve`, {
                    headers: { Accept: 'application/json' },
                    params: {
                        category: nprops.topic,
                        range: nprops.range,
                        sort: nprops.order,
                        title: nprops.search
                    }
                }
                )
                .then(res => {
                    this.setState(
                        {
                            news: [...res.data],
                            currentpage: 1,
                            isLoading:false
                        },
                        () => {

                            this.child.current.reset()
                            console.log(this.state);
                            window.scrollTo(0, 0);
                        }
                    )
                })
                .catch(err => console.log(err))
        }
    }

    render() {

        let cardlist = <ul></ul>
        let loadingscreen = <img src={loadinggif} alt="Loading..." style={{ marginTop: "10vh" }} width="200" height="30" />

        if (!this.state.isLoading) {
            loadingscreen = <></>

        }

        if (this.state.news) {
            let news = this.state.news;
            let indexLast = this.state.currentpage * this.state.postsperpage
            let indexFirst = indexLast - this.state.postsperpage
            news = news.slice(indexFirst, indexLast);
            cardlist =

                <ul>
                    {news.map((e, i) => (
                        <li className="cardlist" key={i} >
                            <Card
                                description={e.articles.description}
                                author={e.articles.author}
                                image={e.articles.urlToImage}
                                title={e.title}
                                roboFalse={e.truefalse}
                                url={e.url}
                                date={parseDate(e.publish_date)}
                                theme={this.props.theme}
                                i={i}
                            />
                        </li>
                    ))}
                </ul>
        }

        /* 
        TODO: Add a meta analysis factor: 
        Do users agree with the take of the ML? display the results
        
        TODO: Add a label at the top of cardlist : ALL news, TECHNOLOGY NEWS ... etc
        */
        return (
            <div className="content">
                <div className="left">

                    <div className='optionselector'>
                        <TimeMenu />
                        <SortMenu />
                        <TitleSearch/>
                    </div>
                    {loadingscreen}

                    {cardlist}
                    <Pagination
                        ref={this.child}
                        postsPerPage={this.state.postsperpage}
                        totalPosts={this.state.news.length}
                        paginate={(page) => { this.setState({ currentpage: page }) }}
                        scrollup={() => { window.scrollTo(0, 0); }}
                    />

                </div>


            </div>
        )
    }
}


const mapStateToProps = state => ({
    topic: state.topic.topic,
    order: state.topic.order,
    range: state.topic.range,
    search: state.topic.search
})

export default connect(
    mapStateToProps,
    {}
)(withRouter(Content));

