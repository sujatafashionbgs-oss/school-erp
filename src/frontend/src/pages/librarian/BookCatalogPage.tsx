import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useLoadingData } from "@/hooks/useLoadingData";
import { BookOpen, Edit, Plus, Search, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  category: string;
  totalCopies: number;
  availableCopies: number;
  addedDate: string;
}

const initialBooks: Book[] = [
  {
    id: "b1",
    title: "Physics for Class XII",
    author: "H.C. Verma",
    isbn: "978-81-2345-001",
    category: "Science",
    totalCopies: 15,
    availableCopies: 9,
    addedDate: "2023-06-01",
  },
  {
    id: "b2",
    title: "Mathematics Textbook X",
    author: "R.D. Sharma",
    isbn: "978-81-2345-002",
    category: "Math",
    totalCopies: 20,
    availableCopies: 14,
    addedDate: "2023-06-01",
  },
  {
    id: "b3",
    title: "Wings of Fire",
    author: "A.P.J. Abdul Kalam",
    isbn: "978-81-2345-003",
    category: "Literature",
    totalCopies: 8,
    availableCopies: 5,
    addedDate: "2023-07-10",
  },
  {
    id: "b4",
    title: "India: A History",
    author: "John Keay",
    isbn: "978-81-2345-004",
    category: "History",
    totalCopies: 6,
    availableCopies: 3,
    addedDate: "2023-08-15",
  },
  {
    id: "b5",
    title: "Biology NCERT XI",
    author: "NCERT",
    isbn: "978-81-2345-005",
    category: "Science",
    totalCopies: 18,
    availableCopies: 12,
    addedDate: "2023-06-01",
  },
  {
    id: "b6",
    title: "English Grammar",
    author: "Wren & Martin",
    isbn: "978-81-2345-006",
    category: "Literature",
    totalCopies: 12,
    availableCopies: 7,
    addedDate: "2023-06-01",
  },
  {
    id: "b7",
    title: "Chemistry Part I Class XII",
    author: "NCERT",
    isbn: "978-81-2345-007",
    category: "Science",
    totalCopies: 14,
    availableCopies: 0,
    addedDate: "2023-06-01",
  },
  {
    id: "b8",
    title: "Encyclopaedia Britannica",
    author: "Britannica",
    isbn: "978-81-2345-008",
    category: "Reference",
    totalCopies: 3,
    availableCopies: 3,
    addedDate: "2022-01-01",
  },
  {
    id: "b9",
    title: "Ancient Indian History",
    author: "Romila Thapar",
    isbn: "978-81-2345-009",
    category: "History",
    totalCopies: 5,
    availableCopies: 2,
    addedDate: "2023-09-01",
  },
  {
    id: "b10",
    title: "Algebra and Trigonometry",
    author: "S.L. Loney",
    isbn: "978-81-2345-010",
    category: "Math",
    totalCopies: 10,
    availableCopies: 6,
    addedDate: "2023-07-01",
  },
];

