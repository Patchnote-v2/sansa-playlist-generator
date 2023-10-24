import React, { Component } from "react";
import ReactDOM from "react-dom";
import classNames from "classnames";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

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

class App extends Component {
    constructor(props: props) {
        super(props);
        this.dragItem = React.createRef();
        this.dragOverItem = React.createRef();
        
        this.grid = 8;
        
        this.state = {
            viewCompleted: false,
            playlistRows: [...playlist.rows],
            removed: [],
            userID: playlist.user,
        }
        
        this._onDragEnd = this._onDragEnd.bind(this);
    }
    
    _reorder(list, startIndex, endIndex) {
        const result = Array.from(list);
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);
        
        return result;
    }
    
    _getItemClasses(isDragging, draggableStyle) {
        return classNames({
            "list-item": true,
            "list-item-active": isDragging,
            "list-group-item": true,
            "d-flex": true,
            "justify-content-between": true,
            "align-items-center": true
        })
    }
    
    _getListClasses(isDraggingOver) {
        return classNames({
            "list-background": true,
            "list-background-active": isDraggingOver,
            "list-group": true
        })
    }
    
    _onDragEnd(result) {
        if (!result.destination) {
            return;
        }
        
        const items = this._reorder(
            this.state.playlistRows,
            result.source.index,
            result.destination.index
        );
        
        this.setState({
            playlistRows: items
        });
    }
    
    _removeRow(event, index) {
        const rows = Array.from(this.state.playlistRows);
        const [removed] = rows.splice(index, 1);
        
        let stack = [...this.state.removed];
        stack.push({index: index, data: removed});
        
        this.setState({
            playlistRows: rows,
            removed: stack
        });
    }
    
    _undoRemove(event) {
        if (this.state.removed.length > 0) {
            const result = Array.from(this.state.playlistRows);
            let removed = this.state.removed;
            let previous = removed.pop().data;
            result.splice(removed.index, 0, previous);
            
            this.setState({
                playlistRows: result,
                removed: removed,
            })
        }
    }
    
    renderRows() {
        return (
            <>
            <button onClick={this._undoRemove.bind(this)}>Undo Remove</button>
            <DragDropContext onDragEnd={this._onDragEnd}>
                <Droppable droppableId="droppable">
                    {(provided, snapshot) => (
                        <ul
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            className={this._getListClasses(snapshot.isDraggingOver)}
                        >
                        
                        {this.state.playlistRows.map((each, index) => (
                            <Draggable key={each.item.id} draggableId={each.item.id} index={index}>
                            {(provided, snapshot) => (
                                <li ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                        className={this._getItemClasses(snapshot.isDragging, provided.draggableProps.style)}
                                >
                                    <button key={each.item.id} onClick={(e) => this._removeRow(e, index)}>X</button>
                                    <span className="flex-even pe-none">{each.item.type}</span>
                                    <span className="flex-even pe-none">{each.item.name}</span>
                                    <span className="flex-even pe-none">{each.item.artists_as_string}</span>
                                    <input type="number" defaultValue={each.amount} className="flex-even"/>
                                </li>
                            )}
                            </Draggable>
                        ))}
                        {provided.placeholder}
                        </ul>
                     )}
                </Droppable>
            </DragDropContext>
            </>
        );
    };
    
    render() {
        return (
            <main>
                {this.renderRows()}
            </main>
        );
    }
}

export default App;