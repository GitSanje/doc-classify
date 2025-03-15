
// "use client"

// import type React from "react"

// import { useEffect, useRef, useState } from "react"
// import {
//   RotateCw,
//   RotateCcw,
//   ZoomIn,
//   ZoomOut,
//   FlipHorizontal,
//   FlipVertical,
//   Move,
//   ArrowUp,
//   ArrowDown,
//   ArrowLeft,
//   ArrowRight,
//   Maximize2,
// } from "lucide-react"

// import { Button } from "@/components/ui/button"
// import { Slider } from "./ui/slider"
// import { cn } from "@/lib/utils"

// export function DocumentPreview({ file }: { file: File }) {
//   const [rotation, setRotation] = useState(0)
//   const [flipH, setFlipH] = useState(false)
//   const [flipV, setFlipV] = useState(false)
//   const [zoom, setZoom] = useState(100)
//   const [position, setPosition] = useState({ x: 0, y: 0 })
//   const [isDragging, setIsDragging] = useState(false)
//   const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
//   const [showMinimap, setShowMinimap] = useState(false)

//   const containerRef = useRef<HTMLDivElement>(null)
//   const imageRef = useRef<HTMLImageElement>(null)
//   const minimapRef = useRef<HTMLDivElement>(null)

//   // Reset transformations when a new file is selected
//   useEffect(() => {
//     setRotation(0)
//     setFlipH(false)
//     setFlipV(false)
//     setZoom(100)
//     setPosition({ x: 0, y: 0 })
//   }, [file.name])

//   // Show minimap when zoom is greater than 100%
//   useEffect(() => {
//     setShowMinimap(zoom > 100)
//   }, [zoom])

//   const rotateClockwise = () => {
//     setRotation((prev) => (prev + 90) % 360)
//     // Reset position when rotating
//     setPosition({ x: 0, y: 0 })
//   }

//   const rotateCounterClockwise = () => {
//     setRotation((prev) => (prev - 90 + 360) % 360)
//     // Reset position when rotating
//     setPosition({ x: 0, y: 0 })
//   }

//   const toggleFlipHorizontal = () => {
//     setFlipH((prev) => !prev)
//   }

//   const toggleFlipVertical = () => {
//     setFlipV((prev) => !prev)
//   }

//   const handleZoomChange = (value: number[]) => {
//     const newZoom = value[0]

//     // If zooming out, gradually reset position to center
//     if (newZoom < zoom) {
//       const factor = newZoom / zoom
//       setPosition((prev) => ({
//         x: prev.x * factor,
//         y: prev.y * factor,
//       }))
//     }

//     setZoom(newZoom)
//   }

//   const resetTransformations = () => {
//     setRotation(0)
//     setFlipH(false)
//     setFlipV(false)
//     setZoom(100)
//     setPosition({ x: 0, y: 0 })
//   }

//   const getTransformStyle = () => {
//     let transform = `rotate(${rotation}deg)`
//     if (flipH) transform += " scaleX(-1)"
//     if (flipV) transform += " scaleY(-1)"
//     return transform
//   }

//   // Handle mouse down for dragging
//   const handleMouseDown = (e: React.MouseEvent) => {
//     if (zoom <= 100) return // Only enable dragging when zoomed in

//     setIsDragging(true)
//     setDragStart({
//       x: e.clientX - position.x,
//       y: e.clientY - position.y,
//     })
//   }

//   // Handle mouse move for dragging
//   const handleMouseMove = (e: React.MouseEvent) => {
//     if (!isDragging) return

//     const newX = e.clientX - dragStart.x
//     const newY = e.clientY - dragStart.y

//     // Calculate bounds to prevent dragging beyond image edges
//     const containerWidth = containerRef.current?.clientWidth || 0
//     const containerHeight = containerRef.current?.clientHeight || 0
//     const imageWidth = (imageRef.current?.naturalWidth || 0) * (zoom / 100)
//     const imageHeight = (imageRef.current?.naturalHeight || 0) * (zoom / 100)

//     // Calculate maximum drag distances
//     const maxX = Math.max(0, (imageWidth - containerWidth) / 2)
//     const maxY = Math.max(0, (imageHeight - containerHeight) / 2)

//     // Constrain position within bounds
//     const boundedX = Math.max(-maxX, Math.min(maxX, newX))
//     const boundedY = Math.max(-maxY, Math.min(maxY, newY))

//     setPosition({ x: boundedX, y: boundedY })
//   }

