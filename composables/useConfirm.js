export const useConfirm = () => {
  const showConfirm = ref(false);
  const confirmCallback = ref(null);
  const confirmMessage = ref("");

  const confirm = (message, callback) => {
    confirmMessage.value = message;
    confirmCallback.value = callback;
    showConfirm.value = true;
  };

  const handleConfirm = () => {
    if (confirmCallback.value) {
      confirmCallback.value();
    }
    showConfirm.value = false;
  };

  const handleCancel = () => {
    showConfirm.value = false;
  };

  return {
    showConfirm,
    confirmMessage,
    confirm,
    handleConfirm,
    handleCancel,
  };
};
