import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  Camera,
  Grid3X3,
  LayoutList,
  Plus,
  Search,
  Upload,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

type Category = "Sports" | "Cultural" | "Academic" | "Infrastructure" | "Other";

interface Album {
  id: string;
  title: string;
  date: string;
  photoCount: number;
  category: Category;
  description: string;
  emoji: string;
  gradient: string;
}

const INITIAL_ALBUMS: Album[] = [
  {
    id: "a1",
    title: "Annual Day 2024",
    date: "2026-12-15",
    photoCount: 45,
    category: "Cultural",
    description:
      "Annual Day celebration with cultural programs and prize distribution.",
    emoji: "🎭",
    gradient: "from-purple-400 to-pink-500",
  },
  {
    id: "a2",
    title: "Sports Day",
    date: "2026-11-20",
    photoCount: 32,
    category: "Sports",
    description: "Annual sports meet with inter-house competitions.",
    emoji: "🏆",
    gradient: "from-orange-400 to-red-500",
  },
  {
    id: "a3",
    title: "Science Exhibition",
    date: "2026-10-05",
    photoCount: 18,
    category: "Academic",
    description: "Student science projects showcased to parents and guests.",
    emoji: "🔬",
    gradient: "from-blue-400 to-cyan-500",
  },
  {
    id: "a4",
    title: "Republic Day 2024",
    date: "2026-01-26",
    photoCount: 28,
    category: "Academic",
    description: "Republic Day flag hoisting and parade ceremony.",
    emoji: "🇮🇳",
    gradient: "from-green-400 to-emerald-500",
  },
  {
    id: "a5",
    title: "School Building",
    date: "2026-06-01",
    photoCount: 12,
    category: "Infrastructure",
    description: "Campus infrastructure and facilities.",
    emoji: "🏫",
    gradient: "from-slate-400 to-gray-500",
  },
];

const CATEGORIES: ("All" | Category)[] = [
  "All",
  "Sports",
  "Cultural",
  "Academic",
  "Infrastructure",
];
const CATEGORY_COLORS: Record<string, string> = {
  Sports:
    "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  Cultural:
    "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  Academic: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  Infrastructure:
    "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400",
  Other: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
};

