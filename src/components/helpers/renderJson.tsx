"use client"

import { UploadedFile } from '@/app/upload/page';
import React, { useState } from 'react'
import {
 
  Edit,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { Input } from '../ui/input';
import { Button } from '../ui/button';



const RenderJson = ({fileID, Data, setFiles }:{
  fileID:string
   Data:any
  setFiles :(file:any)=> void

}) => {


  const [expandedSections, setExpandedSections] = useState<
    Record<string, Set<string>>
  >({});
  const [editableFields, setEditableFields] = useState<
    Record<string, Set<string>>
  >({});

  
  const toggleEditable = (fileId: string, path: string) => {
    setEditableFields((prev) => {
      const fileFields = prev[fileId] || new Set();
      const newFileFields = new Set(fileFields);

      if (newFileFields.has(path)) {
        newFileFields.delete(path);
      } else {
        newFileFields.add(path);
      }

      return {
        ...prev,
        [fileId]: newFileFields,
      };
    });
  };

  const toggleSection = (fileId: string, path: string) => {
    setExpandedSections((prev) => {
      const fileSections = prev[fileId] || new Set();
      const newFileSections = new Set(fileSections);

      if (newFileSections.has(path)) {
        newFileSections.delete(path);
      } else {
        newFileSections.add(path);
      }

      return {
        ...prev,
        [fileId]: newFileSections,
      };
    });
  };


  const updateFieldValue = (fileId: string, path: string, value: any) => {


      setFiles((prev: UploadedFile[]) => {
        return prev.map((file):UploadedFile  => {
          if (file.id === fileId) {
            // Create a deep copy of the edited data
            const editedData = JSON.parse(JSON.stringify(file.editedData || {}));
  
            // Split the path into parts
            const pathParts = path.split(".");
  
            // Navigate to the correct object
            let current = editedData;
            for (let i = 0; i < pathParts.length - 1; i++) {
              const part = pathParts[i];
  
              // Handle array indices
              if (part.includes("[") && part.includes("]")) {
                const arrayName = part.substring(0, part.indexOf("["));
                const index = Number.parseInt(
                  part.substring(part.indexOf("[") + 1, part.indexOf("]"))
                );
  
                if (!current[arrayName]) current[arrayName] = [];
                if (!current[arrayName][index]) current[arrayName][index] = {};
  
                current = current[arrayName][index];
              } else {
                if (!current[part]) current[part] = {};
                current = current[part];
              }
            }
  
            // Set the value
            const lastPart = pathParts[pathParts.length - 1];
  
            // Handle array indices in the last part
            if (lastPart.includes("[") && lastPart.includes("]")) {
              const arrayName = lastPart.substring(0, lastPart.indexOf("["));
              const index = Number.parseInt(
                lastPart.substring(
                  lastPart.indexOf("[") + 1,
                  lastPart.indexOf("]")
                )
              );
  
              if (!current[arrayName]) current[arrayName] = [];
              current[arrayName][index] = value;
            } else {
              current[lastPart] = value;
            }
  
            return {
              ...file,
              editedData,
            };
          }
          return file;
        });
      });
    };






  const renderExtractedData = (
    fileId: string,
    data: any,
    path = "",
    level = 0
  ) => {
    if (!data || Object.keys(data).length === 0) {
      return <p className="text-sm text-muted-foreground">No data extracted</p>;
    }
  
    const fileExpandedSections = expandedSections[fileId] || new Set();
    const fileEditableFields = editableFields[fileId] || new Set();
  
    return (
      <div
        className="space-y-2 text-sm"
        style={{ marginLeft: level > 0 ? `${level * 12}px` : "0" }}
      >
        {Object.entries(data).map(([key, value]) => {
          // Skip rendering if value is null or undefined
          if (value === null || value === undefined) return null;
  
          const currentPath = path ? `${path}.${key}` : key;
  
          const isExpanded = fileExpandedSections.has(currentPath);
          const isEditable = fileEditableFields.has(currentPath);
  
          // Handle arrays
          if (Array.isArray(value)) {
            return (
              <div key={currentPath} className="space-y-1">
                <div
                  className="flex items-center cursor-pointer hover:bg-muted/50 p-1 rounded"
                  onClick={() => toggleSection(fileId, currentPath)}
                >
                  {isExpanded ? (
                    <ChevronDown className="h-4 w-4 mr-1 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="h-4 w-4 mr-1 text-muted-foreground" />
                  )}
                  <span className="font-medium text-muted-foreground">
                    {key.replace(/_/g, " ")}:
                  </span>
                  <span className="ml-2 text-muted-foreground">
                    [{value.length} items]
                  </span>
                </div>
  
                {isExpanded && (
                  <div className="pl-4 border-l-2 border-muted mt-1">
                    {value.map((item, index) => {
                      const itemPath = `${currentPath}[${index}]`;
  
                      if (typeof item === "object" && item !== null) {
                        return (
                          <div key={itemPath} className="mt-1">
                            <div className="font-medium text-muted-foreground mb-1">
                              Item {index + 1}:
                            </div>
                            {renderExtractedData(
                              fileId,
                              item,
                              itemPath,
                              level + 1
                            )}
                          </div>
                        );
                      }
  
                      return (
                        <div
                          key={itemPath}
                          className="grid grid-cols-2 gap-2 mt-1"
                        >
                          <span className="font-medium text-muted-foreground">
                            Item {index + 1}:
                          </span>
                          <div className="flex items-center">
                            {isEditable ? (
                              <Input
                                value={String(item)}
                                onChange={(e) =>
                                  updateFieldValue(
                                    fileId,
                                    itemPath,
                                    e.target.value
                                  )
                                }
                                className="h-7 py-1"
                                onBlur={() => toggleEditable(fileId, itemPath)}
                                autoFocus
                              />
                            ) : (
                              <span
                                className="cursor-pointer hover:bg-muted/50 p-1 rounded flex-1"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleEditable(fileId, itemPath);
                                }}
                              >
                                {String(item)}
                              </span>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0 ml-1"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleEditable(fileId, itemPath);
                              }}
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          }
  
          // Handle nested objects
          if (typeof value === "object" && value !== null) {
            return (
              <div key={currentPath} className="space-y-1">
                <div
                  className="flex items-center cursor-pointer hover:bg-muted/50 p-1 rounded"
                  onClick={() => toggleSection(fileId, currentPath)}
                >
                  {isExpanded ? (
                    <ChevronDown className="h-4 w-4 mr-1 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="h-4 w-4 mr-1 text-muted-foreground" />
                  )}
                  <span className="font-medium text-muted-foreground">
                    {key.replace(/_/g, " ")}
                  </span>
                </div>
  
                {isExpanded && (
                  <div className="pl-4 border-l-2 border-muted mt-1">
                    {renderExtractedData(fileId, value, currentPath, level + 1)}
                  </div>
                )}
              </div>
            );
          }
  
          // Handle primitive values (strings, numbers, booleans)
          return (
            <div
              key={currentPath}
              className="grid grid-cols-2 gap-2 items-center"
            >
              <span className="font-medium text-muted-foreground">
                {key.replace(/_/g, " ")}:
              </span>
              <div className="flex items-center">
                {isEditable ? (
                  <Input
                    value={String(value)}
                    onChange={(e) =>
                      updateFieldValue(fileId, currentPath, e.target.value)
                    }
                    className="h-7 py-1"
                    onBlur={() => toggleEditable(fileId, currentPath)}
                    autoFocus
                  />
                ) : (
                  <span
                    className="cursor-pointer hover:bg-muted/50 p-1 rounded flex-1"
                    onClick={() => toggleEditable(fileId, currentPath)}
                  >
                    {String(value)}
                  </span>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 ml-1"
                  onClick={() => toggleEditable(fileId, currentPath)}
                >
                  <Edit className="h-3 w-3" />
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    );
  };


  return (
    renderExtractedData(fileID,Data)
  )
}

export default RenderJson




