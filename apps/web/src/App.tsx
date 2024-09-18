import { useState, useRef, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import {
  X,
  Upload,
  Calendar,
  Link as LinkIcon,
  Image as ImageIcon,
  ExternalLink,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";

export default function HomeRoute() {
  const [images, setImages] = useState<File[]>([]);
  const [expiryDate, setExpiryDate] = useState("");
  const [generatedLink, setGeneratedLink] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Set default expiry date to next day at 11:59 PM
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(23, 59, 0, 0);
    setExpiryDate(tomorrow.toISOString().split("T")[0]);
  }, []);

  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (items) {
        const imageFiles = [];
        for (let i = 0; i < items.length; i++) {
          if (items[i].type.indexOf("image") !== -1) {
            const blob = items[i].getAsFile();
            if (blob) {
              imageFiles.push(blob);
            }
          }
        }
        addImages(imageFiles);
      }
    };

    window.addEventListener("paste", handlePaste);
    return () => window.removeEventListener("paste", handlePaste);
  }, []);

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    addImages(files);
  }, []);

  const addImages = (files: File[]) => {
    setGeneratedLink(""); // Reset generated link when new images are added
    const newImages = files.filter((file) => file.type.startsWith("image/"));
    const totalImages = images.length + newImages.length;
    const totalSize = [...images, ...newImages].reduce(
      (acc, file) => acc + file.size,
      0
    );

    if (totalImages > 10) {
      alert("You can only upload up to 10 images");
      return;
    }

    if (totalSize > 20 * 1024 * 1024) {
      alert("Total file size cannot exceed 20MB");
      return;
    }

    setImages((prev) => [...prev, ...newImages].slice(0, 10));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    addImages(files);
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const generateLink = async () => {
    const formData = new FormData();
    images.forEach((image, index) => {
      formData.append("images", image);
    });

    const expiryDateTime = new Date(expiryDate);
    expiryDateTime.setHours(23, 59, 0, 0);
    formData.append("expiryDate", expiryDateTime.toISOString());

    try {
      const response = await fetch("http://localhost:8080/api/v1/images", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      const groupId = data.data.id;
      const link = `${window.location.origin}/${groupId}`;
      setGeneratedLink(link);
      await navigator.clipboard.writeText(data.link);
    } catch (error) {
      console.error("Error generating link:", error);
      alert("Failed to generate link. Please try again.");
    }
  };

  const totalSize = images.reduce((acc, img) => acc + img.size, 0);
  const sizePercentage = (totalSize / (20 * 1024 * 1024)) * 100;

  return (
    <div className="min-h-screen bg-gray-50 p-8 flex flex-col items-center justify-center">
      <div className="text-5xl font-bold mb-8 text-gray-800 tracking-tight">
        Snap<span className="text-blue-600">Linkr</span>
      </div>
      <Card className="w-full max-w-4xl bg-white shadow-lg">
        <CardContent className="p-8">
          <div
            ref={dropZoneRef}
            className={`border-2 border-dashed rounded-lg p-6 mb-6 transition-colors ${
              isDragging
                ? "border-blue-400 bg-blue-50"
                : "border-gray-300 bg-gray-50"
            }`}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            {images.length > 0 ? (
              <div className="grid grid-cols-5 gap-4">
                {images.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={URL.createObjectURL(image)}
                      alt={`Uploaded image ${index + 1}`}
                      width={150}
                      height={150}
                      className="rounded-lg object-cover w-full h-24 transition-opacity group-hover:opacity-75"
                    />
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute top-1 right-1 w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => removeImage(index)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center">
                <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2 text-sm text-gray-600">
                  Drag and drop images here, or click to select files
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  You can also paste images directly into this page
                </p>
              </div>
            )}
            <div className="mt-4 flex justify-center">
              <Button
                onClick={() => fileInputRef.current?.click()}
                variant="outline"
              >
                <Upload className="mr-2 h-4 w-4" /> Choose Files
              </Button>
            </div>
            <Input
              id="file-upload"
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              ref={fileInputRef}
              onChange={handleFileChange}
            />
          </div>
          <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
            <span>{images.length}/10 images</span>
            <span>{(totalSize / (1024 * 1024)).toFixed(2)} MB / 20 MB</span>
          </div>
          <Progress value={sizePercentage} className="h-2 mb-6" />
          <div className="flex space-x-4 mb-6">
            <div className="flex-grow">
              <Label
                htmlFor="expiry-date"
                className="text-sm font-medium text-gray-700"
              >
                Expiry Date
              </Label>
              <div className="mt-1 flex items-center">
                <Calendar className="mr-2 h-5 w-5 text-gray-400" />
                <Input
                  id="expiry-date"
                  type="date"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  className="flex-grow"
                />
              </div>
            </div>
            <div className="flex items-end">
              <Button
                onClick={generateLink}
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <LinkIcon className="mr-2 h-5 w-5" /> Generate Link
              </Button>
            </div>
          </div>
          {generatedLink && (
            <div className="mt-6">
              <Label className="text-sm font-medium text-gray-700">
                Generated Link
              </Label>
              <div className="mt-1 flex">
                <Input
                  value={generatedLink}
                  readOnly
                  className="flex-grow text-sm"
                />
                <Button
                  onClick={() => navigator.clipboard.writeText(generatedLink)}
                  className="ml-2 bg-gray-100 text-gray-700 hover:bg-gray-200"
                >
                  Copy
                </Button>
                <Button
                  onClick={() => window.open(generatedLink, "_blank")}
                  className="ml-2 bg-blue-600 text-white hover:bg-blue-700"
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
