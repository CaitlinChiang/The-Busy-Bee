import React, { Component } from 'react'
import * as firebase from 'firebase'
import '../client_css/04-Articles.css'

class Articles extends Component {
    state = {
        articles: []
    }

    componentDidMount = _ => this.articles_fetch()

    // Fetch Data
    articles_fetch = _ => {
        firebase.database().ref('articles').once('value', snapshot => {
            snapshot.forEach((snap) => {
                var obj = {
                    link: snap.val().link,
                    photo: snap.val().photo,
                    title: snap.val().title,
                    written_by: snap.val().written_by
                }
                this.setState({ articles: this.state.articles.concat(obj) })
            })
        })
    }

    // Render Data
    articles_render = props => {
        return (
            <a href={props.link}>
                <button>
                    <img src={props.photo} width="100%" />
                    <div class="article">
                        <h2>{props.title}</h2>
                        <p>By: {props.written_by}</p>
                    </div>
                </button>
            </a>
        )
    }

    render() {
        const { articles } = this.state
        return (
            <div>
                <section id="articles">
    
                    <div id="articlesHeader"> <h1>Features</h1> </div>
    
                    <div id="displayArticles">
                        <div id="showArticles" class="fade-in">	
                            { articles.map(this.articles_render) }
                        </div>
                    </div>
    
                </section>
                
                <footer>&#169; Rolls.</footer>
            </div>
        )
    }
}

export default Articles