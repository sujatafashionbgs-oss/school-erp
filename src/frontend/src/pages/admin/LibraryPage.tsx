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
import { BookOpen, Edit2, Plus, Search, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface Book {
  id: number;
  title: string;
  author: string;
  isbn: string;
  copies: number;
  available: number;
  category: string;
}

const initialBooks: Book[] = [
  {
    id: 1,
    title: "Mathematics Class X",
    author: "R.D. Sharma",
    isbn: "978-81-7009-456-1",
    copies: 5,
    available: 3,
    category: "Textbook",
  },
  {
    id: 2,
    title: "Science NCERT Class IX",
    author: "NCERT",
    isbn: "978-81-7450-629-3",
    copies: 8,
    available: 5,
    category: "Textbook",
  },
  {
    id: 3,
    title: "Wings of Fire",
    author: "A.P.J. Abdul Kalam",
    isbn: "978-81-7450-294-3",
    copies: 3,
    available: 1,
    category: "Biography",
  },
  {
    id: 4,
    title: "Harry Potter and the Philosopher's Stone",
    author: "J.K. Rowling",
    isbn: "978-0-7475-3269-9",
    copies: 2,
    available: 2,
    category: "Fiction",
  },
  {
    id: 5,
    title: "The Discovery of India",
    author: "Jawaharlal Nehru",
    isbn: "978-0-19-563254-0",
    copies: 4,
    available: 4,
    category: "History",
  },
  {
    id: 6,
    title: "English Grammar",
    author: "Wren & Martin",
    isbn: "978-81-219-0184-3",
    copies: 10,
    available: 7,
    category: "Reference",
  },
];

const emptyBook = {
  title: "",
  author: "",
  isbn: "",
  copies: 1,
  available: 1,
  category: "",
};

export function LibraryPage() {
  const [search, setSearch] = useState("");
  const [books, setBooks] = useState<Book[]>(initialBooks);

  const [addOpen, setAddOpen] = useState(false);
  const [addForm, setAddForm] = useState<Omit<Book, "id">>(emptyBook);

  const [editBook, setEditBook] = useState<Book | null>(null);
  const [editForm, setEditForm] = useState<Omit<Book, "id">>(emptyBook);

  const [deleteBook, setDeleteBook] = useState<Book | null>(null);

  const filtered = books.filter(
    (b) =>
      b.title.toLowerCase().includes(search.toLowerCase()) ||
      b.author.toLowerCase().includes(search.toLowerCase()),
  );

  const handleAddSubmit = () => {
    if (!addForm.title || !addForm.author) {
      toast.error("Title and Author are required");
      return;
    }
    const newBook: Book = {
      ...addForm,
      id: Date.now(),
      copies: Number(addForm.copies),
      available: Number(addForm.available),
    };
    setBooks((prev) => [...prev, newBook]);
    toast.success("Book added");
    setAddOpen(false);
    setAddForm(emptyBook);
  };

  const handleEditOpen = (b: Book) => {
    setEditBook(b);
    setEditForm({
      title: b.title,
      author: b.author,
      isbn: b.isbn,
      copies: b.copies,
      available: b.available,
      category: b.category,
    });
  };

  const handleEditSave = () => {
    if (!editBook) return;
    setBooks((prev) =>
      prev.map((b) =>
        b.id === editBook.id
          ? {
              ...b,
              ...editForm,
              copies: Number(editForm.copies),
              available: Number(editForm.available),
            }
          : b,
      ),
    );
    toast.success("Book updated");
    setEditBook(null);
  };

  const handleDeleteConfirm = () => {
    if (!deleteBook) return;
    setBooks((prev) => prev.filter((b) => b.id !== deleteBook.id));
    toast.success("Book deleted");
    setDeleteBook(null);
  };

  const BookFormFields = ({
    form,
    setForm,
  }: {
    form: Omit<Book, "id">;
    setForm: (v: Omit<Book, "id">) => void;
  }) => (
    <div className="grid grid-cols-2 gap-3">
      {(
        [
          ["title", "Title", "text"],
          ["author", "Author", "text"],
          ["isbn", "ISBN", "text"],
          ["category", "Category", "text"],
          ["copies", "Total Copies", "number"],
          ["available", "Available", "number"],
        ] as [keyof Omit<Book, "id">, string, string][]
      ).map(([field, label, type]) => (
        <div key={field} className="space-y-1">
          <Label className="text-xs">{label}</Label>
          <Input
            type={type}
            value={String(form[field] ?? "")}
            onChange={(e) => setForm({ ...form, [field]: e.target.value })}
            className="h-8 text-sm"
            data-ocid={`library.book.${field}.input`}
          />
        </div>
      ))}
    </div>
  );

  return (
    <div className="space-y-5" data-ocid="library.page">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Library</h1>
        <Button onClick={() => setAddOpen(true)} data-ocid="library.add.button">
          <Plus size={16} className="mr-1" /> Add Book
        </Button>
      </div>
      <div className="relative max-w-md">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
        />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search books..."
          className="pl-9"
          data-ocid="library.search_input"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((b, i) => (
          <div
            key={b.id}
            className="bg-card border border-border rounded-2xl p-5"
            data-ocid={`library.item.${i + 1}`}
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                <BookOpen size={18} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-foreground truncate">
                  {b.title}
                </h3>
                <p className="text-xs text-muted-foreground">{b.author}</p>
                <Badge variant="outline" className="mt-1 text-xs">
                  {b.category}
                </Badge>
              </div>
              <div className="flex gap-1 shrink-0">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => handleEditOpen(b)}
                  data-ocid={`library.edit_button.${i + 1}`}
                >
                  <Edit2 size={13} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-destructive hover:text-destructive"
                  onClick={() => setDeleteBook(b)}
                  data-ocid={`library.delete_button.${i + 1}`}
                >
                  <Trash2 size={13} />
                </Button>
              </div>
            </div>
            <div className="flex justify-between mt-3 text-sm">
              <span className="text-muted-foreground">
                Available:{" "}
                <span className="text-foreground font-medium">
                  {b.available}/{b.copies}
                </span>
              </span>
              <Badge
                variant={b.available > 0 ? "default" : "destructive"}
                className="text-xs"
              >
                {b.available > 0 ? "In Stock" : "Out of Stock"}
              </Badge>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div
            className="col-span-3 text-center py-10 text-muted-foreground"
            data-ocid="library.empty_state"
          >
            No books found.
          </div>
        )}
      </div>

      {/* Add Book Dialog */}
      <Dialog
        open={addOpen}
        onOpenChange={(open) => {
          setAddOpen(open);
          if (!open) setAddForm(emptyBook);
        }}
      >
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Add New Book</DialogTitle>
          </DialogHeader>
          <BookFormFields form={addForm} setForm={setAddForm} />
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setAddOpen(false)}
              data-ocid="library.add.cancel_button"
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddSubmit}
              data-ocid="library.add.submit_button"
            >
              Add Book
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Book Dialog */}
      <Dialog
        open={!!editBook}
        onOpenChange={(open) => !open && setEditBook(null)}
      >
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Book</DialogTitle>
          </DialogHeader>
          <BookFormFields form={editForm} setForm={setEditForm} />
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setEditBook(null)}
              data-ocid="library.edit.cancel_button"
            >
              Cancel
            </Button>
            <Button
              onClick={handleEditSave}
              data-ocid="library.edit.save_button"
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog
        open={!!deleteBook}
        onOpenChange={(open) => !open && setDeleteBook(null)}
      >
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete Book</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Are you sure you want to delete{" "}
            <span className="font-semibold text-foreground">
              {deleteBook?.title}
            </span>
            ?
          </p>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteBook(null)}
              data-ocid="library.delete.cancel_button"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
              data-ocid="library.delete.confirm_button"
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
