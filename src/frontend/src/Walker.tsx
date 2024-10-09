import React, { Component, useId, useState } from "react";
import ReactDOM from "react-dom";
// import classNames from "classnames";

function Walker(props) {
    const [structure, setStructure] = useState([]);
    
    const _handleFiles = (event) => {
        event.target.files[0].text().then((data) => {
            console.log(JSON.parse(data));
        });
    }
    
    return (
            <>
            <label htmlFor="getStructure">Upload JSON File:</label>
            <input type="file" name="getStructure" accept=".json" onChange={_handleFiles} /><br />
            </>
        );
}

export default Walker;