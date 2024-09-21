import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Download, Maximize2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

interface ImageData {
  filePath: string;
  fileName: string;
}

export default function GroupRoute() {
  const [images, setImages] = useState<ImageData[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const { toast } = useToast();
  const groupId = useParams().groupId;

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/api/v1/images/${groupId}`
        );

        if (!response.ok) {
          toast({
            title: "Error",
            description: "Invalid group ID. Please try again.",
            variant: "destructive",
          });
        }

        const data = await response.json();
        setImages(data?.images || []);
      } catch (error) {
        console.error("Error fetching images:", error);
        toast({
          title: "Error",
          description: "Failed to load images. Please try again.",
          variant: "destructive",
        });
      }
    };
    fetchImages();
  }, [groupId, toast]);

  const handlePrevious = useCallback(() => {
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  }, [images.length]);

  const handleNext = useCallback(() => {
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  }, [images.length]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e?.key === "ArrowLeft") handlePrevious();
      if (e?.key === "ArrowRight") handleNext();
      if (e?.key === "Escape") setIsExpanded(false);
    },
    [handlePrevious, handleNext]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const downloadImage = async (url: string, fileName: string) => {
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "image/png",
        },
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = fileName; // Filename for the downloaded image
        document.body.appendChild(a);
        a.click();
        a.remove();
      } else {
        console.error("Failed to download image");
      }
    } catch (error) {
      console.error("Error downloading the image:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 flex flex-col items-center justify-center">
      <div className="text-5xl font-bold mb-8 text-gray-800 tracking-tight">
        Snap<span className="text-blue-600">Linkr</span>
      </div>
      {!!images?.length && (
        <Card className="w-full max-w-6xl bg-white shadow-lg">
          <CardContent className="p-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-700">
              Shared Images
            </h2>
            <p className="text-sm text-gray-500 mb-4">
              Use arrow keys to navigate between images. Click on an image to
              expand. Press ESC to close expanded view.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {images.map((image, index) => (
                <div key={index} className="relative group">
                  <img
                    src={image.filePath}
                    alt={`Image ${index + 1}`}
                    width={300}
                    height={300}
                    className="rounded-lg object-cover w-full h-48 cursor-pointer transition-opacity group-hover:opacity-75"
                    onClick={() => {
                      setCurrentImageIndex(index);
                      setIsExpanded(true);
                    }}
                  />
                  <Button
                    variant="secondary"
                    size="icon"
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => {
                      setCurrentImageIndex(index);
                      setIsExpanded(true);
                    }}
                  >
                    <Maximize2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
      <Dialog open={isExpanded} onOpenChange={setIsExpanded}>
        <DialogContent className="max-w-6xl w-full bg-white p-0">
          <DialogTitle></DialogTitle>
          <div>
            <img
              src={images[currentImageIndex]?.filePath || ""}
              alt={`Expanded image ${currentImageIndex + 1}`}
              width={1200}
              height={800}
              className="w-full h-auto object-contain"
            />
            <Button
              variant="outline"
              size="icon"
              className="absolute top-2 left-2"
              onClick={() =>
                downloadImage(
                  images[currentImageIndex].filePath,
                  images[currentImageIndex].fileName
                )
              }
            >
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
