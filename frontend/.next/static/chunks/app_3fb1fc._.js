(globalThis.TURBOPACK = globalThis.TURBOPACK || []).push(["static/chunks/app_3fb1fc._.js", {

"[project]/app/utils/files.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, k: __turbopack_refresh__, m: module, z: __turbopack_require_stub__ } = __turbopack_context__;
{
__turbopack_esm__({
    "analyzeOpenAI": (()=>analyzeOpenAI),
    "createNewDirectory": (()=>createNewDirectory),
    "fetchBankStatementData": (()=>fetchBankStatementData),
    "getMetaData": (()=>getMetaData),
    "parseBankStatementText": (()=>parseBankStatementText),
    "processBankStatementTesseract": (()=>processBankStatementTesseract),
    "processBankStatementTextract": (()=>processBankStatementTextract),
    "produceSummaryOpenAI": (()=>produceSummaryOpenAI),
    "uploadFile": (()=>uploadFile)
});
async function uploadFile(bucketName, filePath, file) {
    console.log("Uploading file to s3");
    try {
        // Create a FormData object
        const formData = new FormData();
        formData.append("bucketName", bucketName);
        formData.append("filePath", filePath);
        formData.append("file", file);
        // Send a POST request to the Next.js API route
        const response = await fetch("/api/files/upload", {
            method: "POST",
            body: formData
        });
        if (!response.ok) {
            const error = await response.text();
            throw new Error(`Failed to upload file: ${error}`);
        }
        const data = await response.json();
        console.log(data.message);
        alert("File uploaded successfully!");
    } catch (error) {
        console.error("Error uploading file:", error);
        alert("Error uploading file: " + error.message);
    }
}
async function fetchBankStatementData(bucketName, filePath) {
    console.log("Retrieving statement analysis data from textract");
    try {
        const response = await fetch("/api/textract", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                bucketName,
                filePath
            })
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || "Failed to fetch Textract data");
        }
        const data = await response.json();
        console.log("Extracted data:", data);
        return data;
    } catch (error) {
        console.error("Error fetching Textract data:", error);
        alert("Error fetching bank statement data: " + error.message);
    }
}
async function getMetaData(bucketName, filePath) {
    console.log("Retrieving file data from s3");
    try {
        const response = await fetch("/api/files/retrieve-metadata", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                bucketName: bucketName,
                directory: filePath
            })
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || "Failed to fetch Textract data");
        }
        const data = await response.json();
        return data.data;
    } catch (error) {
        console.error("Error retrieving file data:", error);
        alert("Error retrieving file data: " + error.message);
    }
}
async function processBankStatementTextract(bucketName, filePath) {
    const response = await fetch("/api/files/analyze/textract", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            bucketName: bucketName,
            filePath: filePath
        })
    });
    const data = await response.json();
    console.log(data);
    return data;
}
async function createNewDirectory(bucketName, filePath, newFileName) {
    console.log("CREATING NEW DIRECTORY");
}
async function processBankStatementTesseract(bucketName, filePath) {
    const response = await fetch("/api/files/analyze/tesseract", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            bucketName: bucketName,
            filePath: filePath
        })
    });
    if (!response.ok) {
        const error = await response.json();
        console.error("Error:", error.error);
        return;
    }
    const data = await response.json();
    console.log("Extracted Text:", data.data.text);
    return data.data.text;
}
async function parseBankStatementText(text) {
    console.log("HERE");
    try {
        const response = await fetch("/api/files/analyze/openAI/parse", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                text
            })
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to process text.");
        }
        const result = await response.json();
        return result.parsedData;
    } catch (error) {
        console.error("Error processing bank statement:", error);
        throw error;
    }
}
async function produceSummaryOpenAI(text) {
    try {
        const response = await fetch("/api/files/analyze/openAI/summary", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                text
            })
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to process text.");
        }
        const result = await response.json();
        return result.parsedData;
    } catch (error) {
        console.error("Error processing bank statement:", error);
        throw error;
    }
}
async function analyzeOpenAI(text) {
    try {
        const response = await fetch("/api/files/analyze/openAI/analysis", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                text
            })
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to process text.");
        }
        const result = await response.json();
        return result.parsedData;
    } catch (error) {
        console.error("Error processing bank statement:", error);
        throw error;
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_refresh__.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/app/components/FileSystem/FileSystemTree.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, k: __turbopack_refresh__, m: module, z: __turbopack_require_stub__ } = __turbopack_context__;
{
__turbopack_esm__({
    "default": (()=>FileSystemTree)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$utils$2f$files$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/app/utils/files.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$main$2f$dashboard$2f$layout$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/app/main/dashboard/layout.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$Box$2f$Box$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/@mui/material/Box/Box.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$x$2d$tree$2d$view$2f$SimpleTreeView$2f$SimpleTreeView$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/@mui/x-tree-view/SimpleTreeView/SimpleTreeView.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$x$2d$tree$2d$view$2f$TreeItem$2f$TreeItem$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/@mui/x-tree-view/TreeItem/TreeItem.js [app-client] (ecmascript)");
;
var _s = __turbopack_refresh__.signature();
'use client';
;
;
;
;
;
;
;
/**
 * Maps S3 API response to TreeItems.
 */ function mapS3ResponseToTreeItems(response, currPath) {
    const items = [];
    // Map folders
    if (Array.isArray(response.folders)) {
        response.folders.forEach((folder)=>{
            const folderName = folder.replace(/\/$/, ''); // Remove trailing '/'
            items.push({
                id: currPath + folder,
                label: folderName,
                hasChildren: true,
                children: []
            });
        });
    }
    // Map files
    if (Array.isArray(response.files)) {
        response.files.forEach((file)=>{
            if (currPath == file.key) {
                return;
            }
            const fileName = file.key.split('/').pop() || file.key; // Extract file name
            items.push({
                id: file.key,
                label: fileName,
                hasChildren: false,
                children: []
            });
        });
    }
    return items;
}
/**
 * Recursively renders TreeItems.
 */ function renderTree(node, handleNodeClick, handleRightClick, handleCloseContextMenu) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$x$2d$tree$2d$view$2f$TreeItem$2f$TreeItem$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TreeItem"], {
        itemId: node.id,
        "data-itemid": node.id,
        label: node.label,
        onClick: async (event)=>{
            await handleNodeClick(node.id, event.currentTarget);
        },
        onContextMenu: (event)=>handleRightClick(event, node.hasChildren ? 'folder' : 'file', node),
        children: node.children?.map((child)=>renderTree(child, handleNodeClick, handleRightClick, handleCloseContextMenu))
    }, node.id, false, {
        fileName: "[project]/app/components/FileSystem/FileSystemTree.tsx",
        lineNumber: 78,
        columnNumber: 5
    }, this);
}
function findNodeById(items, nodeId) {
    for (const item of items){
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
function FileSystemTree() {
    _s();
    const [treeItems, setTreeItems] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__.useState([]);
    const [loading, setLoading] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__.useState(true);
    const [error, setError] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__.useState(null);
    const [uploadMenuOpen, setUploadMenuOpen] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__.useState(false);
    const [createFolderMenuOpen, setCreateFolderMenuOpen] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__.useState(false);
    const [currentSelectedFilePath, setCurrentSelectedFilePath] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__.useState('/user1');
    const [contextMenu, setContextMenu] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__.useState(null);
    const [expanded, setExpanded] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__.useState([]); // Use array directly
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const { setBankStatementText } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$main$2f$dashboard$2f$layout$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useBankStatement"])();
    // Fetch initial data
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__.useEffect({
        "FileSystemTree.useEffect": ()=>{
            const fetchData = {
                "FileSystemTree.useEffect.fetchData": async ()=>{
                    try {
                        const data = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$utils$2f$files$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getMetaData"])('iarpus-bankstatement', 'user1/');
                        const mappedItems = mapS3ResponseToTreeItems(data, 'user1/');
                        setTreeItems(mappedItems);
                    } catch (err) {
                        console.error('Error fetching metadata:', err);
                        setError('Failed to load initial directory.');
                    } finally{
                        setLoading(false);
                    }
                }
            }["FileSystemTree.useEffect.fetchData"];
            fetchData();
        }
    }["FileSystemTree.useEffect"], []);
    // Handle node clicks
    function updateTreeItems(items, nodeId, newChildren) {
        return items.map((item)=>{
            if (item.id === nodeId) {
                // Update the matching node
                return {
                    ...item,
                    children: newChildren
                };
            } else if (item.children) {
                // Recursively update children
                return {
                    ...item,
                    children: updateTreeItems(item.children, nodeId, newChildren)
                };
            }
            return item; // Return unchanged for non-matching nodes
        });
    }
    const handleNodeClick = async (nodeId)=>{
        const node = findNodeById(treeItems, nodeId);
        handleToggle(node);
        if (node && node.hasChildren && node.children?.length === 0) {
            try {
                const data = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$utils$2f$files$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getMetaData"])('iarpus-bankstatement', nodeId);
                const newChildren = mapS3ResponseToTreeItems(data, nodeId);
                setTreeItems((prevItems)=>updateTreeItems(prevItems, nodeId, newChildren));
            } catch (err) {
                console.error('Error fetching subdirectory:', err);
                setError(`Failed to load contents for ${nodeId}.`);
            }
        } else if (node && !node.hasChildren) {
            const bankStatementText = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$utils$2f$files$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["processBankStatementTesseract"])('iarpus-bankstatement', node.id);
            setBankStatementText(bankStatementText);
            router.push('/main/dashboard/analysis/summary');
        }
    };
    const handleRightClick = (event, type, node)=>{
        event.preventDefault();
        event.stopPropagation();
        setCurrentSelectedFilePath(node.id);
        setContextMenu({
            mouseX: event.clientX,
            mouseY: event.clientY,
            targetType: type,
            targetId: node?.id
        });
    };
    const handleToggle = (currNode)=>{
        if (currNode.children) {
            setExpanded((prevExpanded)=>{
                if (prevExpanded.includes(currNode.id)) {
                    // If the node is already expanded, remove it
                    return prevExpanded.filter((id)=>id !== currNode.id);
                } else {
                    // Otherwise, add it to the list of expanded nodes
                    return [
                        ...prevExpanded,
                        currNode.id
                    ];
                }
            });
        }
    };
    const handleCloseContextMenu = ()=>{
        setContextMenu(null);
    };
    if (loading) return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        children: "Loading file system..."
    }, void 0, false, {
        fileName: "[project]/app/components/FileSystem/FileSystemTree.tsx",
        lineNumber: 213,
        columnNumber: 23
    }, this);
    if (error) return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        children: [
            "Error: ",
            error
        ]
    }, void 0, true, {
        fileName: "[project]/app/components/FileSystem/FileSystemTree.tsx",
        lineNumber: 214,
        columnNumber: 21
    }, this);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$Box$2f$Box$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
        sx: {
            minHeight: 352,
            minWidth: 250
        },
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$x$2d$tree$2d$view$2f$SimpleTreeView$2f$SimpleTreeView$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SimpleTreeView"], {
            expandedItems: expanded,
            children: treeItems.map((node)=>renderTree(node, handleNodeClick, handleRightClick, handleCloseContextMenu))
        }, void 0, false, {
            fileName: "[project]/app/components/FileSystem/FileSystemTree.tsx",
            lineNumber: 221,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/app/components/FileSystem/FileSystemTree.tsx",
        lineNumber: 216,
        columnNumber: 5
    }, this);
}
_s(FileSystemTree, "tsiG02mDCzc0blLM6RcaGpRQcE8=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$main$2f$dashboard$2f$layout$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useBankStatement"]
    ];
});
_c = FileSystemTree;
var _c;
__turbopack_refresh__.register(_c, "FileSystemTree");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_refresh__.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/app/components/FileSystem/FileSystemDrawer.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, k: __turbopack_refresh__, m: module, z: __turbopack_require_stub__ } = __turbopack_context__;
{
__turbopack_esm__({
    "default": (()=>FileSystemDrawer)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$FileSystem$2f$FileSystemTree$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/app/components/FileSystem/FileSystemTree.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$Box$2f$Box$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/@mui/material/Box/Box.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$Button$2f$Button$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/@mui/material/Button/Button.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$Folder$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/@mui/icons-material/esm/Folder.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$Drawer$2f$Drawer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/@mui/material/Drawer/Drawer.js [app-client] (ecmascript)");
;
var _s = __turbopack_refresh__.signature();
'use client';
;
;
;
;
;
;
function FileSystemDrawer() {
    _s();
    const [open, setOpen] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__.useState(false);
    const toggleDrawer = (newOpen)=>()=>{
            setOpen(newOpen);
        };
    const DrawerList = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$Box$2f$Box$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
        sx: {
            width: 250,
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            padding: 0,
            margin: 0
        },
        role: "presentation",
        onClick: toggleDrawer(false),
        onKeyDown: toggleDrawer(false),
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$Box$2f$Box$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                sx: {
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: '8px 0',
                    borderBottom: '1px solid #ddd'
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$Button$2f$Button$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                    onClick: toggleDrawer(false),
                    sx: {
                        minWidth: 'unset',
                        padding: 0
                    },
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$Folder$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        fontSize: "large"
                    }, void 0, false, {
                        fileName: "[project]/app/components/FileSystem/FileSystemDrawer.tsx",
                        lineNumber: 44,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/app/components/FileSystem/FileSystemDrawer.tsx",
                    lineNumber: 40,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/components/FileSystem/FileSystemDrawer.tsx",
                lineNumber: 31,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$Box$2f$Box$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                sx: {
                    flex: 1,
                    overflowY: 'auto',
                    padding: 0,
                    margin: 0
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$FileSystem$2f$FileSystemTree$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                    fileName: "[project]/app/components/FileSystem/FileSystemDrawer.tsx",
                    lineNumber: 49,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/components/FileSystem/FileSystemDrawer.tsx",
                lineNumber: 48,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/components/FileSystem/FileSystemDrawer.tsx",
        lineNumber: 17,
        columnNumber: 5
    }, this);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$Button$2f$Button$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                onClick: toggleDrawer(true),
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$Folder$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                    fontSize: "large"
                }, void 0, false, {
                    fileName: "[project]/app/components/FileSystem/FileSystemDrawer.tsx",
                    lineNumber: 57,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/components/FileSystem/FileSystemDrawer.tsx",
                lineNumber: 56,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$Drawer$2f$Drawer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                open: open,
                onClose: toggleDrawer(false),
                children: DrawerList
            }, void 0, false, {
                fileName: "[project]/app/components/FileSystem/FileSystemDrawer.tsx",
                lineNumber: 59,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/components/FileSystem/FileSystemDrawer.tsx",
        lineNumber: 55,
        columnNumber: 5
    }, this);
}
_s(FileSystemDrawer, "xG1TONbKtDWtdOTrXaTAsNhPg/Q=");
_c = FileSystemDrawer;
var _c;
__turbopack_refresh__.register(_c, "FileSystemDrawer");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_refresh__.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/app/main/dashboard/layout.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, k: __turbopack_refresh__, m: module, z: __turbopack_require_stub__ } = __turbopack_context__;
{
__turbopack_esm__({
    "default": (()=>AnalysisLayout),
    "useBankStatement": (()=>useBankStatement)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$FileSystem$2f$FileSystemDrawer$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/app/components/FileSystem/FileSystemDrawer.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_refresh__.signature(), _s1 = __turbopack_refresh__.signature();
'use client';
;
;
// Create a context for the bank statement
const BankStatementContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(null);
const useBankStatement = ()=>{
    _s();
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(BankStatementContext);
    if (!context) {
        throw new Error('useBankStatement must be used within an AnalysisLayout');
    }
    return context;
};
_s(useBankStatement, "b9L3QQ+jgeyIrH0NfHrJ8nn7VMU=");
function AnalysisLayout({ children }) {
    _s1();
    const [bankStatementText, setBankStatementText] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(BankStatementContext.Provider, {
        value: {
            bankStatementText,
            setBankStatementText
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$FileSystem$2f$FileSystemDrawer$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                fileName: "[project]/app/main/dashboard/layout.tsx",
                lineNumber: 29,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                children: children
            }, void 0, false, {
                fileName: "[project]/app/main/dashboard/layout.tsx",
                lineNumber: 30,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/main/dashboard/layout.tsx",
        lineNumber: 28,
        columnNumber: 5
    }, this);
}
_s1(AnalysisLayout, "YwRO48OWzaycxeyATajTM+p45FQ=");
_c = AnalysisLayout;
var _c;
__turbopack_refresh__.register(_c, "AnalysisLayout");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_refresh__.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/app/main/dashboard/layout.tsx [app-rsc] (ecmascript, Next.js server component, client modules)": ((__turbopack_context__) => {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, t: __turbopack_require_real__ } = __turbopack_context__;
{
}}),
}]);

//# sourceMappingURL=app_3fb1fc._.js.map