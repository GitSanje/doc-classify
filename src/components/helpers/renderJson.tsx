"use client"


import type React from "react"
import { useState, useEffect } from "react"
import { Edit, ChevronDown, ChevronRight, Plus, Save, Trash2, AlertCircle, X, Phone, User } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { UploadedFile } from "../upload"
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select"

const RenderJson = ({
  fileID,
  Data,
  setFiles,
  names,
  documents
}: {
  fileID: string
  Data: any
  setFiles: (callback: (files: UploadedFile[]) => UploadedFile[]) => void
  names?: string[]
  documents?:string[]
  
}) => {
  const [expandedSections, setExpandedSections] = useState<Record<string, Set<string>>>({})
  const [editableFields, setEditableFields] = useState<Record<string, Set<string>>>({})
  const [showAddForm, setShowAddForm] = useState(false)
  const [newObj, setNewObj] = useState<{ key: string; value: string }>({ key: "", value: "" })
  const [error, setError] = useState<string | null>(null)
  const [addingToPath, setAddingToPath] = useState<string | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

 


  const toggleEditable = (fileId: string, path: string) => {
    setEditableFields((prev) => {
      const fileFields = prev[fileId] || new Set()
      const newFileFields = new Set(fileFields)

      if (newFileFields.has(path)) {
        newFileFields.delete(path)
      } else {
        newFileFields.add(path)
      }

      return {
        ...prev,
        [fileId]: newFileFields,
      }
    })
  }

  const toggleSection = (fileId: string, path: string) => {
    setExpandedSections((prev) => {
      const fileSections = prev[fileId] || new Set()
      const newFileSections = new Set(fileSections)

      if (newFileSections.has(path)) {
        newFileSections.delete(path)
      } else {
        newFileSections.add(path)
      }

      return {
        ...prev,
        [fileId]: newFileSections,
      }
    })
  }

  const updateFieldValue = (fileId: string, path: string, value: any) => {
    setFiles((prev: UploadedFile[]) => {
      return prev.map((file): UploadedFile => {
        if (file.id === fileId) {
          // Create a deep copy of the edited data
          const editedData = JSON.parse(JSON.stringify(file.editedData || {}))

          // Split the path into parts
          const pathParts = path.split(".")

          // Navigate to the correct object
          let current = editedData
          for (let i = 0; i < pathParts.length - 1; i++) {
            const part = pathParts[i]

            // Handle array indices
            if (part.includes("[") && part.includes("]")) {
              const arrayName = part.substring(0, part.indexOf("["))
              const index = Number.parseInt(part.substring(part.indexOf("[") + 1, part.indexOf("]")))

              if (!current[arrayName]) current[arrayName] = []
              if (!current[arrayName][index]) current[arrayName][index] = {}

              current = current[arrayName][index]
            } else {
              if (!current[part]) current[part] = {}
              current = current[part]
            }
          }

          // Set the value
          const lastPart = pathParts[pathParts.length - 1]

          // Handle array indices in the last part
          if (lastPart.includes("[") && lastPart.includes("]")) {
            const arrayName = lastPart.substring(0, lastPart.indexOf("["))
            const index = Number.parseInt(lastPart.substring(lastPart.indexOf("[") + 1, lastPart.indexOf("]")))

            if (!current[arrayName]) current[arrayName] = []
            current[arrayName][index] = value
          } else {
            current[lastPart] = value
          }

          // Special handling for name field to ensure it matches owner
          // if (path === "name" && ownerName && value !== ownerName) {
          //   setError("Document name must match the owner name")
          // } else if (path === "name" && ownerName && value === ownerName) {
          //   setError(null)
          // }

          return {
            ...file,
            editedData,
          }
        }
        return file
      })
    })
  }

  const deleteField = (fileId: string, path: string) => {
    setFiles((prev: UploadedFile[]) => {
      return prev.map((file): UploadedFile => {
        if (file.id === fileId) {
          // Create a deep copy of the edited data
          const editedData = JSON.parse(JSON.stringify(file.editedData || {}))

          // Split the path into parts
          const pathParts = path.split(".")

          // Special case: don't allow deleting the name field if it matches owner
          if (pathParts.length === 1 && pathParts[0] === "name" ) {
            setError("Cannot delete the name field as it's required for document validation")
            return file
          }

          // Navigate to the parent object
          let current = editedData
          for (let i = 0; i < pathParts.length - 1; i++) {
            const part = pathParts[i]

            // Handle array indices
            if (part.includes("[") && part.includes("]")) {
              const arrayName = part.substring(0, part.indexOf("["))
              const index = Number.parseInt(part.substring(part.indexOf("[") + 1, part.indexOf("]")))

              if (!current[arrayName] || !current[arrayName][index]) {
                // Path doesn't exist, nothing to delete
                return file
              }

              current = current[arrayName][index]
            } else {
              if (!current[part]) {
                // Path doesn't exist, nothing to delete
                return file
              }
              current = current[part]
            }
          }

          // Delete the field
          const lastPart = pathParts[pathParts.length - 1]

          // Handle array indices in the last part
          if (lastPart.includes("[") && lastPart.includes("]")) {
            const arrayName = lastPart.substring(0, lastPart.indexOf("["))
            const index = Number.parseInt(lastPart.substring(lastPart.indexOf("[") + 1, lastPart.indexOf("]")))

            if (current[arrayName] && Array.isArray(current[arrayName])) {
              current[arrayName].splice(index, 1)
            }
          } else {
            delete current[lastPart]
          }

          return {
            ...file,
            editedData,
          }
        }
        return file
      })
    })

    // Clear delete confirmation
    setDeleteConfirm(null)
  }

  const showAddFieldForm = (path = "") => {
    setAddingToPath(path)
    setShowAddForm(true)
    setNewObj({ key: "", value: "" })
    setError(null)
  }

  const hideAddFieldForm = () => {
    setShowAddForm(false)
    setAddingToPath(null)
    setNewObj({ key: "", value: "" })
    setError(null)
  }

  const handleNewObjChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNewObj((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Clear error when typing
    if (error) setError(null)
  }

  const saveNewField = (fileId: string) => {
    // Validate key is not empty
    if (!newObj.key.trim()) {
      setError("Field name cannot be empty")
      return
    }

    // Validate key format (alphanumeric, underscores)
    if (!/^[a-zA-Z0-9_]+$/.test(newObj.key)) {
      setError("Field name can only contain letters, numbers, and underscores")
      return
    }

    // Special handling for name field
    // if (newObj.key === "name" && ownerName && newObj.value !== ownerName) {
    //   setError("Document name must match the owner name")
    //   return
    // }

    setFiles((prev: UploadedFile[]) => {
      return prev.map((file): UploadedFile => {
        if (file.id === fileId) {
          const editedData = JSON.parse(JSON.stringify(file.editedData || {}))

          // If we're adding to a specific path
          if (addingToPath) {
            const pathParts = addingToPath.split(".")
            let current = editedData

            // Navigate to the correct object
            for (let i = 0; i < pathParts.length; i++) {
              const part = pathParts[i]

              // Handle array indices
              if (part.includes("[") && part.includes("]")) {
                const arrayName = part.substring(0, part.indexOf("["))
                const index = Number.parseInt(part.substring(part.indexOf("[") + 1, part.indexOf("]")))

                if (!current[arrayName]) current[arrayName] = []
                if (!current[arrayName][index]) current[arrayName][index] = {}

                current = current[arrayName][index]
              } else {
                if (!current[part]) current[part] = {}
                current = current[part]
              }
            }

            // Add the new field to the current object
            current[newObj.key] = newObj.value
          } else {
            // Add to root level
            editedData[newObj.key] = newObj.value
          }

          return {
            ...file,
            editedData,
          }
        }
        return file
      })
    })

    // Reset form
    hideAddFieldForm()
  }

const renderExtractedData = (fileId: string, data: any, path = "", level = 0) => {
    if (!data || Object.keys(data).length === 0) {
      return <p className="text-sm text-muted-foreground">No data extracted</p>
    }

 
    const fileExpandedSections = expandedSections[fileId] || new Set()
    const fileEditableFields = editableFields[fileId] || new Set()

    return (
      <div className="space-y-2 text-sm" style={{ marginLeft: level > 0 ? `${level * 12}px` : "0" }}>
        {Object.entries(data).map(([key, value]) => {
          // Skip rendering if value is null or undefined
          // if (value === null || value === undefined) return null
          
           value = value ==null ? 'null': value

          const currentPath = path ? `${path}.${key}` : key
          const isExpanded = fileExpandedSections.has(currentPath)
          const isEditable = fileEditableFields.has(currentPath)
          // const isNameField = key === "name"
          // const isProtected = isNameField && ownerName

          // Handle arrays
          if (Array.isArray(value)) {
            return (
              <div key={currentPath} className="space-y-1">
                <div className="flex items-center justify-between hover:bg-muted/50 p-1 rounded group">
                  <div
                    className="flex items-center cursor-pointer flex-1"
                    onClick={() => toggleSection(fileId, currentPath)}
                  >
                    {isExpanded ? (
                      <ChevronDown className="h-4 w-4 mr-1 text-muted-foreground" />
                    ) : (
                      <ChevronRight className="h-4 w-4 mr-1 text-muted-foreground" />
                    )}
                    <span className="font-medium text-muted-foreground">{key.replace(/_/g, " ")}:</span>
                    <span className="ml-2 text-muted-foreground">[{value.length} items]</span>
                  </div>

                  <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0"
                            onClick={() => showAddFieldForm(currentPath)}
                          >
                            <Plus className="h-3.5 w-3.5 text-primary" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Add item to array</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    {(
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0 text-destructive"
                              onClick={() => setDeleteConfirm(currentPath)}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Delete array</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )} 
                  </div>
                </div>

                {deleteConfirm === currentPath && (
                  <Alert variant="destructive" className="mt-2 py-2">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="flex items-center justify-between">
                      <span>Delete this array?</span>
                      <div>
                        <Button
                          variant="destructive"
                          size="sm"
                          className="h-7 mr-2"
                          onClick={() => deleteField(fileId, currentPath)}
                        >
                          Delete
                        </Button>
                        <Button variant="outline" size="sm" className="h-7" onClick={() => setDeleteConfirm(null)}>
                          Cancel
                        </Button>
                      </div>
                    </AlertDescription>
                  </Alert>
                )}

                {isExpanded && (
                  <div className="pl-4 border-l-2 border-muted mt-1">
                    {value.map((item, index) => {
                      const itemPath = `${currentPath}[${index}]`

                      if (typeof item === "object" && item !== null) {
                        return (
                          <div key={itemPath} className="mt-1">
                            <div className="flex items-center justify-between group">
                              <div className="font-medium text-muted-foreground mb-1">Item {index + 1}:</div>
                              <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-6 w-6 p-0 text-destructive"
                                        onClick={() => setDeleteConfirm(itemPath)}
                                      >
                                        <Trash2 className="h-3.5 w-3.5" />
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>Delete item</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              </div>
                            </div>

                            {deleteConfirm === itemPath && (
                              <Alert variant="destructive" className="mt-2 py-2">
                                <AlertCircle className="h-4 w-4" />
                                <AlertDescription className="flex items-center justify-between">
                                  <span>Delete this item?</span>
                                  <div>
                                    <Button
                                      variant="destructive"
                                      size="sm"
                                      className="h-7 mr-2"
                                      onClick={() => deleteField(fileId, itemPath)}
                                    >
                                      Delete
                                    </Button>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="h-7"
                                      onClick={() => setDeleteConfirm(null)}
                                    >
                                      Cancel
                                    </Button>
                                  </div>
                                </AlertDescription>
                              </Alert>
                            )}

                            {renderExtractedData(fileId, item, itemPath, level + 1)}
                          </div>
                        )
                      }

                      return (
                        <div key={itemPath} className="grid grid-cols-2 gap-2 mt-1 group">
                          <span className="font-medium text-muted-foreground">Item {index + 1}:</span>
                          <div className="flex items-center">
                            {isEditable ? (
                              <Input
                                value={String(item)}
                                onChange={(e) => updateFieldValue(fileId, itemPath, e.target.value)}
                                className="h-7 py-1"
                                onBlur={() => toggleEditable(fileId, itemPath)}
                                autoFocus
                              />
                            ) : (
                              <span
                                className="cursor-pointer hover:bg-muted/50 p-1 rounded flex-1"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  toggleEditable(fileId, itemPath)
                                }}
                              >
                                {String(item)}
                              </span>
                            )}

                            <div className="flex opacity-0 group-hover:opacity-100 transition-opacity">
                              
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0 ml-1"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  toggleEditable(fileId, itemPath)
                                }}
                              >
                                <Edit className="h-3 w-3" />
                              </Button>

                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0 text-destructive"
                                onClick={() => setDeleteConfirm(itemPath)}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>

                          {deleteConfirm === itemPath && (
                            <Alert variant="destructive" className="col-span-2 mt-2 py-2">
                              <AlertCircle className="h-4 w-4" />
                              <AlertDescription className="flex items-center justify-between">
                                <span>Delete this item?</span>
                                <div>
                                  <Button
                                    variant="destructive"
                                    size="sm"
                                    className="h-7 mr-2"
                                    onClick={() => deleteField(fileId, itemPath)}
                                  >
                                    Delete
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-7"
                                    onClick={() => setDeleteConfirm(null)}
                                  >
                                    Cancel
                                  </Button>
                                </div>
                              </AlertDescription>
                            </Alert>
                          )}
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          }

          // Handle nested objects
          if (typeof value === "object"  && value !== null) {
            return (
              <div key={currentPath} className="space-y-1">
                <div className="flex items-center justify-between hover:bg-muted/50 p-1 rounded group">
                  <div
                    className="flex items-center cursor-pointer flex-1"
                    onClick={() => toggleSection(fileId, currentPath)}
                  >
                    {isExpanded ? (
                      <ChevronDown className="h-4 w-4 mr-1 text-muted-foreground" />
                    ) : (
                      <ChevronRight className="h-4 w-4 mr-1 text-muted-foreground" />
                    )}
                    <span className="font-medium text-muted-foreground">{key.replace(/_/g, " ")}</span>
                  </div>

                  <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0"
                            onClick={() => showAddFieldForm(currentPath)}
                          >
                            <Plus className="h-3.5 w-3.5 text-primary" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Add field to object</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    { (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0 text-destructive"
                              onClick={() => setDeleteConfirm(currentPath)}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Delete object</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                  </div>
                </div>

                {deleteConfirm === currentPath && (
                  <Alert variant="destructive" className="mt-2 py-2">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="flex items-center justify-between">
                      <span>Delete this object?</span>
                      <div>
                        <Button
                          variant="destructive"
                          size="sm"
                          className="h-7 mr-2"
                          onClick={() => deleteField(fileId, currentPath)}
                        >
                          Delete
                        </Button>
                        <Button variant="outline" size="sm" className="h-7" onClick={() => setDeleteConfirm(null)}>
                          Cancel
                        </Button>
                      </div>
                    </AlertDescription>
                  </Alert>
                )}

                {isExpanded && (
                  <div className="pl-4 border-l-2 border-muted mt-1">
                    {renderExtractedData(fileId, value, currentPath, level + 1)}
                  </div>
                )}
              </div>
            )
          }

          // Handle primitive values (strings, numbers, booleans)
          return (
            <div key={currentPath} className="grid grid-cols-2 gap-2 items-center group hover:bg-muted/30 p-1 rounded">
              <span className="font-medium text-muted-foreground flex items-center">
                {key.replace(/_/g, " ")}:
              
              </span>
              <div className="flex items-center">
                {isEditable ? (
                  <Input
                    value={String(value)}
                    onChange={(e) => updateFieldValue(fileId, currentPath, e.target.value)}
                    className="h-7 py-1"
                    onBlur={() => toggleEditable(fileId, currentPath)}
                    autoFocus
                    
                  />
                ) : (
                  <span
                    className={`cursor-pointer hover:bg-muted/50 p-1 rounded flex-1 ${ ''}`}
                    onClick={() => toggleEditable(fileId, currentPath)}
                  >
                    {String(value)}
                  </span>
                )}

                <div className="flex opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 ml-1"
                    onClick={() => toggleEditable(fileId, currentPath)}
                   
                  >
                    <Edit className="h-3 w-3" />
                  </Button>

                  {names &&(key === "name" || key === "document_type") && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger >
                          <Select
                            onValueChange={(selectedValue) => {
                    
                              updateFieldValue(fileId, currentPath, selectedValue)
                           
                            }}
                          >
                            <SelectTrigger >
                              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                <User className="h-3 w-3 text-primary" />
                              </Button>
                            </SelectTrigger>
                            <SelectContent>
                            {(key === "name" ? names : documents)?.map((item) => (
                <SelectItem key={item} value={item}>
                  {item}
                </SelectItem>
              ))}
                            </SelectContent>
                          </Select>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Select a contact</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                  


                  {(
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 text-destructive"
                      onClick={() => setDeleteConfirm(currentPath)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              </div>

              {deleteConfirm === currentPath && (
                <Alert variant="destructive" className="col-span-2 mt-2 py-2">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="flex items-center justify-between">
                    <span>Delete this field?</span>
                    <div>
                      <Button
                        variant="destructive"
                        size="sm"
                        className="h-7 mr-2"
                        onClick={() => deleteField(fileId, currentPath)}
                      >
                        Delete
                      </Button>
                      <Button variant="outline" size="sm" className="h-7" onClick={() => setDeleteConfirm(null)}>
                        Cancel
                      </Button>
                    </div>
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Error message for name validation */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Add field form */}
      {showAddForm ? (
        <Card className="border-primary/50 bg-primary/5 mb-4">
          <CardContent className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">Add New Field {addingToPath ? `to ${addingToPath}` : ""}</h3>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={hideAddFieldForm}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="key">Field Name</Label>
                <Input
                  id="key"
                  name="key"
                  value={newObj.key}
                  onChange={handleNewObjChange}
                  placeholder="Enter field name"
                  className="h-8"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="value">Field Value</Label>
                <Input
                  id="value"
                  name="value"
                  value={newObj.value}
                  onChange={handleNewObjChange}
                  placeholder="Enter field value"
                  className="h-8"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Button variant="outline" size="sm" className="mr-2" onClick={hideAddFieldForm}>
                Cancel
              </Button>
              <Button variant="secondary" size="sm" onClick={() => saveNewField(fileID)}>
                <Save className="h-3.5 w-3.5 mr-1" />
                Save Field
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="flex items-center mb-4">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center" onClick={() => showAddFieldForm()}>
                  <Plus className="h-3.5 w-3.5 mr-1.5" />
                  Add New Field
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Add a new field to the document</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      )}

      {/* Render JSON data */}
      {renderExtractedData(fileID, Data)}
    </div>
  )
}

export default RenderJson

