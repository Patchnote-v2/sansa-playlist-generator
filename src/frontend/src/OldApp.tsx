import React, { useState, useCallback, useEffect } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { FaFolder, FaFile, FaInfoCircle } from 'react-icons/fa';

// Define the FileSystemEntry interface
interface FileSystemEntry {
  name: string;
  isDirectory: boolean;
  children?: FileSystemEntry[];
}

interface TreeItem {
  id: string;
  text: string;
  isDirectory: boolean;
  children?: TreeItem[];
}

interface DraggableItemProps {
  item: TreeItem;
  index: number;
  parentPath: number[];
  moveItem: (dragIndex: number, hoverIndex: number, parentPath: number[]) => void;
  isVibrant: boolean;
  onSelect: (item: TreeItem, parentAlbum?: string, grandparentArtist?: string) => void;
  parentAlbum?: string;
  grandparentArtist?: string;
}

interface Metadata {
  name: string;
  artist: string;
  album: string;
  track: string;
  albumArtwork?: string;
  listeners?: string;
  playcount?: string;
  tags?: string[];
}

const API_KEY = '454ffa952c911a78f525670da7d47800';

const fetchMetadata = async (item: TreeItem, parentAlbum?: string, grandparentArtist?: string): Promise<Metadata | null> => {
  try {
    const artist = grandparentArtist || (item.isDirectory ? item.text : parentAlbum);
    const album = item.isDirectory ? item.text : parentAlbum;
    const track = item.isDirectory ? '' : item.text;

    let apiMethod = 'track.getInfo';
    let params = `artist=${encodeURIComponent(artist)}&track=${encodeURIComponent(track)}`;

    if (item.isDirectory && !parentAlbum) {
      // This is an artist folder
      apiMethod = 'artist.getInfo';
      params = `artist=${encodeURIComponent(artist)}`;
    } else if (item.isDirectory && parentAlbum) {
      // This is an album folder
      apiMethod = 'album.getInfo';
      params = `artist=${encodeURIComponent(artist)}&album=${encodeURIComponent(album)}`;
    }

    const response = await fetch(`https://ws.audioscrobbler.com/2.0/?method=${apiMethod}&${params}&api_key=${API_KEY}&format=json`);
    const data = await response.json();

    if (apiMethod === 'artist.getInfo' && data.artist) {
      return {
        name: data.artist.name,
        artist: data.artist.name,
        album: '',
        track: '',
        listeners: data.artist.stats.listeners,
        playcount: data.artist.stats.playcount,
        tags: data.artist.tags.tag.map((t: any) => t.name).slice(0, 5),
      };
    } else if (apiMethod === 'album.getInfo' && data.album) {
      return {
        name: data.album.name,
        artist: data.album.artist,
        album: data.album.name,
        track: '',
        albumArtwork: data.album.image[3]['#text'],
        listeners: data.album.listeners,
        playcount: data.album.playcount,
        tags: data.album.tags.tag.map((t: any) => t.name).slice(0, 5),
      };
    } else if (apiMethod === 'track.getInfo' && data.track) {
      return {
        name: data.track.name,
        artist: data.track.artist.name,
        album: data.track.album?.title || '',
        track: data.track.name,
        albumArtwork: data.track.album?.image[3]['#text'],
        listeners: data.track.listeners,
        playcount: data.track.playcount,
        tags: data.track.toptags?.tag.map((t: any) => t.name).slice(0, 5),
      };
    }
    return null;
  } catch (error) {
    console.error('Error fetching metadata:', error);
    return null;
  }
};

