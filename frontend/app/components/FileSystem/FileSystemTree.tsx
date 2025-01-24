'use client';

import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';
import { getMetaData } from '@/app/utils/files';

interface S3Object {
  key: string;
  size: number;
  lastModified: string;
}

interface ListDirectoryResponse {
  directory: string;
  folders: string[];
  files: S3Object[];
}

interface TreeViewBaseItem {
  id: string;
  label: string;
  children?: TreeViewBaseItem[];
  hasChildren?: boolean;
}

function mapS3ResponseToTreeItems(response: ListDirectoryResponse): TreeViewBaseItem[] {
  const items: TreeViewBaseItem[] = [];
  if (Array.isArray(response.folders)) {
    response.folders.forEach((folder) => {
      const folderName = folder.replace(/\/$/, '');
      items.push({
        id: folder,
        label: folderName,
        hasChildren: true,
        children: [],
      });
    });
  }
  if (Array.isArray(response.files)) {
    response.files.forEach((file) => {
      const fileName = file.key.split('/').pop() || file.key;
      items.push({
        id: file.key,
        label: fileName,
        hasChildren: false,
      });
    });
  }
  return items;
}

function renderTree(node: TreeViewBaseItem, handleNodeClick: (nodeId: string) => void, handleRightClick: (event: React.MouseEvent, type: 'file' | 'folder', node: TreeViewBaseItem) => void): React.ReactNode {
  return (
    <TreeItem
      key={node.id}
      itemId={node.id}
      label={node.label}
      onClick={() => handleNodeClick(node.id)}
      onContextMenu={(event) => handleRightClick(event, node.hasChildren ? 'folder' : 'file', node)}
    >
      {node.children?.map((child) => renderTree(child, handleNodeClick, handleRightClick))}
    </TreeItem>
  );
}

export default function FileSystemTree() {
  const [treeItems, setTreeItems] = useState<TreeViewBaseItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [contextMenu, setContextMenu] = useState<{ mouseX: number; mouseY: number; targetType: 'file' | 'folder'; targetId?: string } | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getMetaData('iarpus-bankstatement', 'user1/');
        setTreeItems(mapS3ResponseToTreeItems(data));
      } catch (err: any) {
        console.error('Error fetching metadata:', err);
        setError('Failed to load initial directory.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleNodeClick = async (nodeId: string) => {
    const node = treeItems.find((item) => item.id === nodeId);
    if (node && node.hasChildren && node.children?.length === 0) {
      try {
        const data = await getMetaData('iarpus-bankstatement', `${nodeId}/`);
        const newChildren = mapS3ResponseToTreeItems(data);
        setTreeItems((prevItems) =>
          prevItems.map((item) =>
            item.id === nodeId ? { ...item, children: newChildren } : item
          )
        );
      } catch (err: any) {
        console.error('Error fetching subdirectory:', err);
        setError(`Failed to load contents for ${nodeId}.`);
      }
    }
  };

  const handleRightClick = (event: React.MouseEvent, type: 'file' | 'folder', node: TreeViewBaseItem) => {
    event.preventDefault();
    setContextMenu({
      mouseX: event.clientX,
      mouseY: event.clientY,
      targetType: type,
      targetId: node.id,
    });
  };

  const handleCloseContextMenu = () => {
    setContextMenu(null);
  };

  const handleDelete = () => {
    console.log(`Delete ${contextMenu?.targetId}`);
    handleCloseContextMenu();
  };

  const handleUpload = () => {
    console.log(`Upload new file to ${contextMenu?.targetId}`);
    handleCloseContextMenu();
  };

  if (loading) return <div>Loading file system...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <Box sx={{ minHeight: 352, minWidth: 250, position: 'relative' }}>
      <SimpleTreeView>
        {treeItems.map((node) => renderTree(node, handleNodeClick, handleRightClick))}
      </SimpleTreeView>

      <Menu
        open={contextMenu !== null}
        onClose={handleCloseContextMenu}
        anchorReference="anchorPosition"
        anchorPosition={
          contextMenu !== null
            ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
            : undefined
        }
      >
        {contextMenu?.targetType === 'file' && (
          <MenuItem onClick={handleDelete}>Delete</MenuItem>
        )}
        {contextMenu?.targetType === 'folder' && (
          <>
            <MenuItem onClick={handleUpload}>Upload File</MenuItem>
            <MenuItem onClick={handleDelete}>Delete</MenuItem>
          </>
        )}
      </Menu>
    </Box>
  );
}