export function BookCatalogPage() {
  const [books, setBooks] = useState<Book[]>(initialBooks);
  const [search, setSearch] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [editBook, setEditBook] = useState<Book | null>(null);
  const [form, setForm] = useState({
    title: "",
    author: "",
    isbn: "",
    category: "",
    totalCopies: "",
  });
  const { loading } = useLoadingData(books);

  const filtered = books.filter(
    (b) =>
      b.title.toLowerCase().includes(search.toLowerCase()) ||
      b.author.toLowerCase().includes(search.toLowerCase()),
  );

  const totalAvailable = books.reduce((s, b) => s + b.availableCopies, 0);
  const totalIssued = books.reduce(
    (s, b) => s + (b.totalCopies - b.availableCopies),
    0,
  );

  const handleAdd = () => {
    if (!form.title || !form.author) {
      toast.error("Title and author are required");
      return;
    }
    const newBook: Book = {
      id: `b${Date.now()}`,
      title: form.title,
      author: form.author,
      isbn: form.isbn,
      category: form.category || "Reference",
      totalCopies: Number(form.totalCopies) || 1,
      availableCopies: Number(form.totalCopies) || 1,
      addedDate: new Date().toISOString().split("T")[0],
    };
    setBooks((prev) => [newBook, ...prev]);
    setForm({ title: "", author: "", isbn: "", category: "", totalCopies: "" });
    setShowAdd(false);
    toast.success(`"${form.title}" added to catalog`);
  };

  const handleDelete = (id: string, title: string) => {
    setBooks((prev) => prev.filter((b) => b.id !== id));
    toast.success(`"${title}" removed from catalog`);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-24 rounded-2xl" />
          ))}
        </div>
        <Skeleton className="h-64 rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6" data-ocid="book-catalog.page">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Book Catalog</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Library book collection management
          </p>
        </div>
        <Button
          onClick={() => setShowAdd(true)}
          data-ocid="book-catalog.primary_button"
        >
          <Plus className="w-4 h-4 mr-2" /> Add Book
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Total Books", value: books.length },
          { label: "Available Copies", value: totalAvailable },
          { label: "Issued Copies", value: totalIssued },
        ].map((s) => (
          <div
            key={s.label}
            className="bg-card border border-border rounded-2xl p-4 flex items-center gap-4"
          >
            <div className="p-2 rounded-xl bg-muted">
              <BookOpen className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-border">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by title or author..."
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              data-ocid="book-catalog.search_input"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/50">
                {[
                  "Title",
                  "Author",
                  "ISBN",
                  "Category",
                  "Total",
                  "Available",
                  "Actions",
                ].map((h) => (
                  <th
                    key={h}
                    className="text-left px-4 py-3 text-muted-foreground font-medium"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((book, idx) => (
                <tr
                  key={book.id}
                  className="border-t border-border hover:bg-muted/30 transition-colors"
                  data-ocid={`book-catalog.item.${idx + 1}`}
                >
                  <td className="px-4 py-3 font-medium text-foreground">
                    {book.title}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {book.author}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground text-xs">
                    {book.isbn}
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant="secondary">{book.category}</Badge>
                  </td>
                  <td className="px-4 py-3 text-foreground">
                    {book.totalCopies}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={
                        book.availableCopies === 0
                          ? "text-red-500 font-semibold"
                          : "text-green-600 font-semibold"
                      }
                    >
                      {book.availableCopies}
                    </span>
                  </td>
                  <td className="px-4 py-3 flex gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setEditBook(book);
                        setForm({
                          title: book.title,
                          author: book.author,
                          isbn: book.isbn,
                          category: book.category,
                          totalCopies: String(book.totalCopies),
                        });
                      }}
                      data-ocid={`book-catalog.edit_button.${idx + 1}`}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-destructive"
                      onClick={() => handleDelete(book.id, book.title)}
                      data-ocid={`book-catalog.delete_button.${idx + 1}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Dialog */}
      <Dialog open={showAdd} onOpenChange={setShowAdd}>
        <DialogContent data-ocid="book-catalog.dialog">
          <DialogHeader>
            <DialogTitle>Add New Book</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            {(
              ["title", "author", "isbn", "category", "totalCopies"] as const
            ).map((field) => (
              <div key={field}>
                <Label className="capitalize">
                  {field === "totalCopies" ? "Total Copies" : field}
                </Label>
                <Input
                  value={form[field]}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, [field]: e.target.value }))
                  }
                  data-ocid={`book-catalog.${field === "totalCopies" ? "input" : "input"}`}
                />
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowAdd(false)}
              data-ocid="book-catalog.cancel_button"
            >
              Cancel
            </Button>
            <Button onClick={handleAdd} data-ocid="book-catalog.submit_button">
              Add Book
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog
        open={!!editBook}
        onOpenChange={(o) => {
          if (!o) setEditBook(null);
        }}
      >
        <DialogContent data-ocid="book-catalog.dialog">
          <DialogHeader>
            <DialogTitle>Edit Book</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            {(
              ["title", "author", "isbn", "category", "totalCopies"] as const
            ).map((field) => (
              <div key={field}>
                <Label className="capitalize">
                  {field === "totalCopies" ? "Total Copies" : field}
                </Label>
                <Input
                  value={form[field]}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, [field]: e.target.value }))
                  }
                />
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setEditBook(null)}
              data-ocid="book-catalog.cancel_button"
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (!editBook) return;
                setBooks((prev) =>
                  prev.map((b) =>
                    b.id === editBook.id
                      ? { ...b, ...form, totalCopies: Number(form.totalCopies) }
                      : b,
                  ),
                );
                setEditBook(null);
                toast.success("Book updated");
              }}
              data-ocid="book-catalog.save_button"
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
