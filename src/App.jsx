import React, { useState, useRef } from 'react';
import { Box, Tabs, Tab, Divider, Drawer, IconButton, TextField } from '@mui/material';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import CloseIcon from '@mui/icons-material/Close';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';

import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';

import './tab-animations.css';
import { buildFileTree, FileTree } from './FileTree';


function a11yProps(index) {
  return {
    id: `tab-${index}`,
    'aria-controls': `tabpanel-${index}`,
  };
}

const TabPanel = ({ children, value, index }) => (
  <div
    role="tabpanel"
    hidden={value !== index}
    id={`tabpanel-${index}`}
    style={{ height: '100%', width: '100%' }}
  >
    {value === index && <Box sx={{ p: 0, height: '100%' }}>{children}</Box>}
  </div>
);

export default function App() {
  const defaultLayoutPluginInstance = defaultLayoutPlugin();
  const tabsRef = useRef(null);
  const handleTabsScroll = (e) => {
    e.preventDefault();
    const scroller = tabsRef.current?.querySelector('.MuiTabs-scroller');
    if (scroller) {
      scroller.scrollLeft += e.deltaY;
    }
  };
  const [files, setFiles] = useState([]);     // All PDFs found in the chosen folder
  const [tabs, setTabs] = useState([]);       // Opened { name, url }
  const [activeTab, setActiveTab] = useState(0);
  const [maxTabs, setMaxTabs] = useState(10); // user-defined max open tabs

  const handleDirectoryPick = (e) => {
    const list = Array.from(e.target.files).filter(
      (f) => f.type === 'application/pdf' || f.name.toLowerCase().endsWith('.pdf')
    );
    setFiles(list);
  };

  const openTab = (file) => {
    const existingIndex = tabs.findIndex((t) => t.name === file.name);
    if (existingIndex !== -1) {
      setActiveTab(existingIndex);
      return;
    }
    const url = URL.createObjectURL(file);
    setTabs((prev) => {
      // Remove oldest tab if exceeding maxTabs
      let newTabs = prev;
      if (prev.length >= maxTabs) {
        newTabs = prev.slice(1);
      }
      const updatedTabs = [...newTabs, { name: file.name, url }];
      setActiveTab(updatedTabs.length - 1);
      return updatedTabs;
    });
  };

  const closeTab = (index) => {
    setTabs((prev) => {
      const newTabs = prev.filter((_, i) => i !== index);
      if (activeTab >= newTabs.length) {
        setActiveTab(Math.max(0, newTabs.length - 1));
      }
      return newTabs;
    });
  };

  // Build the file tree for the sidebar
  const fileTree = buildFileTree(files);

  return (
    <Box sx={{ display: 'flex', height: '100vh', width: '100vw' }}>
      {/* Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          width: 340,
          flexShrink: 0,
          bgcolor: 'background.paper',
          boxShadow: 2,
          '& .MuiDrawer-paper': {
            width: 340,
            boxSizing: 'border-box',
            p: 0,
            bgcolor: 'background.paper',
            borderRight: '1px solid #e0e0e0',
          },
        }}
      >
        <Box sx={{ p: 2, pb: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box sx={{ fontWeight: 700, fontSize: 22, letterSpacing: 0.5, mb: 1, color: 'primary.main', display: 'flex', alignItems: 'center', gap: 1 }}>
            <span role="img" aria-label="PDF">📁</span> PDF Explorer
          </Box>
          <label htmlFor="folder-picker">
            <input
              id="folder-picker"
              type="file"
              multiple
              directory=""
              webkitdirectory=""
              onChange={handleDirectoryPick}
              style={{ display: 'none' }}
            />
            <Box
              component="span"
              sx={{
                display: 'inline-block',
                bgcolor: 'primary.main',
                color: 'primary.contrastText',
                px: 2.5,
                py: 1,
                borderRadius: 2,
                fontWeight: 500,
                fontSize: 16,
                cursor: 'pointer',
                boxShadow: 1,
                transition: 'background 0.2s',
                '&:hover': { bgcolor: 'primary.dark' },
              }}
            >
              Pick Folder…
            </Box>
          </label>
          <TextField
            label="Max Open Tabs"
            type="number"
            value={maxTabs}
            onChange={(e) => {
              const val = parseInt(e.target.value, 10);
              if (!isNaN(val) && val > 0) setMaxTabs(val);
            }}
            inputProps={{ min: 1 }}
            size="small"
            sx={{ mt: 1, maxWidth: 200 }}
          />
        </Box>
        <Divider />
        <Box sx={{ overflowY: 'auto', maxHeight: 'calc(100% - 110px)', p: 1, pt: 2 }}>
          <FileTree tree={fileTree} onFileClick={openTab} />
        </Box>
      </Drawer>

      {/* Main */}
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', bgcolor: '#f7f8fa' }}>
        {/* Tabs header */}
        <Box sx={{ display: 'flex', alignItems: 'center', borderBottom: '1px solid #e0e0e0', bgcolor: 'background.paper', px: 1, minHeight: 44, maxWidth: 'calc(100vw - 360px)', minWidth: 0 }}>
          {/* Tabs Scroll Wrapper */}
          <Box
            ref={tabsRef}
            onWheel={handleTabsScroll}
            sx={{ flex: 1, minWidth: 0, overflow: 'hidden', display: 'flex' }}
          >
            <TransitionGroup component={null} style={{ width: '100%' }}>
              <Tabs
                value={activeTab}
                onChange={(_, v) => setActiveTab(v)}
                variant="scrollable"
                scrollButtons="auto"
                sx={{
                  minHeight: 44,
                  bgcolor: 'background.paper',
                  borderBottom: 'none',
                  overflow: 'visible',
                  width: '100%',
                }}
                TabIndicatorProps={{ style: { height: 3, background: '#1976d2', borderRadius: 2 } }}
                component={Box}
              >
                {tabs.map((t, idx) => (
                  <CSSTransition
                    key={t.name}
                    timeout={250}
                    classNames="tab-fade"
                  >
                    <Tab
                      label={
                        <Box sx={{ display: 'flex', alignItems: 'center', minWidth: 0 }}>
                          <span style={{ maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'inline-block', fontWeight: 500 }}>{t.name}</span>
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              closeTab(idx);
                            }}
                            sx={{ ml: 0.5, color: 'text.secondary', '&:hover': { color: 'error.main', bgcolor: 'transparent' } }}
                          >
                            <CloseIcon fontSize="inherit" />
                          </IconButton>
                        </Box>
                      }
                      {...a11yProps(idx)}
                      sx={{
                        alignItems: 'start',
                        p: 0.5,
                        minWidth: 40,
                        maxWidth: 160,
                        borderRadius: 2,
                        mx: 0.5,
                        transition: 'background 0.2s',
                        '&.Mui-selected': {
                          bgcolor: '#e3f0fd',
                          color: 'primary.main',
                        },
                        '&:hover': {
                          bgcolor: '#f0f4f8',
                        },
                      }}
                    />
                  </CSSTransition>
                ))}
              </Tabs>
            </TransitionGroup>
          </Box>
          {/* Close All Button */}
          <IconButton
            aria-label="Close all tabs"
            onClick={() => {
              setTabs([]);
              setActiveTab(0);
            }}
            sx={{
              ml: 2,
              px: 2,
              py: 0.5,
              borderRadius: 2,
              bgcolor: '#f8d7da',
              color: '#b71c1c',
              border: '1px solid #f5c2c7',
              fontWeight: 600,
              fontSize: 15,
              display: 'flex',
              alignItems: 'center',
              boxShadow: 1,
              flexShrink: 0,
              transition: 'background 0.2s, color 0.2s',
              '&:hover': {
                bgcolor: '#f1b0b7',
                color: '#fff',
                borderColor: '#f1b0b7',
              },
              '&:disabled': {
                bgcolor: '#f5f5f5',
                color: '#bdbdbd',
                borderColor: '#e0e0e0',
              },
            }}
            disabled={tabs.length === 0}
          >
            <CloseIcon sx={{ fontSize: 18, mr: 1, color: 'inherit' }} />
            Close All
          </IconButton>
        </Box>

        {/* Viewer panels */}
        <Box sx={{ flexGrow: 1, minHeight: 0, p: 2, pt: 1 }}>
          {tabs.length === 0 && (
            <Box sx={{ color: 'text.secondary', fontSize: 20, textAlign: 'center', mt: 8 }}>
              Select a folder and click a PDF to view it here.
            </Box>
          )}
          {tabs.map((t, idx) => (
            <TabPanel key={idx} value={activeTab} index={idx}>
              <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
                <Viewer fileUrl={t.url} plugins={[defaultLayoutPluginInstance]} />
              </Worker>
            </TabPanel>
          ))}
        </Box>
      </Box>
    </Box>
  );
}
