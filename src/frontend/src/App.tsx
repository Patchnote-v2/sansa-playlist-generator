import React, { Component, useState, setState } from "react";
import ReactDOM from "react-dom";
import classNames from "classnames";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import Walker from "./Walker.tsx";

const playlist = {
    user: 1,
    rows: [
        {
            item: {
                id: "f51faaaf-f022-4fff-968d-5cba221cb1f1",
                name: "Quartz",
                type: "ALBUM",
                artists_as_string: "Blue Stahli"
            },
            amount: 1
        },
        {
            item: {
                id: "911d0ef2-30a4-4c21-8022-b4f9e245dd50",
                name: "Blue Stahli",
                type: "ARTIST",
                artists_as_string: ""
            },
            amount: 2
        },
        {
            item: {
                id: "3b8df3a3-054b-4f01-9e7c-5251bd24e57d",
                name: "Copper",
                type: "ALBUM",
                artists_as_string: "Blue Stahli, Artist A"
            },
            amount: 3
        }
    ]
};


function App(props) {
    const grid = 8;
    
    const [playlistRows, setPlaylistRows] = useState([...playlist.rows]);
    const [removed, setRemoved] = useState([]);
    const [userID, setUserID] = useState(playlist.user);
    
    const _reorder = (list, startIndex, endIndex) => {
        const result = Array.from(list);
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);
        
        return result;
    }
    
    
    const _getItemClasses = (isDragging, draggableStyle) => {
        return classNames({
            "list-item": true,
            "list-item-active": isDragging,
            "list-group-item": true,
            "d-flex": true,
            "justify-content-between": true,
            "align-items-center": true
        })
    }
    
    
    const _getListClasses = (isDraggingOver) => {
        return classNames({
            "list-background": true,
            "list-background-active": isDraggingOver,
            "list-group": true
        })
    }
    
    
    const _onDragEnd = (result) => {
        if (!result.destination) {
            return;
        }
        
        const items = this._reorder(
            this.state.playlistRows,
            result.source.index,
            result.destination.index
        );
        
        setState({
            playlistRows: items
        });
    }
    
    
    const _removeRow = (event, index) => {
        const rows = Array.from(this.state.playlistRows);
        const [removed] = rows.splice(index, 1);
        
        let stack = [...this.state.removed];
        stack.push({index: index, data: removed});
        
        setState({
            playlistRows: rows,
            removed: stack
        });
    }
    
    const _undoRemove = (event) => {
        if (this.state.removed.length > 0) {
            const result = Array.from(this.state.playlistRows);
            let removed = this.state.removed;
            let previous = removed.pop().data;
            result.splice(removed.index, 0, previous);
            
            setState({
                playlistRows: result,
                removed: removed,
            })
        }
    }
    
    const renderRows = () => {
        return (
            <>
            <button onClick={_undoRemove.bind(this)}>Undo Remove</button>
            <DragDropContext onDragEnd={_onDragEnd}>
                <Droppable droppableId="droppable">
                    {(provided, snapshot) => (
                        <ul
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            className={_getListClasses(snapshot.isDraggingOver)}
                        >
                        {Object.entries(playlistRows).map(([key, value]) => {
                            console.log(key);
                            console.log(value);
                            return ( <>
                            
                            <Draggable key={value.item.id} draggableId={value.item.id} index={key}>
                            {(provided, snapshot) => (
                                <li ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                        className={_getItemClasses(snapshot.isDragging, provided.draggableProps.style)}
                                >
                                    <button key={value.item.id} onClick={(e) => _removeRow(e, key)}>X</button>
                                    <span className="flex-even pe-none">{value.item.type}</span>
                                    <span className="flex-even pe-none">{value.item.name}</span>
                                    <span className="flex-even pe-none">{value.item.artists_as_string}</span>
                                    <input type="number" defaultValue={value.amount} className="flex-even"/>
                                </li>
                            )}
                            </Draggable>
                        </>)})}
                        {provided.placeholder}
                        </ul>
                     )}
                </Droppable>
            </DragDropContext>
            </>
        );
    };
    
    
    return (
            <main>
                <Walker />
                {renderRows()}
            </main>
        );
}

export default App;