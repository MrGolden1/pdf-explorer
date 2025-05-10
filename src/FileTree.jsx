import React, { useState } from 'react';
import { List, ListItemButton, ListItemText, Collapse, Box, Badge } from '@mui/material';
import FolderIcon from '@mui/icons-material/Folder';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';

// Helper to build a tree from files
function buildFileTree(files) {
  const root = {};
  files.forEach((file) => {
    const path = file.webkitRelativePath || file.name;
    const parts = path.split('/');
    let node = root;
    parts.forEach((part, idx) => {
      if (idx === parts.length - 1) {
        if (!node.files) node.files = [];
        node.files.push({ name: part, file });
      } else {
        if (!node.folders) node.folders = {};
        if (!node.folders[part]) node.folders[part] = {};
        node = node.folders[part];
      }
    });
  });
  return root;
}


// Helper to count PDFs in a tree (used for badge)
function countPdfsInTree(tree) {
  let count = 0;
  if (tree.files) count += tree.files.length;
  if (tree.folders) {
    for (const sub of Object.values(tree.folders)) {
      count += countPdfsInTree(sub);
    }
  }
  return count;
}

// Recursive tree view
function FileTree({ tree, onFileClick, level = 0 }) {
  const [openFolders, setOpenFolders] = useState({});
  if (!tree) return null;
  return (
    <List disablePadding sx={{ pl: level * 2 }}>
      {tree.folders &&
        Object.entries(tree.folders)
          .map(([folder, subtree]) => ({
            folder,
            subtree,
            pdfCount: countPdfsInTree(subtree),
          }))
          .sort((a, b) => b.pdfCount - a.pdfCount)
          .map(({ folder, subtree, pdfCount }) => {
            const isOpen = openFolders[folder] || false;
            return (
              <Box key={folder}>
                <ListItemButton
                  onClick={() => setOpenFolders((prev) => ({ ...prev, [folder]: !isOpen }))}
                  sx={{ pl: 2, py: 0.5 }}
                >
                  {isOpen ? <FolderOpenIcon fontSize="small" sx={{ mr: 1 }} /> : <FolderIcon fontSize="small" sx={{ mr: 1 }} />}
                  <ListItemText primary={folder} sx={{ flex: 1 }} />
                  <Badge color="primary" badgeContent={pdfCount} sx={{ mr: 1 }} size="small" />
                  {isOpen ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
                <Collapse in={isOpen} timeout="auto" unmountOnExit>
                  <FileTree tree={subtree} onFileClick={onFileClick} level={level + 1} />
                </Collapse>
              </Box>
            );
          })}
      {tree.files &&
        tree.files.map(({ name, file }) => (
          <ListItemButton key={name} onClick={() => onFileClick(file)} sx={{ pl: 4, py: 0.5 }}>
            <PictureAsPdfIcon fontSize="small" sx={{ mr: 1 }} />
            <ListItemText primary={name} primaryTypographyProps={{ noWrap: true }} />
          </ListItemButton>
        ))}
    </List>
  );
}

export { buildFileTree, FileTree };
