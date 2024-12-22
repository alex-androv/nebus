import { defineStore } from "pinia";

export const useNotesStore = defineStore("notes", {
  state: () => ({
    notes: [],
  }),

  actions: {
    addNote(note) {
      this.notes.push({
        id: Date.now(),
        title: note.title,
        todos: note.todos.map((todo) => ({
          id: Date.now() + Math.random(),
          text: todo.text,
          completed: false,
        })),
      });
      this.saveToLocalStorage();
    },

    updateNote(noteId, updatedNote) {
      const index = this.notes.findIndex((n) => n.id === noteId);
      if (index !== -1) {
        this.notes[index] = { ...updatedNote };
        this.saveToLocalStorage();
      }
    },

    deleteNote(noteId) {
      const index = this.notes.findIndex((n) => n.id === noteId);
      if (index !== -1) {
        this.notes.splice(index, 1);
        this.saveToLocalStorage();
      }
    },

    saveToLocalStorage() {
      localStorage.setItem("notes", JSON.stringify(this.notes));
    },

    loadFromLocalStorage() {
      const saved = localStorage.getItem("notes");
      if (saved) {
        this.notes = JSON.parse(saved);
      }
    },
  },
});