//   // Handle mouse up to end dragging
//   const handleMouseUp = () => {
//     setIsDragging(false)
//   }

//   // Handle mouse leave to end dragging
//   const handleMouseLeave = () => {
//     setIsDragging(false)
//   }

//   // Move image in a specific direction
//   const moveImage = (direction: "up" | "down" | "left" | "right") => {
//     const step = 50 // Pixels to move per click

//     setPosition((prev) => {
//       let newX = prev.x
//       let newY = prev.y

//       switch (direction) {
//         case "up":
//           newY = prev.y + step
//           break
//         case "down":
//           newY = prev.y - step
//           break
//         case "left":
//           newX = prev.x + step
//           break
//         case "right":
//           newX = prev.x - step
//           break
//       }

//       // Calculate bounds to prevent moving beyond image edges
//       const containerWidth = containerRef.current?.clientWidth || 0
//       const containerHeight = containerRef.current?.clientHeight || 0
//       const imageWidth = (imageRef.current?.naturalWidth || 0) * (zoom / 100)
//       const imageHeight = (imageRef.current?.naturalHeight || 0) * (zoom / 100)

//       // Calculate maximum drag distances
//       const maxX = Math.max(0, (imageWidth - containerWidth) / 2)
//       const maxY = Math.max(0, (imageHeight - containerHeight) / 2)

//       // Constrain position within bounds
//       const boundedX = Math.max(-maxX, Math.min(maxX, newX))
//       const boundedY = Math.max(-maxY, Math.min(maxY, newY))

//       return { x: boundedX, y: boundedY }
//     })
//   }

//   // Center the image
//   const centerImage = () => {
//     setPosition({ x: 0, y: 0 })
//   }

//   // Calculate the visible area for the minimap
//   const getVisibleAreaStyle = () => {
//     if (!containerRef.current || !imageRef.current) return {}

//     const containerWidth = containerRef.current.clientWidth
//     const containerHeight = containerRef.current.clientHeight
//     const imageWidth = imageRef.current.naturalWidth * (zoom / 100)
//     const imageHeight = imageRef.current.naturalHeight * (zoom / 100)

//     // Calculate the percentage of the image that is visible
//     const visibleWidthPercent = Math.min(100, (containerWidth / imageWidth) * 100)
//     const visibleHeightPercent = Math.min(100, (containerHeight / imageHeight) * 100)

//     // Calculate the position of the visible area in the minimap
//     const posXPercent = 50 + (position.x / (imageWidth / 2)) * 50
//     const posYPercent = 50 + (position.y / (imageHeight / 2)) * 50

//     return {
//       width: `${visibleWidthPercent}%`,
//       height: `${visibleHeightPercent}%`,
//       left: `${posXPercent - visibleWidthPercent / 2}%`,
//       top: `${posYPercent - visibleHeightPercent / 2}%`,
//     }
//   }

//   return (
//     <div className="space-y-4">
//       <div className="relative aspect-[4/3] w-full rounded-lg border">
//         {file ? (
//           <div className="h-full w-full flex gap-2 flex-col items-center">
//             <div
//               ref={containerRef}
//               className="relative h-full w-full flex flex-grow items-center justify-center overflow-hidden"
//               onMouseDown={handleMouseDown}
//               onMouseMove={handleMouseMove}
//               onMouseUp={handleMouseUp}
//               onMouseLeave={handleMouseLeave}
//               style={{ cursor: zoom > 100 ? (isDragging ? "grabbing" : "grab") : "default" }}
//             >
//               <img
//                 ref={imageRef}
//                 src={URL.createObjectURL(file) || "/placeholder.svg"}
//                 alt={file.name}
//                 className="max-h-full max-w-full object-contain transition-transform duration-200"
//                 style={{
//                   transform: `${getTransformStyle()} translate(${position.x}px, ${position.y}px)`,
//                   scale: `${zoom / 100}`,
//                   transformOrigin: "center",
//                 }}
//                 draggable={false}
//               />

