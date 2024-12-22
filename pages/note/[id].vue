<template>
  <div class="container mx-auto px-4 py-8">
    <div class="max-w-2xl mx-auto">
      <div class="flex justify-between items-center mb-8">
        <h1 class="text-3xl font-bold">
          {{ isNewNote ? "Новая заметка" : "Редактирование" }}
        </h1>
        <div class="flex space-x-4">
          <button
            @click="saveNote"
            class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Сохранить
          </button>
          <button
            @click="confirmCancel"
            class="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Отменить
          </button>
          <button
            v-if="!isNewNote"
            @click="confirmDelete"
            class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Удалить
          </button>
        </div>
      </div>

      <div class="space-y-6">
        <div>
          <input
            v-model="note.title"
            type="text"
            placeholder="Название заметки"
            class="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-blue-500"
            :class="{ 'border-red-500': showTitleError }"
          />
          <p
            v-if="showTitleError"
            class="mt-1 text-red-500 text-sm"
          >
            Обязательно к заполнению
          </p>
          <div
            v-if="!showTitleError"
            class="mt-1 text-red-500 text-sm h-5"
          ></div>
        </div>

        <div class="space-y-4">
          <div
            v-for="(todo, index) in note.todos"
            :key="todo.id"
            class="flex items-center space-x-4"
          >
            <input
              v-if="!isNewNote && todo.text.trim() !== ''"
              type="checkbox"
              v-model="todo.completed"
              class="form-checkbox"
            />
            <input
              v-model="todo.text"
              type="text"
              class="flex-1 px-4 py-2 border rounded focus:ring-2 focus:ring-blue-500"
            />
            <button
              @click="deleteTodo(index)"
              class="text-red-500 hover:text-red-600"
            >
              Удалить
            </button>
          </div>
        </div>

        <button
          @click="addTodo"
          class="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded hover:bg-gray-200"
        >
          Добавить задачу
        </button>
      </div>
    </div>

    <ConfirmDialog
      v-if="showConfirm"
      :message="confirmMessage"
      @confirm="handleConfirm"
      @cancel="handleCancel"
    />
  </div>
</template>

<script setup>
import { useNotesStore } from "@/stores/notes";
import { useConfirm } from "@/composables/useConfirm";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();
const notesStore = useNotesStore();
const showTitleError = ref(false);

const isNewNote = computed(() => route.params.id === "new");
const note = ref({
  id: isNewNote.value ? Date.now() : parseInt(route.params.id),
  title: "",
  todos: [],
});

const { showConfirm, confirmMessage, confirm, handleConfirm, handleCancel } =
  useConfirm();

onMounted(() => {
  if (!isNewNote.value) {
    const existingNote = notesStore.notes.find(
      (n) => n.id === parseInt(route.params.id)
    );
    if (existingNote) {
      note.value = {
        ...existingNote,
        todos: existingNote.todos.filter((todo) => todo.text.trim() !== ""),
      };
    }
  }
});

const addTodo = () => {
  const hasEmptyTodo = note.value.todos.some((todo) => todo.text.trim() === "");

  if (!hasEmptyTodo) {
    const newTodo = {
      id: Date.now() + Math.random(),
      text: "",
      completed: false,
    };
    note.value.todos.push(newTodo);
  }
};

const deleteTodo = (index) => {
  note.value.todos.splice(index, 1);
};

watch(
  () => note.value.title,
  (newTitle) => {
    if (newTitle.trim()) {
      showTitleError.value = false;
    }
  }
);

const saveNote = () => {
  if (!note.value.title.trim()) {
    showTitleError.value = true;
    return;
  }

  const filteredNote = {
    ...note.value,
    todos: note.value.todos.filter((todo) => todo.text.trim() !== ""),
  };

  if (isNewNote.value) {
    notesStore.addNote(filteredNote);
  } else {
    notesStore.updateNote(filteredNote.id, filteredNote);
  }
  router.push("/");
};

const confirmCancel = () => {
  confirm("Отменить редактирование?", () => {
    router.push("/");
  });
};

const confirmDelete = () => {
  confirm("Удалить заметку?", () => {
    notesStore.deleteNote(note.value.id);
    router.push("/");
  });
};
</script>
