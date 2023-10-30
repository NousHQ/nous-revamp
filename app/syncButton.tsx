"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Checkbox } from "@/components/ui/checkbox"
import { CaretSortIcon } from "@radix-ui/react-icons"

type ParsedLink = {
  id: string;
  name: string;
  url: string;
  checked: boolean;
};

type ParsedFolder = {
  id: string;
  name: string;
  checked: boolean;
  links: (ParsedLink | ParsedFolder)[];
};

type BookmarkNodeProps = {
  node: ParsedLink | ParsedFolder;
};



export function DialogDemo() {
  useEffect(() => {
    const extensionId = process.env.NEXT_PUBLIC_EXTENSION_ID;
    chrome.runtime.sendMessage(extensionId, { action: 'getBookmarks' }, (response: { bookmarks: chrome.bookmarks.BookmarkTreeNode[] }) => {
      const parsedTree = response.bookmarks.map(node => parseBookmarkTreeNode(node));
      setBookmarkTree(parsedTree as ParsedFolder[]);
    })
  }, []);

  function parseBookmarkTreeNode(node: chrome.bookmarks.BookmarkTreeNode): ParsedLink | ParsedFolder {
    if (node.children) {
      // It's a folder
      const folder: ParsedFolder = {
        id: node.id,
        name: node.title,
        checked: false,
        partialChecked: false,
        links: node.children.map(childNode => parseBookmarkTreeNode(childNode)),
      };
      return folder;
    } else {
      // It's a link
      const link: ParsedLink = {
        id: node.id,
        name: node.title,
        url: node.url!,
        checked: false,
      };
      return link;
    }
  }
  const [bookmarkTree, setBookmarkTree] = useState<ParsedFolder[]>([]);
  
  // const [bookmarks, setBookmarks] = useState<chrome.bookmarks.BookmarkTreeNode[]>([]);


  function checkAllChildren(node: ParsedLink | ParsedFolder, checked: boolean): ParsedLink | ParsedFolder {
    if ('url' in node) {
      return { ...node, checked };
    } else {
      return { ...node, checked, links: node.links.map(child => checkAllChildren(child, checked)) };
    }
  }
  function allChildrenChecked(links: (ParsedLink | ParsedFolder)[]): boolean {
    return links.every(link => link.checked);
  }
  
  function anyChildChecked(links: (ParsedLink | ParsedFolder)[]): boolean {
    return links.some(link => link.checked);
  }
  
  function handleCheck(nodeId: string, checked: boolean): void {
    function updateNode(node: ParsedLink | ParsedFolder): ParsedLink | ParsedFolder {
      if (node.id === nodeId) {
        return checkAllChildren(node, checked);
      } else if ('url' in node) {
        return node; // unchanged for leaf nodes that don't match
      } else {
        const updatedLinks = node.links.map(updateNode);
        return { 
          ...node, 
          links: updatedLinks, 
          checked: allChildrenChecked(updatedLinks),
          partialChecked: !allChildrenChecked(updatedLinks) && anyChildChecked(updatedLinks)
        };
      }
    }
    setBookmarkTree(prevTree => prevTree.map(updateNode));
  }

  // Modify the BookmarkNode component:
  
  const BookmarkNode: React.FC<BookmarkNodeProps> = ({ node }) => {
    if ('url' in node) {
      // Link
      return (
        <div>
          {/* <Checkbox checked={node.checked} onCheckedChange={() => handleCheck(node.id, !node.checked)} /> */}
          <a href={node.url} target="_blank" rel="noopener noreferrer">{node.name}</a>
          <input type="checkbox" checked={node.checked} onChange={(e) => handleCheck(node.id, e.target.checked)} />
        </div>
      );
    } else {
      // Folder
      return (
        <div>
          <div>
            <strong>{node.name}</strong>
            {/* <Checkbox checked={node.checked} onCheckedChange={() => handleCheck(node.id, !node.checked)} /> */}
            <input type="checkbox" checked={node.checked} onChange={(e) => handleCheck(node.id, e.target.checked)} />
          </div>
          <div style={{ marginLeft: '20px' }}>
            {node.links.map(childNode => (
              <BookmarkNode key={childNode.id} node={childNode} />
            ))}
          </div>
        </div>
      );
    }
  };


  return (
    <Dialog>
      {/* Check if there's an error and display it */}
      <DialogTrigger asChild>
        <Button variant="outline" className="fixed p-3 m-2 top-1 right-16 text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 hover:text-white focus:outline-none focus:ring focus:ring-gray-300">Sync Bookmarks</Button>
      </DialogTrigger>
      
      <DialogContent className="bg-white max-h-[100vh]">
        <DialogHeader>
          <DialogTitle>Import Bookmarks</DialogTitle>
          <DialogDescription>
            Want more? Get PRO!
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="h-96 rounded-md border p-4">
          {bookmarkTree.map(node => (
            <BookmarkNode key={node.id} node={node} />
          ))}
        </ScrollArea>
        
        <DialogFooter>
          <Button type="submit">Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )

}

