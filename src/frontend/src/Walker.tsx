import React, { Component, useId } from "react";
import ReactDOM from "react-dom";
// import classNames from "classnames";

class Walker extends Component {
    constructor(props: props) {
        super(props);
        
        this.state = {
            structure: null
        }
    }
    
    _handleSubmit(event) {
        // Prevent the browser from reloading the page
        event.preventDefault();
        
        // Read the form data
        const form = event.target;
        const formData = new FormData(form);

        // You can pass formData as a fetch body directly:
        // fetch('/some-api', { method: form.method, body: formData });
        
        let structure = {artists: {}}
        
        for (const [key, value] of formData.entries()) {
            let separated = value.webkitRelativePath.split('/');
            
            // todo: handle directory listings that don't follow the expected structure
            if (separated.length > 4) {
                console.log(separated);
            }
            
            let artist = separated[1];
            let album = separated[2];
            let song = separated[3];
            console.log(song);
            
            if (!structure.artists.hasOwnProperty(artist)) {
                structure.artists[artist] = [];
            }
            if (!structure.artists[artist].hasOwnProperty(album)) {
                structure.artists[artist][album] = [];
            }
            structure.artists[artist][album].push(song);
            
        }
            console.log(structure);
    }
    
    render() {
        return (
            <>
            <form method="POST" onSubmit={this._handleSubmit}>
            <label htmlFor="getDirectories">Get Directories</label>
            <input type="file" name="getDirectories" webkitdirectory="" directory="" />
            <button type="submit">Submit</button>
            </form>
            </>
        );
    }
}

export default Walker;