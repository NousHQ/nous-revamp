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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Separator } from "@/components/ui/separator"


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
  open: boolean;
};

type BookmarkNodeProps = {
  node: ParsedLink | ParsedFolder;
};



export function SyncButton() {
  useEffect(() => {
    const extensionId = process.env.NEXT_PUBLIC_EXTENSION_ID;
    chrome.runtime.sendMessage(extensionId, { action: 'getBookmarks' }, (response: { bookmarks: chrome.bookmarks.BookmarkTreeNode[] }) => {
      const parsedTree = response.bookmarks.map(node => parseBookmarkTreeNode(node));
      if (parsedTree.length > 0 && 'name' in parsedTree[0] && !parsedTree[0].name) {
        parsedTree[0].name = 'Your bookmarks';
        parsedTree[0].open = true;
      }

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
        open: false,
        // partialChecked: false,
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
  
  // function anyChildChecked(links: (ParsedLink | ParsedFolder)[]): boolean {
  //   return links.some(link => link.checked);
  // }
  
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
          // partialChecked: !allChildrenChecked(updatedLinks) && anyChildChecked(updatedLinks)
        };
      }
    }
    setBookmarkTree(prevTree => prevTree.map(updateNode) as ParsedFolder[]);
  }

  function handleSubmit(): void {
    const extractCheckedNodes = (node: ParsedLink | ParsedFolder): ParsedLink | ParsedFolder | null => {
        if ('url' in node) {
            // It's a link
            return node.checked ? node : null;
        } else {
            // It's a folder
            const checkedChildren = node.links.map(child => extractCheckedNodes(child)).filter(Boolean) as (ParsedLink | ParsedFolder)[];

            if (node.checked || checkedChildren.length > 0) {
                return {
                    ...node,
                    links: checkedChildren
                };
            }
            return null;
        }
    }

    // Directly use bookmarkTree from state
    const checkedNodes = bookmarkTree.map(node => extractCheckedNodes(node)).filter(Boolean) as ParsedFolder[];
    console.log(checkedNodes); // Here you can see the result or do something with it

    // If you want to save it to another state or variable:
    // setCheckedNodesState(checkedNodes);  // Assuming setCheckedNodesState is your useState setter function
  }

  function toggleFolderOpen(nodeId: string, isOpen: boolean): void {
    function updateNodeOpenState(node: ParsedLink | ParsedFolder): ParsedLink | ParsedFolder {
      if ('url' in node) {
        return node; // unchanged for leaf nodes
      } else if (node.id === nodeId) {
        return { ...node, open: isOpen }; // toggle open state for the matched folder
      } else {
        return { ...node, links: node.links.map(updateNodeOpenState) }; // recursively update children
      }
    }
  
    setBookmarkTree(prevTree => prevTree.map(updateNodeOpenState));
  }
  
  // Modify the BookmarkNode component:
  
  const BookmarkNode: React.FC<BookmarkNodeProps> = ({ node }) => {
    if ('url' in node) {
      // Link
      return (
        <div className="flex justify-between ml-5">
          <a href={node.url} target="_blank" rel="noopener noreferrer" className="my-1 text-sm mr-4 overflow truncate max-w-[420px]">{node.name}</a>
          <Checkbox checked={node.checked} onCheckedChange={() => handleCheck(node.id, !node.checked)} />
        </div>
      );
    } else {
      // Folder
      const childFolders = node.links.filter(child => 'links' in child) as ParsedFolder[];
      const childLinks = node.links.filter(child => 'url' in child) as ParsedLink[];  
      
      return (
        <Collapsible
          open={node.open}
          onOpenChange={(newOpenState) => toggleFolderOpen(node.id, newOpenState)}
        >
          <div className="flex items-center justify-between space-x-4">
            <div className="flex justify-start">
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="xs">
                  <CaretSortIcon className="h-4 w-4" />
                  <span className="sr-only">Toggle</span>
                </Button>
              </CollapsibleTrigger>
              <h4 className="text-base font-semibold">
                {node.name}
              </h4>
            </div>
            <Checkbox checked={node.checked} onCheckedChange={() => handleCheck(node.id, !node.checked)} />
          </div>
          <Separator />
          <CollapsibleContent className="space-y-2">
            <div className='ml-5'>
              {/* Render child folders first */}
              {childFolders.map(folder => (
                <BookmarkNode key={folder.id} node={folder} />
                ))}
              {/* Render child links next */}
              {childLinks.map(link => (
                <BookmarkNode key={link.id} node={link} />
                ))}
            </div>
          </CollapsibleContent>
        </Collapsible>
      );
    }
};

  return (
    <Dialog>
      {/* Check if there's an error and display it */}
      <DialogTrigger asChild>
        <Button 
          variant="outline"
          className="fixed p-3 m-2 top-1 right-16 text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 hover:text-white focus:outline-none focus:ring focus:ring-gray-300"
        >
          Sync Bookmarks
        </Button>
      </DialogTrigger>
      
      <DialogContent className="bg-white border-2 border-black max-w-5xl h-[800px]">
        <DialogHeader>
          <DialogTitle>Import Bookmarks</DialogTitle>
          <DialogDescription>
            Want more? Get PRO!
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="max-h-full rounded-md border p-4">
          {bookmarkTree.map(node => (
            <BookmarkNode key={node.id} node={node} />
          ))}
        </ScrollArea>
        <DialogFooter>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button type="submit">Save changes</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Select these bookmarks?</AlertDialogTitle>
              <AlertDialogDescription>
                This will start downloading and indexing the selected bookmarks.
                They will slowly show up on the sidebar and you will be able to search them.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => handleSubmit()}>
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )

}

