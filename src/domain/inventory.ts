import type { InventoryStack } from "./types";
export function addInventoryItem(items:InventoryStack[],itemId:string){const found=items.find(i=>i.itemId===itemId);if(found){found.count+=1;found.isNew=true;return [...items];}return [...items,{itemId,count:1,isNew:true,favorite:false}];}