// const [folder, setFolder] = useState({
//   id: 'folder1',
//   name: 'Folder 1',
//   open: false,
//   checked: false,
//   links: [
//     { id: 'link3', name: 'LinkFolder 1', checked: false },
//     { id: 'link4', name: 'LinkFolder 2', checked: false }
//   ]
// });

// const [links, setLinks] = useState([
//   { id: 'link1', name: 'Link 1', checked: false },
//   { id: 'link2', name: 'Link 2', checked: false },
//   { id: 'link3', name: 'Link 3', checked: false },
//   { id: 'link4', name: 'Link 4', checked: false },
//   { id: 'link5', name: 'Link 5', checked: false },
//   { id: 'link6', name: 'Link 6', checked: false },
//   { id: 'link7', name: 'Link 7', checked: false },
//   { id: 'link8', name: 'Link 8', checked: false },
//   { id: 'link9', name: 'Link 9', checked: false },
//   { id: 'link10', name: 'Link 10', checked: false },
//   { id: 'link11', name: 'Link 11', checked: false },
//   { id: 'link12', name: 'Link 12', checked: false },
//   { id: 'link13', name: 'Link 13', checked: false },
//   { id: 'link14', name: 'Link 14', checked: false },
//   { id: 'link15', name: 'Link 15', checked: false },
//   { id: 'link16', name: 'Link 16', checked: false },
//   { id: 'link17', name: 'Link 17', checked: false },
//   { id: 'link18', name: 'Link 18', checked: false },
//   { id: 'link19', name: 'Link 19', checked: false },
//   { id: 'link20', name: 'Link 20', checked: false },
// ]);

// const [isOpen, setIsOpen] = useState(false)


// const handleFolderCheckboxChange = () => toggleFolder();

// const handleLinkCheckboxChange = (linkId) => toggleIndividualLink(linkId);

// const handleFolderLinkCheckboxChange = (linkId) => toggleFolderLink(linkId);

// const handleFolderLabelClick = () => toggleFolderOpenStatus();

// const toggleFolderOpenStatus = () => {
//   setFolder(prev => ({ ...prev, open: !prev.open }));
// };

// const toggleFolder = () => {
//   const isAllChecked = folder.links.every(link => link.checked);
//   setFolder(prev => ({
//     ...prev,
//     checked: !prev.checked,
//     links: prev.links.map(link => ({ ...link, checked: !isAllChecked }))
//   }));
// };

// const toggleIndividualLink = (linkId) => {
//   setLinks(prevLinks => 
//     prevLinks.map(link =>
//       link.id === linkId ? { ...link, checked: !link.checked } : link
//     )
//   );
// };

// const toggleFolderLink = (linkId) => {
//   const updatedLinks = folder.links.map(link => 
//     link.id === linkId ? { ...link, checked: !link.checked } : link
//   );
//   const isAllChecked = updatedLinks.every(link => link.checked);
//   setFolder(prev => ({
//     ...prev,
//     links: updatedLinks,
//     checked: isAllChecked
//   }));
// };

// const selectedLinksCount = links.filter(link => link.checked).length;
// const selectedFolderLinksCount = folder.links.filter(link => link.checked).length;
// const totalSelected = selectedLinksCount + selectedFolderLinksCount;

// function renderBookmarkNode(node: chrome.bookmarks.BookmarkTreeNode) {
//   if (node.children) {
//     // This node is a folder
//     return (
//       <div key={node.id}>
//         <h4>{node.title}</h4>
//         {node.children.map(childNode => renderBookmarkNode(childNode))}
//       </div>
//     );
//   } else {
//     // This node is a bookmark/link
//     return (
//       <div key={node.id}>
//         <a href={node.url}>{node.title}</a>
//       </div>
//     );
//   }
// }
// function renderBookmarks(data) {
//   return data.map(item => {
//     if (item.type === 'folder') {
//       return (
//         <div key={item.id} className="flex items-center justify-between space-x-4">
//           <Collapsible open={item.open} onOpenChange={() => toggleFolderOpenStatus(item.id)}>
//             <div className="flex items-center justify-between space-x-4">
//               <CollapsibleTrigger asChild>
//                 <Button variant="ghost" size="xs">
//                   <CaretSortIcon className="h-4 w-4" />
//                   <span className="sr-only">Toggle</span>
//                 </Button>
//               </CollapsibleTrigger>
//               <h4 className="text-sm font-semibold ml-auto">{item.name}</h4>
//               <Checkbox id={item.id} checked={item.checked} onCheckedChange={() => handleFolderCheckboxChange(item.id)}/>
//             </div>
//             <CollapsibleContent className="space-y-2">
//               {renderBookmarks(item.links)}
//             </CollapsibleContent>
//           </Collapsible>
//         </div>
//       );
//     } else {
//       return (
//         <div key={item.id} className="mb-2 flex items-center justify-between">
//           <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">{item.name}</label>
//           <Checkbox className="mr-2" id={item.id} onChange={() => handleLinkCheckboxChange(item.id)}/>
//         </div>
//       );
//     }
//   });
// }
