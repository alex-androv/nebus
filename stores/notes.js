export const useNotesStore = defineStore("notes", () => {
  const notes = ref([]);

  function addNote(note) {
    notes.value.push({
      id: Date.now(),
      title: note.title,
      todos: note.todos.map((todo) => ({
        id: Date.now() + Math.random(),
        text: todo.text,
        completed: false,
      })),
    });
    saveToLocalStorage();
  }

  function updateNote(noteId, updatedNote) {
    const index = notes.value.findIndex((n) => n.id === noteId);
    if (index !== -1) {
      notes.value[index] = { ...updatedNote };
      saveToLocalStorage();
    }
  }

  function deleteNote(noteId) {
    const index = notes.value.findIndex((n) => n.id === noteId);
    if (index !== -1) {
      notes.value.splice(index, 1);
      saveToLocalStorage();
    }
  }

  function saveToLocalStorage() {
    localStorage.setItem("notes", JSON.stringify(notes.value));
  }

  function loadFromLocalStorage() {
    const saved = localStorage.getItem("notes");
    if (saved) {
      notes.value = JSON.parse(saved);
    }
  }

  return {
    notes,
    addNote,
    updateNote,
    deleteNote,
    loadFromLocalStorage,
  };
});
