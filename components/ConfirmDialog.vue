<template>
  <div
    @click.self="$emit('cancel')"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
  >
    <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
      <p class="text-lg mb-6">{{ message }}</p>
      <div class="flex justify-end space-x-4">
        <button
          @click="$emit('cancel')"
          class="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          Отмена
        </button>
        <button
          @click="$emit('confirm')"
          class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          ОК
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  message: {
    type: String,
    required: true,
  },
});

defineEmits(["confirm", "cancel"]);
</script>
