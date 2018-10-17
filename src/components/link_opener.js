import React, { Component } from 'react'
import qs from 'query-string';
import { UncontrolledAlert } from 'reactstrap';

const notification = getFromLS("notification") || [];

class LinkOpener extends Component{

    constructor(props) {
        super(props);

        this.state = {
            term: '',
            error: false,
            notification: JSON.parse(JSON.stringify(notification))
        };

        this.onInputChange = this.onInputChange.bind(this);
        this.onFormSubmit = this.onFormSubmit.bind(this);
        this.addLinksToInput = this.addLinksToInput.bind(this);
    }

    onInputChange(event) {
        this.setState({ term: event.target.value });
    }

    onFormSubmit(event) {
        event.preventDefault();

        // open links
        this.openLinks(this.state.term);
        this.setState({ term: ''});

        //redirect to link search
        this.props.history.push("/open-multiple-links");
    }

    openLinks (links) {

        let links_array = links.split(',');

        for(var i = 0; i < links_array.length; i++) {
            // remove whitespaces
            let link = links_array[i].trim()
            let escaped = escapeRegExp(link)
            escaped = addHTTPS(escaped)
            if (validateLink(escaped)){
                window.open(escaped, i);
            }
        }
    }

    addLinksToInput(term) {
       this.setState({term})
    }

    componentDidMount() {
        let links = qs.parse(this.props.location.search, { ignoreQueryPrefix: true });

        let linkString = '';

        try {
            Object.keys(links).forEach(function(key,index) {

                const escaped = escapeRegExp(links[key])
                if (validateLink(escaped)){
                    linkString = linkString.concat(escaped,', ')
                }
            });

            // get rid of last comma and space
            linkString = linkString.slice(0, -2)

            this.addLinksToInput(linkString)
        }
        catch (e) {
            this.setState({error: true})
        }

        // set cookie
        saveToLS("notification", 'set');
    }

    render() {
        return (
            <div>
                <form onSubmit={this.onFormSubmit} className='input-group'>
                    <input
                        placeholder='www.youtube.com, www.gmail.com'
                        className='form-control'
                        value={this.state.term}
                        onChange={this.onInputChange} />
                    <span className='input-group-btn'>
                   <button type='submit' className='btn btn-secondary'>Submit</button>
               </span>
                </form>
                <br />
                {this.state.notification !== 'set' &&
                <UncontrolledAlert color="info">
                    If this is your first time here, you might have to enable pop-up windows for this site.
                </UncontrolledAlert>
                }
                {this.state.error &&
                <div className="alert alert-danger">
                    An error has occured! Please check your input!
                </div>
                }
            </div>
        );
    }
}

function validateLink(link) {
    const re = /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g;
    return re.test(link);
}

function escapeRegExp(string){

    try {
        return string.replace(/[<*+?^${}()|[\]\\]/g, '\\$&');
    }
    catch (e) {
        this.setState({error: true})
    }
}

function addHTTPS(link) {
    const re = /^(http|https):/i
    const https = 'https://'

    if (!re.test(link)) {
        // if no http:// or https://
        // then we add https
        return `${https}${link}`
    }
   return link
}

function getFromLS(key) {
    let ls = {};
    if (global.localStorage) {
        try {
            ls = JSON.parse(global.localStorage.getItem("open-multiple-links")) || {};
        } catch (e) {
            /*Ignore*/
        }
    }
    return ls[key];
}

function saveToLS(key, value) {
    if (global.localStorage) {
        global.localStorage.setItem(
            "open-multiple-links",
            JSON.stringify({
                [key]: value
            })
        );
    }
}

export default LinkOpener