const DraggableItem: React.FC<DraggableItemProps> = ({ item, index, parentPath, moveItem, isVibrant, onSelect, parentAlbum, grandparentArtist }) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'ITEM',
    item: () => ({ id: item.id, index, parentPath }),
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [{ isOver }, drop] = useDrop({
    accept: 'ITEM',
    hover: (draggedItem: { id: string; index: number; parentPath: number[] }, monitor) => {
      if (!monitor.isOver({ shallow: true })) return;
      const draggedParentPath = draggedItem.parentPath.join(',');
      const hoverParentPath = parentPath.join(',');
      if (draggedParentPath !== hoverParentPath) return;
      if (draggedItem.index === index) return;
      moveItem(draggedItem.index, index, parentPath);
      draggedItem.index = index;
    },
    collect: (monitor) => ({
      isOver: monitor.isOver({ shallow: true }),
    }),
  });

  const itemStyle: React.CSSProperties = {
    cursor: 'move',
    padding: '5px',
    margin: '2px 0',
    backgroundColor: isVibrant
      ? (isDragging ? '#FF1493' : isOver ? '#00FFFF' : item.isDirectory ? '#FFD700' : '#7FFF00')
      : (isDragging ? '#4A4A4A' : isOver ? '#2C2C2C' : item.isDirectory ? '#3A3A3A' : '#2A2A2A'),
    color: isVibrant ? '#000' : '#FFF',
    borderRadius: '4px',
    transition: 'background-color 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    fontSize: item.isDirectory ? '1.1em' : '0.9em',
    fontWeight: item.isDirectory ? 'bold' : 'normal',
  };

  const iconStyle: React.CSSProperties = {
    marginRight: '5px',
    fontSize: '1.2em',
  };

  const handleClick = () => {
    onSelect(item, parentAlbum, grandparentArtist);
  };

  return (
    <li ref={(node) => drag(drop(node))} style={itemStyle} className="draggable-item" onClick={handleClick}>
      <span style={iconStyle}>
        {item.isDirectory ? <FaFolder color={isVibrant ? '#8B4513' : '#FFD700'} /> : <FaFile color={isVibrant ? '#4169E1' : '#7FFF00'} />}
      </span>
      <span>{item.text}</span>
      {item.children && item.children.length > 0 && (
        <ul style={{ listStyleType: 'none', paddingLeft: '15px', marginTop: '2px' }}>
          {item.children.map((child, childIndex) => (
            child && (
              <DraggableItem
                key={child.id}
                item={child}
                index={childIndex}
                parentPath={[...parentPath, index]}
                moveItem={moveItem}
                isVibrant={isVibrant}
                onSelect={onSelect}
                parentAlbum={item.isDirectory ? parentAlbum : child.text}
                grandparentArtist={item.isDirectory && !parentAlbum ? item.text : grandparentArtist}
              />
            )
          ))}
        </ul>
      )}
      <span style={{ marginLeft: 'auto', cursor: 'pointer' }}>
        <FaInfoCircle />
      </span>
    </li>
  );
};

const MetadataDisplay: React.FC<{ metadata: Metadata | null }> = ({ metadata }) => {
  if (!metadata) return null;

  return (
    <div style={{ marginTop: '20px', padding: '10px', backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: '4px' }}>
      <h3>Metadata</h3>
      {metadata.albumArtwork && (
        <img src={metadata.albumArtwork} alt="Album Artwork" style={{ maxWidth: '100%', marginBottom: '10px' }} />
      )}
      <p><strong>Name:</strong> {metadata.name}</p>
      {metadata.artist && <p><strong>Artist:</strong> {metadata.artist}</p>}
      {metadata.album && <p><strong>Album:</strong> {metadata.album}</p>}
      {metadata.listeners && <p><strong>Listeners:</strong> {metadata.listeners}</p>}
      {metadata.playcount && <p><strong>Play Count:</strong> {metadata.playcount}</p>}
      {metadata.tags && metadata.tags.length > 0 && (
        <p><strong>Tags:</strong> {metadata.tags.join(', ')}</p>
      )}
    </div>
  );
};

