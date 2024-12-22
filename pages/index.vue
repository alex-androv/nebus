<template>
  <div class="container mx-auto px-4 py-8">
    <div class="flex justify-between items-center mb-8">
      <h1 class="text-3xl font-bold">Заметки</h1>
      <NuxtLink
        to="/note/new"
        class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Новая заметка
      </NuxtLink>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="note in notes"
        :key="note.id"
        class="bg-white rounded-lg shadow-md p-6"
      >
        <div class="flex justify-between items-start mb-4">
          <h2 class="text-xl font-semibold">{{ note.title }}</h2>
          <div class="flex space-x-2">
            <NuxtLink
              :to="`/note/${note.id}`"
              class="text-blue-500 hover:text-blue-600 mr-4"
            >
              Изменить
            </NuxtLink>
            <button
              @click="confirmDelete(note.id)"
              class="text-red-500 hover:text-red-600"
            >
              Удалить
            </button>
          </div>
        </div>

        <div class="space-y-2">
          <div
            v-for="todo in note.todos.slice(0, 3)"
            :key="todo.id"
            class="flex items-center space-x-2"
          >
            <span :class="{ 'line-through': todo.completed }">
              ◦ {{ todo.text }}
            </span>
          </div>
          <div
            v-if="note.todos.length > 3"
            class="text-gray-500 text-sm"
          >
            + еще {{ note.todos.length - 3 }}
          </div>
        </div>
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

const notesStore = useNotesStore();
const notes = computed(() => notesStore.notes);
const { showConfirm, confirmMessage, confirm, handleConfirm, handleCancel } =
  useConfirm();

const confirmDelete = (noteId) => {
  confirm("Вы уверены что хотите удалить заметку?", () => {
    notesStore.deleteNote(noteId);
  });
};

onMounted(() => {
  notesStore.loadFromLocalStorage();
});
</script>