//               {/* Navigation overlay - only visible when zoomed in */}
//               {zoom > 100 && (
//                 <div className="absolute bottom-2 right-2 bg-background/80 backdrop-blur-sm rounded-lg p-1 shadow-md">
//                   <div className="grid grid-cols-3 gap-1">
//                     <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => moveImage("up")}>
//                       <ArrowUp className="h-4 w-4" />
//                     </Button>
//                     <Button variant="ghost" size="icon" className="h-8 w-8" onClick={centerImage}>
//                       <Maximize2 className="h-4 w-4" />
//                     </Button>
//                     <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => moveImage("down")}>
//                       <ArrowDown className="h-4 w-4" />
//                     </Button>
//                     <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => moveImage("left")}>
//                       <ArrowLeft className="h-4 w-4" />
//                     </Button>
//                     <Button
//                       variant="ghost"
//                       size="icon"
//                       className="h-8 w-8"
//                       onClick={() => setShowMinimap((prev) => !prev)}
//                     >
//                       <Move className="h-4 w-4" />
//                     </Button>
//                     <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => moveImage("right")}>
//                       <ArrowRight className="h-4 w-4" />
//                     </Button>
//                   </div>
//                 </div>
//               )}

//               {/* Minimap - only visible when zoomed in and enabled */}
//               {showMinimap && zoom > 100 && (
//                 <div
//                   ref={minimapRef}
//                   className="absolute top-2 right-2 w-[100px] h-[75px] bg-background/80 backdrop-blur-sm rounded-lg border shadow-md overflow-hidden"
//                 >
//                   <img
//                     src={URL.createObjectURL(file) || "/placeholder.svg"}
//                     alt="Minimap"
//                     className="w-full h-full object-contain opacity-70"
//                     style={{
//                       transform: getTransformStyle(),
//                     }}
//                   />
//                   <div className="absolute border-2 border-primary pointer-events-none" style={getVisibleAreaStyle()} />
//                 </div>
//               )}
//             </div>

//             <div className="flex flex-wrap gap-2 justify-between">
//               <div className="flex flex-wrap gap-2">
//                 <Button variant="outline" size="sm" onClick={rotateCounterClockwise} title="Rotate counter-clockwise">
//                   <RotateCcw className="h-4 w-4" />
//                 </Button>
//                 <Button variant="outline" size="sm" onClick={rotateClockwise} title="Rotate clockwise">
//                   <RotateCw className="h-4 w-4" />
//                 </Button>
//                 <Button
//                   variant="outline"
//                   size="sm"
//                   onClick={toggleFlipHorizontal}
//                   title="Flip horizontally"
//                   className={flipH ? "bg-muted" : ""}
//                 >
//                   <FlipHorizontal className="h-4 w-4" />
//                 </Button>
//                 <Button
//                   variant="outline"
//                   size="sm"
//                   onClick={toggleFlipVertical}
//                   title="Flip vertically"
//                   className={flipV ? "bg-muted" : ""}
//                 >
//                   <FlipVertical className="h-4 w-4" />
//                 </Button>
//                 <Button variant="outline" size="sm" onClick={resetTransformations} title="Reset transformations">
//                   Reset
//                 </Button>
//               </div>
//             </div>

//             <div className="flex items-center gap-4 w-full">
//               <ZoomOut
//                 className={cn(
//                   "h-5 w-5 flex-shrink-0",
//                   zoom <= 50 ? "text-muted-foreground/40" : "text-muted-foreground cursor-pointer",
//                 )}
//                 onClick={() => zoom > 50 && setZoom((prev) => Math.max(50, prev - 10))}
//               />
//               <Slider value={[zoom]} min={50} max={400} step={10} onValueChange={handleZoomChange} className="flex-1" />
//               <ZoomIn
//                 className={cn(
//                   "h-5 w-5 flex-shrink-0",
//                   zoom >= 400 ? "text-muted-foreground/40" : "text-muted-foreground cursor-pointer",
//                 )}
//                 onClick={() => zoom < 400 && setZoom((prev) => Math.min(400, prev + 10))}
//               />
//               <span className="text-sm text-muted-foreground w-16 text-right">{zoom}%</span>
//             </div>
//           </div>
//         ) : (
//           <div className="flex h-full items-center justify-center bg-muted">
//             <p className="text-muted-foreground">No preview available</p>
//           </div>
//         )}
//       </div>
//     </div>
//   )
// }


"use client";