const FolderStructureList: React.FC<{ root: FileSystemEntry }> = ({ root }) => {
  const [items, setItems] = useState<TreeItem[]>([]);
  const [history, setHistory] = useState<TreeItem[][]>([]);
  const [isVibrant, setIsVibrant] = useState(true);
  const [selectedItem, setSelectedItem] = useState<TreeItem | null>(null);
  const [metadata, setMetadata] = useState<Metadata | null>(null);

  React.useEffect(() => {
    const convertToTreeItems = (entry: FileSystemEntry, path: string = ''): TreeItem => {
      const currentPath = path ? `${path}/${entry.name}` : entry.name;
      return {
        id: currentPath,
        text: entry.name,
        isDirectory: entry.isDirectory,
        children: entry.children?.map(child => convertToTreeItems(child, currentPath))
      };
    };

    setItems([convertToTreeItems(root)]);
  }, [root]);

  const moveItem = useCallback((dragIndex: number, hoverIndex: number, parentPath: number[] = []) => {
    setItems((prevItems) => {
      const newItems = JSON.parse(JSON.stringify(prevItems));
      setHistory(prev => [...prev, prevItems]);
      let parent = newItems;
      for (const index of parentPath) {
        parent = parent[index].children;
      }
      const [reorderedItem] = parent.splice(dragIndex, 1);
      parent.splice(hoverIndex, 0, reorderedItem);
      return newItems;
    });
  }, []);

  const undoMove = useCallback(() => {
    if (history.length > 0) {
      const prevState = history[history.length - 1];
      setItems(prevState);
      setHistory(prev => prev.slice(0, -1));
    }
  }, [history]);

  const toggleColorMode = () => setIsVibrant(prev => !prev);

  const handleSelect = useCallback(async (item: TreeItem, parentAlbum?: string, grandparentArtist?: string) => {
    setSelectedItem(item);
    const fetchedMetadata = await fetchMetadata(item, parentAlbum, grandparentArtist);
    setMetadata(fetchedMetadata);
  }, []);

  const renderItems = (items: TreeItem[], currentPath: number[] = [], parentAlbum?: string, grandparentArtist?: string) => {
    return items.map((item, index) => (
      <React.Fragment key={item.id}>
        <DraggableItem
          item={item}
          index={index}
          parentPath={currentPath}
          moveItem={moveItem}
          isVibrant={isVibrant}
          onSelect={handleSelect}
          parentAlbum={item.isDirectory ? parentAlbum : item.text}
          grandparentArtist={item.isDirectory && !parentAlbum ? item.text : grandparentArtist}
        />
        {item.children && item.children.length > 0 && (
          <ul style={{ listStyleType: 'none', paddingLeft: '20px' }}>
            {renderItems(item.children, [...currentPath, index], item.isDirectory ? item.text : parentAlbum, grandparentArtist || (item.isDirectory && !parentAlbum ? item.text : undefined))}
          </ul>
        )}
      </React.Fragment>
    ));
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div style={{ 
        backgroundColor: isVibrant ? '#FFFFFF' : '#1A1A1A', 
        color: isVibrant ? '#000000' : '#FFFFFF',
        padding: '20px',
        minHeight: '100vh'
      }}>
        <pre style={{ fontFamily: 'monospace', fontSize: '12px', textAlign: 'center', marginBottom: '20px' }}>
{`
 _____ _ _     _____ _                 _             
|  ___(_) |   |  ___| |               | |            
| |__  _| | __| |__ | | __ _ ___  __ _| |_ ___  _ __ 
|  __|| | |/ /|  __|| |/ _\` / __|/ _\` | __/ _ \\| '__|
| |   | |   < | |___| | (_| \\__ \\ (_| | || (_) | |   
\\_|   |_|_|\\_\\\\____/|_|\\__,_|___/\\__,_|\\__\\___/|_|   
`}
        </pre>
        <div style={{ marginBottom: '10px' }}>
          <button onClick={undoMove} style={{ marginRight: '10px' }}>Undo</button>
          <button onClick={toggleColorMode}>{isVibrant ? 'Dark Mode' : 'Vibrant Mode'}</button>
        </div>
        <style>
          {`
            @keyframes pulse {
              0% { transform: scale(1); }
              100% { transform: scale(1.05); }
            }
            .draggable-item {
              transition: all 0.3s ease;
            }
            .draggable-item:hover {
              transform: translateY(-2px);
              box-shadow: 0 4px 8px rgba(0,0,0,0.2);
            }
          `}
        </style>
        <div style={{ display: 'flex' }}>
          <div style={{ flex: 3 }}>
            <ul style={{ listStyleType: 'none', padding: 0, margin: 0 }}>
              {renderItems(items)}
            </ul>
          </div>
          <div style={{ flex: 1, marginLeft: '20px' }}>
            {selectedItem && (
              <div>
                <h3>Selected Item</h3>
                <p>{selectedItem.text}</p>
              </div>
            )}
            <MetadataDisplay metadata={metadata} />
          </div>
        </div>
      </div>
    </DndProvider>
  );
};

const App: React.FC = () => {
  const [selectedFolder, setSelectedFolder] = useState<FileSystemEntry | null>(null);

  const handleFolderSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const folderStructure = await buildFolderStructure(files);
      setSelectedFolder(folderStructure);
    }
  };

  const buildFolderStructure = async (fileList: FileList): Promise<FileSystemEntry> => {
    const root: FileSystemEntry = { name: fileList[0].webkitRelativePath.split('/')[0], isDirectory: true, children: [] };

    for (let i = 0; i < fileList.length; i++) {
      const path = fileList[i].webkitRelativePath.split('/');
      let currentLevel = root;

      for (let j = 1; j < path.length; j++) {
        const name = path[j];
        let existingEntry = currentLevel.children?.find(child => child.name === name);

        if (!existingEntry) {
          const newEntry: FileSystemEntry = {
            name,
            isDirectory: j < path.length - 1,
            children: j < path.length - 1 ? [] : undefined
          };
          currentLevel.children?.push(newEntry);
          existingEntry = newEntry;
        }

        currentLevel = existingEntry;
      }
    }

    return root;
  };

  const handleSubmit = () => {
    if (selectedFolder) {
      console.log('Folder structure:');
      printFolderStructure(selectedFolder, 0);
    } else {
      console.log('No folder selected');
    }
  };

  const printFolderStructure = (entry: FileSystemEntry, depth: number) => {
    const indent = '  '.repeat(depth);
    console.log(`${indent}${entry.isDirectory ? '📁' : '📄'} ${entry.name}`);
    if (entry.children) {
      entry.children.forEach(child => printFolderStructure(child, depth + 1));
    }
  };

  return (
    <div>
      <input
        type="file"
        // @ts-ignore
        webkitdirectory=""
        // @ts-ignore
        directory=""
        onChange={handleFolderSelect}
      />
      <button onClick={handleSubmit}>Submit</button>
      {selectedFolder && <FolderStructureList root={selectedFolder} />}
    </div>
  );
};

export default App