export function GalleryPage() {
  const [albums, setAlbums] = useState<Album[]>(INITIAL_ALBUMS);
  const [activeAlbum, setActiveAlbum] = useState<Album | null>(null);
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState<"All" | Category>("All");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [createOpen, setCreateOpen] = useState(false);
  const [newAlbum, setNewAlbum] = useState({
    title: "",
    category: "Cultural" as Category,
    date: "",
    description: "",
  });

  const filtered = albums.filter((a) => {
    const matchSearch = a.title.toLowerCase().includes(search.toLowerCase());
    const matchCat = catFilter === "All" || a.category === catFilter;
    return matchSearch && matchCat;
  });

  function createAlbum() {
    if (!newAlbum.title) {
      toast.error("Album title is required");
      return;
    }
    const emojis = ["📸", "🖼️", "🎨", "✨", "🌟"];
    const grads = [
      "from-indigo-400 to-purple-500",
      "from-teal-400 to-green-500",
      "from-yellow-400 to-orange-500",
    ];
    setAlbums((prev) => [
      ...prev,
      {
        id: `a${Date.now()}`,
        ...newAlbum,
        photoCount: 0,
        emoji: emojis[Math.floor(Math.random() * emojis.length)],
        gradient: grads[Math.floor(Math.random() * grads.length)],
      },
    ]);
    setNewAlbum({ title: "", category: "Cultural", date: "", description: "" });
    setCreateOpen(false);
    toast.success("Album created successfully");
  }

  // Album detail view
  if (activeAlbum) {
    const photos = Array.from(
      { length: activeAlbum.photoCount || 8 },
      (_, i) => i,
    );
    const gradients = [
      "from-pink-300 to-rose-400",
      "from-blue-300 to-indigo-400",
      "from-green-300 to-teal-400",
      "from-yellow-300 to-orange-400",
      "from-purple-300 to-violet-400",
    ];
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setActiveAlbum(null)}
            data-ocid="gallery.back_button"
          >
            <ArrowLeft size={16} className="mr-1" />
            Back
          </Button>
          <div>
            <h1 className="text-xl font-bold">{activeAlbum.title}</h1>
            <p className="text-xs text-muted-foreground">
              {activeAlbum.date} · {activeAlbum.photoCount} photos
            </p>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <p className="text-sm text-muted-foreground">
            {activeAlbum.description}
          </p>
          <Button
            size="sm"
            onClick={() =>
              toast.info("Upload functionality requires backend integration")
            }
            data-ocid="gallery.upload_button"
          >
            <Upload size={14} className="mr-2" />
            Upload Photos
          </Button>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
          {photos.map((i) => (
            <div
              key={i}
              className={`aspect-square rounded-lg bg-gradient-to-br ${gradients[i % gradients.length]} flex items-center justify-center`}
              data-ocid={`gallery.item.${i + 1}`}
            >
              <Camera size={20} className="text-white/70" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Photo Gallery</h1>
          <p className="text-sm text-muted-foreground">
            School event albums and memories
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === "grid" ? "default" : "outline"}
            size="icon"
            onClick={() => setViewMode("grid")}
            data-ocid="gallery.grid.toggle"
          >
            <Grid3X3 size={16} />
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "outline"}
            size="icon"
            onClick={() => setViewMode("list")}
            data-ocid="gallery.list.toggle"
          >
            <LayoutList size={16} />
          </Button>
          <Dialog open={createOpen} onOpenChange={setCreateOpen}>
            <DialogTrigger asChild>
              <Button size="sm" data-ocid="gallery.open_modal_button">
                <Plus size={16} className="mr-1" />
                Create Album
              </Button>
            </DialogTrigger>
            <DialogContent data-ocid="gallery.dialog">
              <DialogHeader>
                <DialogTitle>Create New Album</DialogTitle>
              </DialogHeader>
              <div className="space-y-3">
                <div className="space-y-1">
                  <Label>Album Title</Label>
                  <Input
                    placeholder="e.g. Sports Day 2025"
                    value={newAlbum.title}
                    onChange={(e) =>
                      setNewAlbum((p) => ({ ...p, title: e.target.value }))
                    }
                    data-ocid="gallery.album_title.input"
                  />
                </div>
                <div className="space-y-1">
                  <Label>Category</Label>
                  <Select
                    value={newAlbum.category}
                    onValueChange={(v) =>
                      setNewAlbum((p) => ({ ...p, category: v as Category }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {(
                        [
                          "Sports",
                          "Cultural",
                          "Academic",
                          "Infrastructure",
                          "Other",
                        ] as Category[]
                      ).map((c) => (
                        <SelectItem key={c} value={c}>
                          {c}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label>Date</Label>
                  <Input
                    type="date"
                    value={newAlbum.date}
                    onChange={(e) =>
                      setNewAlbum((p) => ({ ...p, date: e.target.value }))
                    }
                  />
                </div>
                <div className="space-y-1">
                  <Label>Description</Label>
                  <Input
                    placeholder="Brief description..."
                    value={newAlbum.description}
                    onChange={(e) =>
                      setNewAlbum((p) => ({
                        ...p,
                        description: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setCreateOpen(false)}
                  data-ocid="gallery.cancel_button"
                >
                  Cancel
                </Button>
                <Button
                  onClick={createAlbum}
                  data-ocid="gallery.confirm_button"
                >
                  Create Album
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Search and filter */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-48">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            className="pl-9"
            placeholder="Search albums..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            data-ocid="gallery.search_input"
          />
        </div>
        <div className="flex gap-1 flex-wrap">
          {CATEGORIES.map((cat) => (
            <Button
              key={cat}
              size="sm"
              variant={catFilter === cat ? "default" : "outline"}
              onClick={() => setCatFilter(cat)}
              data-ocid={`gallery.${cat.toLowerCase()}.tab`}
            >
              {cat}
            </Button>
          ))}
        </div>
      </div>

      {/* Albums */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((album, i) => (
            <Card
              key={album.id}
              className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => setActiveAlbum(album)}
              data-ocid={`gallery.item.${i + 1}`}
            >
              <div
                className={`h-32 bg-gradient-to-br ${album.gradient} flex items-center justify-center`}
              >
                <span className="text-5xl">{album.emoji}</span>
              </div>
              <CardContent className="p-3">
                <h3 className="font-semibold text-sm truncate">
                  {album.title}
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {album.date} · {album.photoCount} photos
                </p>
                <Badge
                  className={`text-xs mt-1.5 ${CATEGORY_COLORS[album.category]}`}
                >
                  {album.category}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((album, i) => (
            <button
              type="button"
              key={album.id}
              className="w-full flex items-center gap-4 p-3 border rounded-lg cursor-pointer hover:bg-muted/40 transition-colors text-left"
              onClick={() => setActiveAlbum(album)}
              data-ocid={`gallery.item.${i + 1}`}
            >
              <div
                className={`w-14 h-14 rounded-lg bg-gradient-to-br ${album.gradient} flex items-center justify-center shrink-0`}
              >
                <span className="text-2xl">{album.emoji}</span>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm">{album.title}</h3>
                <p className="text-xs text-muted-foreground">
                  {album.description}
                </p>
              </div>
              <div className="text-right shrink-0">
                <Badge className={`text-xs ${CATEGORY_COLORS[album.category]}`}>
                  {album.category}
                </Badge>
                <p className="text-xs text-muted-foreground mt-1">
                  {album.photoCount} photos · {album.date}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}

      {filtered.length === 0 && (
        <div
          className="text-center py-16 text-muted-foreground"
          data-ocid="gallery.empty_state"
        >
          <Camera size={48} className="mx-auto mb-3 opacity-30" />
          <p>No albums found</p>
        </div>
      )}
    </div>
  );
}