import { useEffect, useRef, useState } from "react";
import { 
  RotateCw, RotateCcw, ZoomIn, ZoomOut, Maximize, Minimize, 
  FlipHorizontal, FlipVertical, Download, ChevronLeft, ChevronRight,
  ChevronUp, ChevronDown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "./ui/slider";

export function DocumentPreview({ file }: { file: File }) {
  const [rotation, setRotation] = useState(0);
  const [flipH, setFlipH] = useState(false);
  const [flipV, setFlipV] = useState(false);
  const [zoom, setZoom] = useState(100);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const imageContainerRef = useRef<HTMLDivElement>(null);

  // Reset transformations when a new file is selected
  useEffect(() => {
    setRotation(0);
    setFlipH(false);
    setFlipV(false);
    setZoom(100);
    setPosition({ x: 0, y: 0 });
  }, [file.name]);

  const rotateClockwise = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const rotateCounterClockwise = () => {
    setRotation((prev) => (prev - 90 + 360) % 360);
  };

  const toggleFlipHorizontal = () => {
    setFlipH((prev) => !prev);
  };

  const toggleFlipVertical = () => {
    setFlipV((prev) => !prev);
  };

  const handleZoomChange = (value: number[]) => {
    setZoom(value[0]);
    // Reset position when zooming out to prevent getting lost
    if (value[0] < zoom) {
      setPosition({ x: 0, y: 0 });
    }
  };

  const resetTransformations = () => {
    setRotation(0);
    setFlipH(false);
    setFlipV(false);
    setZoom(100);
    setPosition({ x: 0, y: 0 });
  };

  const getTransformStyle = () => {
    let transform = `rotate(${rotation}deg)`;
    if (flipH) transform += " scaleX(-1)";
    if (flipV) transform += " scaleY(-1)";
    return transform;
  };

  // Navigation functions
  const moveLeft = () => {
    setPosition(prev => ({ ...prev, x: prev.x + 50 }));
  };

  const moveRight = () => {
    setPosition(prev => ({ ...prev, x: prev.x - 50 }));
  };

  const moveUp = () => {
    setPosition(prev => ({ ...prev, y: prev.y + 50 }));
  };

  const moveDown = () => {
    setPosition(prev => ({ ...prev, y: prev.y - 50 }));
  };

  return (
    <div className="space-y-4">
      <div className="aspect-[4/3] w-full rounded-lg border relative">
        {file ? (
          <div className="h-full w-full flex gap-2 flex-col items-center">
            <div
              // ref={imageContainerRef}
              className="relative h-full w-full flex flex-grow items-center justify-center overflow-hidden"
            >
              <img
                src={URL.createObjectURL(file) || "/placeholder.svg"}
                alt={file.name}
                className="max-h-full max-w-full object-contain transition-transform duration-200"
                style={{
                  transform: getTransformStyle(),
                  scale: `${zoom / 100}`,
                  translate: `${position.x}px ${position.y}px`,
                }}
              />
            </div>

            {/* Navigation Controls (visible only when zoomed) */}
            {zoom > 100 && (
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/2 left-4 transform -translate-y-1/2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={moveLeft}
                    className="pointer-events-auto opacity-70 hover:opacity-100"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                </div>
                <div className="absolute top-1/2 right-4 transform -translate-y-1/2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={moveRight}
                    className="pointer-events-auto opacity-70 hover:opacity-100"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
                <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={moveUp}
                    className="pointer-events-auto opacity-70 hover:opacity-100"
                  >
                    <ChevronUp className="h-4 w-4" />
                  </Button>
                </div>
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={moveDown}
                    className="pointer-events-auto opacity-70 hover:opacity-100"
                  >
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            <div className="flex flex-wrap gap-2 justify-between">
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={rotateCounterClockwise}
                  title="Rotate counter-clockwise"
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={rotateClockwise}
                  title="Rotate clockwise"
                >
                  <RotateCw className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={toggleFlipHorizontal}
                  title="Flip horizontally"
                  className={flipH ? "bg-muted" : ""}
                >
                  <FlipHorizontal className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={toggleFlipVertical}
                  title="Flip vertically"
                  className={flipV ? "bg-muted" : ""}
                >
                  <FlipVertical className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={resetTransformations}
                  title="Reset transformations"
                >
                  Reset
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-4 w-full">
              <ZoomOut className="h-5 w-5 text-muted-foreground flex-shrink-0" />
              <Slider value={[zoom]} min={50} max={200} step={5} onValueChange={handleZoomChange} className="flex-1" />
              <ZoomIn className="h-5 w-5 text-muted-foreground flex-shrink-0" />
              <span className="text-sm text-muted-foreground w-16 text-right">{zoom}%</span>
            </div>
          </div>
        ) : (
          <div className="flex h-full items-center justify-center bg-muted">
            <p className="text-muted-foreground">No preview available</p>
          </div>
        )}
      </div>
    </div>
  );
}