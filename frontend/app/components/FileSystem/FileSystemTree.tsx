'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';
import { getMetaData, processBankStatementTesseract } from '@/app/utils/files';
import FileSystemTreeMenu from './FileSystemTreeMenu';
import FileUploadMenu from './FileUploadMenu';
import FolderCreationMenu from './FolderCreationMenu';
import { useRouter } from 'next/navigation';
import { useBankStatement } from '../../main/dashboard/layout'
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

/**
 * Maps S3 API response to TreeItems.
 */
function mapS3ResponseToTreeItems(response: ListDirectoryResponse, currPath: string): TreeViewBaseItem[] {
  const items: TreeViewBaseItem[] = [];

  // Map folders
  if (Array.isArray(response.folders)) {
    response.folders.forEach((folder) => {
      const folderName = folder.replace(/\/$/, ''); // Remove trailing '/'
      items.push({
        id: currPath + folder,
        label: folderName,
        hasChildren: true,
        children: [], // Initially empty
      });
    });
  }

  // Map files
  if (Array.isArray(response.files)) {
    response.files.forEach((file) => {
      if (currPath == file.key) {
        return
      }
      const fileName = file.key.split('/').pop() || file.key; // Extract file name
      items.push({
        id: file.key,
        label: fileName,
        hasChildren: false,
        children: [],
      });
    });
  }

  return items;
}

/**
 * Recursively renders TreeItems.
 */
function renderTree(node: TreeViewBaseItem, handleNodeClick: (nodeId: string, currNode: HTMLElement) => void, handleRightClick: (event: React.MouseEvent,
  type: 'file' | 'folder' | 'empty',
  node?: TreeViewBaseItem) => void, handleCloseContextMenu: () => void): React.ReactNode {


  return (
    <TreeItem
      key={node.id}
      itemId={node.id}
      data-itemid={node.id}
      label={node.label}
      onClick={async (event) => {
        await handleNodeClick(node.id, event.currentTarget as HTMLElement);
      }} // Attach click handler
      onContextMenu={(event) => handleRightClick(event, node.hasChildren ? 'folder' : 'file', node)}
    >
      {node.children?.map((child) => renderTree(child, handleNodeClick, handleRightClick, handleCloseContextMenu))}
    </TreeItem>
  );
}
function findNodeById(items: TreeViewBaseItem[], nodeId: string): TreeViewBaseItem | null {
  for (const item of items) {
    if (item.id === nodeId) {
      return item; // Found the node
    }
    if (item.children) {
      const found = findNodeById(item.children, nodeId); // Recursively search in children
      if (found) {
        return found; // Return if found in children
      }
    }
  }
  return null; // Node not found
}

/**
 * Main FileSystemTree Component
 */
export default function FileSystemTree() {
  const [treeItems, setTreeItems] = React.useState<TreeViewBaseItem[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);
  const [uploadMenuOpen, setUploadMenuOpen] = React.useState<boolean>(false);
  const [createFolderMenuOpen, setCreateFolderMenuOpen] = React.useState<boolean>(false);
  const [currentSelectedFilePath, setCurrentSelectedFilePath] = React.useState<string>('/user1');
  const [contextMenu, setContextMenu] = React.useState<{
    mouseX: number;
    mouseY: number;
    targetType: 'file' | 'folder' | 'empty';
    targetId?: string;
  } | null>(null);

  const [expanded, setExpanded] = React.useState<string[]>([]); // Use array directly
  const router = useRouter();
  const { setBankStatementText } = useBankStatement();
  // Fetch initial data
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getMetaData('iarpus-bankstatement', 'user1/');
        const mappedItems = mapS3ResponseToTreeItems(data, 'user1/');
        setTreeItems(mappedItems);
      } catch (err: any) {
        console.error('Error fetching metadata:', err);
        setError('Failed to load initial directory.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  // Handle node clicks
  function updateTreeItems(
    items: TreeViewBaseItem[],
    nodeId: string,
    newChildren: TreeViewBaseItem[]
  ): TreeViewBaseItem[] {
    return items.map((item) => {
      if (item.id === nodeId) {
        // Update the matching node
        return { ...item, children: newChildren };
      } else if (item.children) {
        // Recursively update children
        return { ...item, children: updateTreeItems(item.children, nodeId, newChildren) };
      }
      return item; // Return unchanged for non-matching nodes
    });
  }

  const handleNodeClick = async (nodeId: string) => {
    const node = findNodeById(treeItems, nodeId);
    handleToggle(node)
    if (node && node.hasChildren && node.children?.length === 0) {
      try {
        const data = await getMetaData('iarpus-bankstatement', nodeId);
        const newChildren = mapS3ResponseToTreeItems(data, nodeId);
        setTreeItems((prevItems) => updateTreeItems(prevItems, nodeId, newChildren));
      } catch (err: any) {
        console.error('Error fetching subdirectory:', err);
        setError(`Failed to load contents for ${nodeId}.`);
      }
    }
    else if (node && !node.hasChildren) {
      const bankStatementText = await processBankStatementTesseract('iarpus-bankstatement', node.id)
      setBankStatementText(bankStatementText)
      router.push('/main/dashboard/analysis/summary');
    }

  };
  const handleRightClick = (
    event: React.MouseEvent,
    type: 'file' | 'folder' | 'empty',
    node: TreeViewBaseItem
  ) => {
    event.preventDefault();
    event.stopPropagation();
    setCurrentSelectedFilePath(node.id)
    setContextMenu({
      mouseX: event.clientX,
      mouseY: event.clientY,
      targetType: type,
      targetId: node?.id,
    });
  };
  const handleToggle = (currNode: TreeViewBaseItem,) => {
    if (currNode.children) {
      setExpanded((prevExpanded) => {
        if (prevExpanded.includes(currNode.id)) {
          // If the node is already expanded, remove it
          return prevExpanded.filter((id) => id !== currNode.id);
        } else {
          // Otherwise, add it to the list of expanded nodes
          return [...prevExpanded, currNode.id];
        }
      });
    }
  };
  const handleCloseContextMenu = () => {
    setContextMenu(null);
  };
  if (loading) return <div>Loading file system...</div>;
  if (error) return <div>Error: {error}</div>;
  return (
    <Box sx={{ minHeight: 352, minWidth: 250 }}>
      {/* Conditionally render menus */}
      {createFolderMenuOpen && (
        <FolderCreationMenu
          open={createFolderMenuOpen}
          setOpen={setCreateFolderMenuOpen}
        />
      )}
      {uploadMenuOpen && (
        <FileUploadMenu
          currentPath={currentSelectedFilePath}
          open={uploadMenuOpen}
          setOpen={setUploadMenuOpen}
        />
      )}
      {contextMenu && (
        <FileSystemTreeMenu
          setUploadMenuOpen={setUploadMenuOpen}
          setCreateFolderMenuOpen={setCreateFolderMenuOpen}
          contextMenu={contextMenu}
          handleCloseContextMenu={handleCloseContextMenu}
        />
      )}
      <SimpleTreeView expandedItems={expanded}>
        {treeItems.map((node) =>
          renderTree(node, handleNodeClick, handleRightClick, handleCloseContextMenu)
        )}
      </SimpleTreeView>
    </Box>
  );

}
